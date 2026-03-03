Read CLAUDE_RULES.md and SPEC.md.

Milestone 2 (end runnable): Implement simple authentication in backend (NestJS).

Requirements:
- POST /auth/register { email, name?, password } -> create user with bcrypt passwordHash
- POST /auth/login { email, password } -> return { accessToken }
- GET /auth/me -> return current user info (JWT required)
- JWT expiry: 30d (configurable via env JWT_EXPIRES_IN, default 30d)
- Add JwtStrategy + JwtAuthGuard
- Protect routes per controller (not global):
  - AuthController: public register/login, protected me
  - Categories/Entries/Dashboard/Review controllers: all protected

Provide:
- exact curl commands to test register/login/me
- expected responses
- proposed commit message

All code/comments in English. Discussion in Vietnamese.
Keep it minimal. No refresh tokens. No NextAuth.