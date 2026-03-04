import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Period } from '../../generated/prisma';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { UpsertTargetsDto } from './dto/upsert-targets.dto';

const PERIOD_KEYS = [
  { key: 'day' as const, period: Period.DAY },
  { key: 'week' as const, period: Period.WEEK },
  { key: 'month' as const, period: Period.MONTH },
];

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  // Map targets array to { day, week, month } shape
  private toTargetMap(targets: { period: Period; minutes: number }[]) {
    return {
      day: targets.find((t) => t.period === Period.DAY)?.minutes ?? null,
      week: targets.find((t) => t.period === Period.WEEK)?.minutes ?? null,
      month: targets.find((t) => t.period === Period.MONTH)?.minutes ?? null,
    };
  }

  async findAll(userId: number) {
    const cats = await this.prisma.category.findMany({
      where: { userId, active: true },
      include: { targets: true },
      orderBy: [{ sortOrder: 'asc' }, { id: 'asc' }],
    });
    return cats.map(({ targets, ...cat }) => ({
      ...cat,
      targets: this.toTargetMap(targets),
    }));
  }

  async create(userId: number, dto: CreateCategoryDto) {
    const existing = await this.prisma.category.findUnique({
      where: { userId_name: { userId, name: dto.name } },
    });
    if (existing) throw new ConflictException('Category name already exists');

    const cat = await this.prisma.category.create({
      data: { userId, name: dto.name, color: dto.color ?? '#6366f1', sortOrder: dto.sortOrder ?? 0 },
      include: { targets: true },
    });
    return { ...cat, targets: this.toTargetMap(cat.targets) };
  }

  async update(userId: number, id: number, dto: UpdateCategoryDto) {
    await this.assertOwnership(userId, id);

    // Check name uniqueness only when name is being changed
    if (dto.name) {
      const conflict = await this.prisma.category.findFirst({
        where: { userId, name: dto.name, NOT: { id } },
      });
      if (conflict) throw new ConflictException('Category name already exists');
    }

    const cat = await this.prisma.category.update({
      where: { id },
      data: dto,
      include: { targets: true },
    });
    return { ...cat, targets: this.toTargetMap(cat.targets) };
  }

  async remove(userId: number, id: number) {
    await this.assertOwnership(userId, id);
    await this.prisma.category.delete({ where: { id } });
  }

  async upsertTargets(userId: number, categoryId: number, dto: UpsertTargetsDto) {
    await this.assertOwnership(userId, categoryId);

    await this.prisma.$transaction(async (tx) => {
      for (const { key, period } of PERIOD_KEYS) {
        const value = dto[key];
        if (value === undefined) continue; // key not in body, skip

        if (value === null) {
          await tx.categoryTarget.deleteMany({ where: { categoryId, period } });
        } else {
          await tx.categoryTarget.upsert({
            where: { categoryId_period: { categoryId, period } },
            create: { categoryId, period, minutes: value },
            update: { minutes: value },
          });
        }
      }
    });

    const cat = await this.prisma.category.findUniqueOrThrow({
      where: { id: categoryId },
      include: { targets: true },
    });
    return { ...cat, targets: this.toTargetMap(cat.targets) };
  }

  // Throws NotFoundException when category doesn't belong to userId
  private async assertOwnership(userId: number, categoryId: number) {
    const cat = await this.prisma.category.findFirst({
      where: { id: categoryId, userId },
    });
    if (!cat) throw new NotFoundException('Category not found');
  }
}
