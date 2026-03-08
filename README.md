## Setup

1. Install dependencies:

```bash
npm install
```

2. Configure database:

```bash
# update DATABASE_URL in .env
npm run db:migrate
```

3. Run app:

```bash
npm run dev
```

## Auth + Initial APIs

### Authentication

- `POST /api/auth/register` (supports `invitationToken`)
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`

Auth uses HTTP-only cookie session (`session_token`) and stores `activeFamilyTreeId` in session.

### Tenants (family trees)

- `GET /api/tenants`
- `POST /api/tenants`
- `POST /api/tenants/switch`

### Invitations

- `GET /api/invitations`
- `POST /api/invitations`
- `POST /api/invitations/accept`

### Family members (protected)

- `GET /api/family-members`
- `POST /api/family-members`
- `GET /api/family-members/:memberId`
- `PATCH /api/family-members/:memberId`
- `DELETE /api/family-members/:memberId`

All `/api/family-members/*` endpoints require authenticated session cookie + active tenant membership.

### Events (protected)

- `GET /api/events`
- `POST /api/events`
- `GET /api/events/:eventId`
- `PATCH /api/events/:eventId`
- `DELETE /api/events/:eventId`

### Dashboard (protected)

- `GET /api/dashboard/summary`
