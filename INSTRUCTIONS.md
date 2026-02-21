# 📅 Content Planner Application — Build Instructions

## Overview

A **full-stack content planning application** built with **Next.js (TypeScript/TSX)**, **Supabase** (auth + database), and **Prisma** (ORM). The app allows an admin to manage content calendars for multiple clients, plan social media posts by date, and share read-only calendar views with clients.

**Theme:** White · Red · Black  
**Mobile-first:** Fully responsive on all screen sizes

---

## Tech Stack

| Layer        | Technology                             |
|-------------|----------------------------------------|
| Framework    | Next.js 14+ (App Router, TypeScript)   |
| Styling      | Tailwind CSS                           |
| Database     | Supabase (PostgreSQL)                  |
| ORM          | Prisma                                 |
| Auth         | Supabase Auth (admin login)            |
| UI Components| shadcn/ui + Radix UI                   |
| Icons        | Lucide React + React Icons (social)    |
| Deployment   | Vercel                                 |

---

## Project Structure

```
content-planner/
├── app/
│   ├── layout.tsx                  # Root layout (fonts, global styles)
│   ├── page.tsx                    # Landing / login redirect
│   ├── login/page.tsx              # Admin login page
│   ├── dashboard/
│   │   ├── page.tsx                # Admin dashboard — list of client workspaces
│   │   └── layout.tsx              # Dashboard layout (sidebar/header)
│   ├── workspace/
│   │   └── [workspaceId]/
│   │       └── page.tsx            # Individual client calendar workspace
│   ├── share/
│   │   └── [shareToken]/
│   │       └── page.tsx            # Public read-only shared calendar view
│   └── api/
│       ├── workspaces/route.ts     # CRUD for workspaces
│       ├── posts/route.ts          # CRUD for calendar posts
│       └── share/route.ts          # Generate/revoke share links
│
├── components/
│   ├── auth/
│   │   └── LoginForm.tsx           # Admin login form
│   ├── dashboard/
│   │   ├── WorkspaceCard.tsx       # Card for each client workspace
│   │   ├── CreateWorkspaceModal.tsx # Modal to add new workspace
│   │   └── WorkspaceList.tsx       # Grid of workspace cards
│   ├── calendar/
│   │   ├── CalendarGrid.tsx        # Monthly calendar grid
│   │   ├── CalendarCell.tsx        # Individual date cell (shows icons + preview)
│   │   ├── PostDialog.tsx          # Dialog: view/create/edit post for a date
│   │   ├── MonthNavigator.tsx      # Prev/Next month navigation
│   │   └── MonthStats.tsx          # Stats below calendar (video count, etc.)
│   ├── share/
│   │   └── SharedCalendarView.tsx  # Read-only calendar for client link
│   └── ui/                         # shadcn/ui base components
│
├── lib/
│   ├── supabase/
│   │   ├── client.ts               # Supabase browser client
│   │   └── server.ts               # Supabase server client
│   ├── prisma.ts                   # Prisma client singleton
│   └── utils.ts                    # Utility helpers
│
├── prisma/
│   └── schema.prisma               # Database schema
│
├── types/
│   └── index.ts                    # Shared TypeScript types/interfaces
│
├── hooks/
│   ├── useWorkspaces.ts            # Fetch/mutate workspaces
│   └── usePosts.ts                 # Fetch/mutate posts for a workspace+month
│
├── middleware.ts                   # Auth guard (protect /dashboard, /workspace)
├── .env.local                      # Environment variables (not committed)
├── tailwind.config.ts
├── next.config.ts
└── package.json
```

---

## Database Schema (Prisma)

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}

model Workspace {
  id         String   @id @default(cuid())
  name       String
  clientName String
  shareToken String?  @unique   // generated UUID for public share link
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
  posts      Post[]
}

model Post {
  id          String    @id @default(cuid())
  workspaceId String
  workspace   Workspace @relation(fields: [workspaceId], references: [id], onDelete: Cascade)
  date        DateTime  // the calendar date this post belongs to
  description String    @db.Text
  platforms   Platform[]
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}

