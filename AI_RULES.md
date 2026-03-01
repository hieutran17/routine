# Routine – Claude Coding Rules (Global)

## Language
- Discussion: Vietnamese
- Code: English
- Code comments: English
- Commit messages: English (Conventional Commits)

## Vibe-coding workflow
- Work in small milestones. Each milestone must end in a runnable state.
- Before coding: summarize the plan in 3–7 bullet points.
- After coding: provide exact commands to run + expected output.
- Do not over-engineer. Prefer simplest solution that works for v1.

## Coding standards
- TypeScript strict mode where applicable.
- Validate inputs (backend) with NestJS standard validation (class-validator).
- Keep API responses consistent and minimal.
- Prefer server-side aggregation for dashboard.

## Git workflow
- After each milestone: propose a commit message.
- Do not bundle unrelated changes in one commit.

## Scope freeze v1
- Categories, Targets (day/week/month), Manual TimeEntry, Dashboard, Weekly Review note.
- No NextAuth, no monorepo tooling, no shared packages, no complex testing frameworks in v1.