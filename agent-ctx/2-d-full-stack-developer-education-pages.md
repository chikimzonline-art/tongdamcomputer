# Task 2-d — Education pages (computer-training / tailoring / hotel-management)

## Summary
Built the three /education/* pages inside the (public) route group, matching the emerald/amber design system from Tasks 2-a/2-b/2-c. All three pages are async Server Components that pull courses via `getCourses(institute)` and CMS text via `getSiteContentMap()`. Two inline enroll forms (computer-training, hotel-management) plus a small syllabus-download client component (tailoring) handle lead submission via `POST /api/leads`.

## Files created
- `src/app/(public)/education/computer-training/page.tsx` — 6 sections: hero with E-Max + Top 1 amber banners, Why Top 1 highlights, courses grid (DCA/ADCA/TALLY/WEB) with syllabus accordions, E-Max affiliation card + on-completion benefits, enroll form (course-select), CTA strip.
- `src/app/(public)/education/computer-training/enroll-form.tsx` — 'use client', react-hook-form + zod. Accepts `courses: CourseOption[]` prop. POSTs `source: "computer-training"`, `subject: "Course Enrollment: <course>"`.
- `src/app/(public)/education/tailoring/page.tsx` — 6 sections: hero with Hands-on Practical badge, overview + key facts, courses grid (TAILOR-BASIC / TAILOR-ADV) with syllabus accordions, 8-tile stylized gallery (gradient + icon, no photos), syllabus-download CTA, CTA band.
- `src/app/(public)/education/tailoring/syllabus-download.tsx` — 'use client', small button component. onClick fires sonner toast + reveals a link to `/contact?subject=Tailoring+Syllabus+Request`.
- `src/app/(public)/education/hotel-management/page.tsx` — 7 sections: hero with prominent 100% placement amber banner, placement-guarantee stats grid, detailed course breakdown with structured syllabus accordion (7 modules, each with dedicated icon + description), industry partnerships grid (4 partners), training facilities grid (4 labs), application form, CTA strip.
- `src/app/(public)/education/hotel-management/enroll-form.tsx` — 'use client', react-hook-form + zod. POSTs `source: "hotel-management"`, `subject: "Hotel Management Diploma Enrollment"`.

## Verification
- `bun run lint` → exit 0 (clean).
- `curl` spot-checks:
  - GET /education/computer-training → 200 (first-compile ~624ms, render ~568ms)
  - GET /education/tailoring → 200 (first-compile ~807ms, render ~321ms)
  - GET /education/hotel-management → 200 (first-compile ~553ms, render ~399ms)
- Rendered content confirmed: hero headings, badges, course codes (DCA / TALLY / TAILOR-BASIC / HM-DIPLOMA), placement banner text, gallery labels, and CTAs all present.

## Design system adherence
- Emerald primary (bg-emerald-600, text-emerald-700, hover:bg-emerald-700, emerald-50/100 soft tints).
- Amber accent (amber-500) for hero badges, "Featured" pills, CTA buttons, stat badges.
- NO blue or indigo anywhere.
- Geist Sans, consistent heading hierarchy (h1 text-4xl/5xl, h2 text-3xl).
- shadcn/ui (Card, Badge, Button, Accordion, Select, Input, Textarea, Label) + lucide-react.
- Sticky-footer pattern inherited from (public)/layout.tsx — no extra layout wrapper added.
- Anchor targets (#courses, #gallery, #enroll, #course) use scroll-mt-24 to clear the sticky header.

## Lead sources introduced
- `computer-training` — from the inline enroll form on /education/computer-training (subject is dynamic, "Course Enrollment: <selected course>").
- `hotel-management` — from the inline application form on /education/hotel-management (subject fixed: "Hotel Management Diploma Enrollment").
- `tailoring` — no inline form; enroll buttons route to /contact?subject=Tailoring+Enrollment, so those leads arrive via the existing contact form (source "contact", subject prefilled). Task 2-b's contact-form SUBJECTS enum already includes "Tailoring / Fashion Design Course".

## Notes for downstream agents (Task 3+ admin dashboard)
- Admin dashboard lead list/filter should include "computer-training" and "hotel-management" as filterable sources alongside existing "contact", "computer-works", "mobile-hub".
- The computer-training enroll form's course-select is data-driven from `getCourses("computer-training")` — adding/removing courses via /api/admin/courses propagates automatically.
- The hotel-management page renders the syllabus as a structured Accordion with a `SYLLABUS_MODULES` map providing per-topic icons + descriptions. New topics fall back to `FALLBACK_MODULE` (Award icon + generic description) — extend the map to enrich.
- The tailoring "Download Full Syllabus" button does NOT generate a real PDF — it shows a sonner toast and reveals a link to /contact. Swap for a real PDF route later if needed.

## Issues
None. All files lint clean, all three routes return 200, all expected content renders.
