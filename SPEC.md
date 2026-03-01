# Routine v1

Goal: a web-based personal time budgeting tool for 2 users.

Core:
- Categories (name, color)
- Targets per category: day/week/month (optional, parallel)
- Manual time logging (date + duration minutes + note)
- Dashboard: day/week/month/custom range aggregation
- Weekly Review note per isoWeek

Tech constraints:
- Backend: NestJS + TypeScript + Prisma + PostgreSQL
- Frontend: Next.js App Router + Tailwind + shadcn/ui
- Auth: JWT access token only (simple)
- Avoid over-engineering; ship in 2–3 weeks.

Primary UX:
- Manual “Add Time” is the main action.