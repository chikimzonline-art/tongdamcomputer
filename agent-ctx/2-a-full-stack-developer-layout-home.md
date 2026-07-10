# Task 2-a — full-stack-developer (Layout + Home)

## What I was asked to do
Build the global public layout (AlertBanner + sticky Header + Footer), the (public) route group, root layout wiring (NextAuth SessionProvider + sonner Toaster + Tongdam metadata), and the Home page.

## Files created
- `src/components/providers/session-provider.tsx` — 'use client' wrapper around `next-auth/react` SessionProvider.
- `src/components/site/alert-banner.tsx` — Server component. Calls `getActiveBanner()` and renders nothing if absent; otherwise hands off to the client dismiss wrapper.
- `src/components/site/alert-banner-client.tsx` — Client component. Uses `useSyncExternalStore` to read a per-message localStorage dismissed flag (avoids setState-in-effect lint error). Dismiss button writes localStorage and dispatches a synthetic `storage` event so the snapshot re-reads.
- `src/components/site/header.tsx` — Sticky `top-0 z-50` navbar with backdrop blur. Emerald `Cpu` logo + wordmark, desktop nav with shadcn `DropdownMenu` for Services / Education / Lifestyle (each item: icon + description), direct About/Contact links, amber-tinted "Enroll Now" `Button` linking to `/education/computer-training`. Mobile: hamburger opens shadcn `Sheet` with stacked grouped nav.
- `src/components/site/footer.tsx` — Server component, dark `bg-emerald-950 text-emerald-50`. Four columns: brand + E-Max affiliation badge, quick links, contact (from `getSiteContentMap`, with Phone/Mail/MapPin icons + `tel:`/`mailto:` links), departments list. Bottom bar: copyright (with low-contrast link to `/admin/login` disguised as the © year), founder attribution, E-Max badge.
- `src/app/(public)/layout.tsx` — `flex min-h-screen flex-col` wrapper rendering AlertBanner → SiteHeader → `<main class="flex-1">` → SiteFooter. Sticky-footer pattern.
- `src/app/(public)/page.tsx` — Async server component (Home page). Sections: Hero (emerald gradient + grid pattern + glow accents + badge + dual CTA), Stats bar (4 stats), Departments grid (`id="departments"`, 6 hover-lift cards), Quick actions (3 cards), Story snippet (2-col: brand story + founder chip + Read-our-story CTA + growth timeline card with Top 1 E-Max badge), CTA band (emerald gradient + call/contact CTAs + email/address strip). All text from `getSiteContentMap`.

## Files modified
- `src/app/layout.tsx` — Tongdam metadata (title template, description, keywords covering computer training / Aadhaar / CSP / tailoring / hotel management / restaurant / Manipur, OG/Twitter, `icons.icon=/logo.svg`), Geist fonts, `SessionProviderWrapper`, sonner `Toaster`.

## Files deleted
- `src/app/page.tsx` — moved into the `(public)` route group (cannot coexist with `(public)/page.tsx` since both map to `/`).

## Design system followed (so other agents stay cohesive)
- Primary: emerald-600 / emerald-700 (hover). Soft: emerald-50 / emerald-100. Dark: emerald-950 (footer).
- Accent: amber-500 (CTAs, badges, icons).
- No blue / indigo anywhere.
- Gradients: `bg-gradient-to-br from-emerald-700 via-emerald-600 to-teal-700` for hero/CTA bands.
- Sticky header: `sticky top-0 z-50` + `bg-background/80 backdrop-blur`.
- Sticky footer pattern handled by `(public)/layout.tsx` (`flex flex-col` + `main.flex-1`).
- shadcn/ui components used: `Button`, `Card`, `CardContent`, `Badge`, `Sheet`, `SheetContent`, `SheetTrigger`, `SheetClose`, `SheetTitle`, `DropdownMenu`, `DropdownMenuTrigger`, `DropdownMenuContent`, `DropdownMenuItem`. Icons from `lucide-react`.

## Notes for downstream agents
- **Create other public pages under `src/app/(public)/<segment>/page.tsx`** so they inherit the AlertBanner + Header + Footer shell automatically. Do NOT add another layout wrapper that duplicates the shell.
- The header nav links to: `/services/computer-works`, `/services/mobile-hub`, `/education/computer-training`, `/education/tailoring`, `/education/hotel-management`, `/lifestyle/restaurant`, `/about`, `/contact`. These routes need to exist for the nav to not 404.
- The footer copyright text is itself a low-contrast link to `/admin/login` — keep this in place; do not duplicate the admin login link elsewhere in the public UI.
- `getSiteContentMap()` is the canonical way to pull CMS text on any server page. Keys currently seeded: `hero.title`, `hero.subtitle`, `about.founder`, `about.foundedYear`, `about.story`, `contact.phone1`, `contact.phone2`, `contact.email`, `contact.address`, `training.emaxBadge`, `training.topRank`, `hotel.placement`.
- Public lead submission: `POST /api/leads` with `{ name, email?, phone, source, subject, message }`.

## Verification
- `bun run lint` exits 0 (clean).
- `GET /` returns 200 in dev server; Prisma queries for AlertBanner + SiteContent run on every render.
- `/api/auth/session` responds for the SessionProvider wrapper.