model Platform {
  id     String  @id @default(cuid())
  postId String
  post   Post    @relation(fields: [postId], references: [id], onDelete: Cascade)
  name   String  // e.g. "instagram", "tiktok", "youtube", "facebook", "twitter"
  url    String  // link to that specific post on the platform
}
```

---

## Environment Variables

Create `.env.local` in the project root:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Prisma / Database
DATABASE_URL=your_supabase_pooler_connection_string
DIRECT_URL=your_supabase_direct_connection_string

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## Feature Breakdown

### 1. Admin Authentication
- Supabase Auth (email/password login)
- Only one admin account needed (can be created manually in Supabase dashboard)
- `middleware.ts` protects all `/dashboard` and `/workspace` routes
- Redirect unauthenticated users to `/login`

---

### 2. Dashboard — Client Workspace Management

**Route:** `/dashboard`

- Displays a **grid of workspace cards**, one per client
- Each card shows:
  - Client/workspace name
  - Number of posts this month
  - Edit (rename) and Delete buttons
- Floating **"+ New Workspace"** button opens a modal
- Modal fields: `Workspace Name`, `Client Name`
- On success, card appears in grid

**Admin actions:**
- ✅ Create workspace
- ✅ Rename workspace
- ✅ Delete workspace (with confirmation dialog)

---

### 3. Individual Workspace — Calendar View

**Route:** `/workspace/[workspaceId]`

- Full **monthly calendar grid** (7 columns, Mon–Sun or Sun–Sat)
- Month navigation: `← Previous` / `Next →` buttons
- Current day highlighted
- Each **date cell** shows:
  - Day number
  - Social media icons for platforms with posts (small colored icons)
  - Truncated description preview (1 line, fade out)

**Admin click on date → Post Dialog opens:**

#### Post Dialog (Create/Edit)
- Date displayed as header (e.g., `Saturday, 15 February 2025`)
- `Description` textarea
- **Platform buttons** (toggle on/off):
  - Instagram 📸
  - TikTok 🎵
  - YouTube ▶️
  - Facebook 👤
  - Twitter/X 🐦
  - LinkedIn 💼
- For each active platform: input field for the **post URL/link**
- `Save` button → saves to DB
- `Clear` button → removes post data for that date
- Escape key / backdrop click closes dialog

---

### 4. Month Stats — Below Calendar

Below the calendar grid, display a **stats bar/section**:

| Stat | Description |
|------|-------------|
| Total Posts | Count of all posts this month |
| Videos | Posts with YouTube or TikTok links |
| Instagram Posts | Posts with Instagram links |
| TikTok Posts | Posts with TikTok links |
| Platforms Active | Number of distinct platforms used |
| Days Planned | Count of days that have at least one post |

---

### 5. Share Link (Client View)

- In the workspace header, show a **"Share Calendar"** button
- Clicking generates a unique `shareToken` (UUID v4) and saves it to the `Workspace` record
- The shareable URL is: `https://yourapp.com/share/[shareToken]`
- Copy-to-clipboard button shown alongside the URL
- Option to **revoke** the share link (sets `shareToken` to `null`)

**Public Route:** `/share/[shareToken]`
- No authentication required
- Read-only view of the calendar
- Client can navigate between months using `← →` buttons
- Date cells are **not clickable** (view only)
- No admin controls visible
- Shows month stats below calendar

---

### 6. Design System

#### Color Palette
```
Primary Red:   #E01E1E  (buttons, highlights, active states)
Dark:          #111111  (primary text, dark backgrounds)
White:         #FFFFFF  (backgrounds, cards)
Light Gray:    #F5F5F5  (alternate backgrounds, borders)
Red Hover:     #B01515  (hover state for red elements)
Muted:         #6B7280  (secondary text)
```

#### Typography
- Font: **Inter** (Google Fonts)
- Headings: Bold, dark
- Body: Regular, dark/muted

#### Component Style Rules
- Cards: White bg, subtle shadow, rounded-xl
- Buttons: Red background, white text, hover darkens red
- Dialogs: White, backdrop blur, rounded-2xl
- Calendar cells: White base, red accent on hover, border on today
- Social icons: Brand colors (Instagram gradient, TikTok black, YouTube red, etc.)
- Mobile: Stacked layouts, full-width dialogs, touch-friendly tap targets (min 44px)

---

### 7. Social Platform Icons & Colors

| Platform  | Icon Source          | Brand Color         |
|-----------|----------------------|---------------------|
| Instagram | react-icons/fa       | `#E1306C` (gradient)|
| TikTok    | react-icons/fa       | `#010101`           |
| YouTube   | react-icons/fa       | `#FF0000`           |
| Facebook  | react-icons/fa       | `#1877F2`           |
| Twitter/X | react-icons/fa       | `#1DA1F2`           |
| LinkedIn  | react-icons/fa       | `#0A66C2`           |

---

## Pages Summary

| Route                        | Who Can Access | Description                          |
|-----------------------------|----------------|--------------------------------------|
| `/`                         | Everyone       | Redirects to login or dashboard      |
| `/login`                    | Public         | Admin login page                     |
| `/dashboard`                | Admin only     | Workspace management                 |
| `/workspace/[workspaceId]`  | Admin only     | Monthly calendar for a client        |
| `/share/[shareToken]`       | Public         | Read-only client calendar view       |

---

## API Routes (Next.js Route Handlers)

### Workspaces
- `GET /api/workspaces` — List all workspaces
- `POST /api/workspaces` — Create new workspace
- `PATCH /api/workspaces/[id]` — Update name
- `DELETE /api/workspaces/[id]` — Delete workspace

### Posts
- `GET /api/posts?workspaceId=...&month=...&year=...` — Get posts for a month
- `POST /api/posts` — Create/update post for a date
- `DELETE /api/posts/[id]` — Delete a post

### Share
- `POST /api/share/[workspaceId]` — Generate share token
- `DELETE /api/share/[workspaceId]` — Revoke share token
- `GET /api/share/[token]` — Fetch shared workspace data (public)

---

## Setup Instructions

### 1. Initialize Project

```bash
npx create-next-app@latest content-planner \
  --typescript --tailwind --app --src-dir=false --import-alias="@/*"
cd content-planner
```

### 2. Install Dependencies

```bash
# Core
npm install @prisma/client @supabase/supabase-js @supabase/ssr

# UI
npm install @radix-ui/react-dialog @radix-ui/react-dropdown-menu \
  lucide-react react-icons class-variance-authority clsx tailwind-merge

# shadcn/ui setup
npx shadcn@latest init
npx shadcn@latest add button dialog input textarea card badge toast

# Dev
npm install -D prisma
```

### 3. Prisma Setup

```bash
npx prisma init
# Edit prisma/schema.prisma with the schema defined above
npx prisma generate
npx prisma db push
```

### 4. Supabase Setup
- Create a new Supabase project
- Go to Settings → Database → Connection string → copy **Transaction** URI to `DATABASE_URL` and **Direct** URI to `DIRECT_URL`
- Go to Settings → API → copy URL and anon key
- In Supabase Auth → create one admin user (Email/Password)
- Enable RLS on all tables (Prisma handles queries server-side with service role)

---

## Development Order (Recommended Build Sequence)

1. **Project init** — Next.js + Tailwind + shadcn
2. **Supabase + Prisma** — DB schema, migrations, client setup
3. **Auth** — Login page, middleware, session handling
4. **Dashboard** — Workspace CRUD (list, create, rename, delete)
5. **Calendar** — Grid component, month navigation
6. **Post Dialog** — Create/edit posts with platform links
7. **Month Stats** — Analytics below the calendar
8. **Share Link** — Token generation, public read-only view
9. **Polish** — Responsive design, animations, loading states, error handling

---

## Mobile Responsiveness Notes

- Dashboard: Single-column card grid on mobile
- Calendar: Compact cells, scrollable horizontally on very small screens, or condensed day labels (M/T/W...)
- Post Dialog: Full-screen bottom sheet on mobile
- Platform buttons: 2-column grid on mobile instead of row
- Share button: visible in sticky header/footer on mobile

---

## Accessibility

- All dialogs trap focus and support `Escape` to close
- Buttons have `aria-label` attributes
- Color contrast meets WCAG AA (white on red is compliant)
- Interactive elements have visible focus rings
- Platform toggles use `role="checkbox"` semantics

---

## Future Enhancements (Out of Scope for V1)

- [ ] Multiple admin accounts / team collaboration
- [ ] Client-side commenting on posts
- [ ] Post scheduling / automatic publishing via APIs
- [ ] Drag-and-drop rescheduling
- [ ] Export calendar to PDF
- [ ] Email notifications / reminders
- [ ] Analytics dashboard with charts
