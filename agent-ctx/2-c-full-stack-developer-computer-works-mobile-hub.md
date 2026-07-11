# Task 2-c — full-stack-developer (Computer Works + Mobile Hub)

## What I was asked to do
Build two public service pages inside the `(public)` route group, matching the shared emerald/amber design system established by Task 2-a and continued by Task 2-b:
- `/services/computer-works` — the Computer Works department (CSP UCO Bank, Aadhaar, DTP & Printing, Financial & Civil docs).
- `/services/mobile-hub` — the Tongdam Mobile Retailing & Training Center (retail + mobile repair training).

Each page must have: emerald-gradient hero + breadcrumb + content sections + an inquiry/enrollment form that POSTs to `/api/leads` with a distinct `source` string. Forms are separate `'use client'` components; pages are async Server Components.

## Files created
- `src/app/(public)/services/computer-works/page.tsx` — async Server Component. Sections: (a) emerald gradient hero with breadcrumb Home / Services / Computer Works + h1 + subtitle + 3 hero badges (Authorized CSP, Aadhaar Enabled, Multilingual Support); (b) 4-card services grid (CSP UCO Bank, Aadhaar & Public Identity, DTP & Printing, Financial & Civil Documentation) — each card has a gradient emerald icon tile, description, a "Pricing" mini-list inside an emerald-50 box (3-4 items with ₹ placeholders), amber tag badges, and a "Get this service →" button that scroll-links to `#inquiry`; (c) Why Choose Us — 4 trust cards (Authorized & Secure / Fast Turnaround / Transparent Pricing / Local & Trusted) with hover-lift; (d) Process — 4-step horizontal flow (Visit Office → Submit Documents → We Process → Collect Receipt) with numbered circles + arrow connectors on desktop; (e) Inquiry CTA `id="inquiry"` — 2-col layout: left side heading + clickable `tel:` phone card (from `contact.phone1` CMS) + working-hours card; right side a Card wrapping `<InquiryForm />`. Pulls `contact.phone1` from `getSiteContentMap()`.
- `src/app/(public)/services/computer-works/inquiry-form.tsx` — `'use client'`. react-hook-form + zod resolver. Fields: Name (2–120), Phone (7–30, digits/spaces/+/-/()), Service (Select with 4 options matching the card titles), Message (10–4000). POSTs to `/api/leads` with `source: "computer-works"`, `subject` = selected service name. sonner `toast.success`/`toast.error` feedback, success state with CheckCircle2 + "Send another inquiry" reset button. All inputs have `aria-invalid` + `aria-describedby` error ids. Submit button shows Loader2 spinner while `isSubmitting`. Unique HTML ids prefixed `cw-` to avoid collisions if multiple forms render on a page.
- `src/app/(public)/services/mobile-hub/page.tsx` — async Server Component. Fetches `getCourses("mobile-hub")` + `getSiteContentMap()` in parallel. Sections: (a) emerald gradient hero with breadcrumb Home / Services / Mobile Hub + h1 + subtitle + dual CTAs (amber "Browse Retail" + outline "Explore Training" scroll-linking to `#retail` / `#training`); (b) Dual-section intro — 2 cards side-by-side (Retail with emerald gradient icon tile + scroll-link to `#retail`; Training with amber gradient icon tile + scroll-link to `#training`); (c) Retail `id="retail"` — 6-card grid (Smartphones, Mobile Accessories, Chargers & Cables, Screen Guards & Covers, Power Banks, SIM & Recharge) each with icon + desc + "Visit store" note; followed by an emerald-100 info note strip with brands (Samsung, Xiaomi, Realme, Vivo, Oppo) + EMI options; (d) Training `id="training"` — renders all returned courses (currently 1: MOBILE-REPAIR). First course is marked "Featured". Each course card is a 2-col layout: left side emerald-gradient panel with course code badge, title, description, duration + fee stat tiles, and an amber "Enroll in this course" button scroll-linking to `#enroll`; right side has an `<Accordion type="multiple">` rendering each syllabus topic (comma-split from the `syllabus` field) as an expandable item with a brief description looked up via `TOPIC_DESCRIPTIONS` map (fallback generic). Below the course(s): a "Why learn mobile repair?" benefits row with 4 cards (High Demand / Low-Investment Startup / Quick Earning / Hands-on Practical) using amber icon tiles. Empty-state card if no courses found. (e) Enrollment CTA `id="enroll"` — 2-col: left heading + 3 checklist points + clickable `tel:` card; right Card wrapping `<EnrollForm />`.
- `src/app/(public)/services/mobile-hub/enroll-form.tsx` — `'use client'`. react-hook-form + zod. Fields: Name, Phone, Email (optional, RFC-ish regex), Message (10–4000). POSTs to `/api/leads` with `source: "mobile-hub"`, `subject: "Mobile Repair Course Enrollment"`. Same UX pattern as the inquiry form (sonner toast, success state, Loader2 spinner, aria error wiring). Unique HTML ids prefixed `enroll-`.

## Files modified
- None. Only created new files inside the `(public)/services/` route group. Layout inheritance (AlertBanner + Header + Footer) provided by Task 2-a's `src/app/(public)/layout.tsx`.

## Design system followed (consistency with 2-a / 2-b)
- Emerald primary (`emerald-600` / `emerald-700` hover), amber accent (`amber-500` / `amber-100` tints), no blue/indigo.
- Hero gradient: `bg-gradient-to-br from-emerald-700 via-emerald-600 to-teal-700 text-white` with the same grid-pattern overlay + amber/teal glow blobs as About/Contact pages.
- Breadcrumb pattern: `Home / Services / <Page>` with `ChevronRight` separators and `aria-current="page"` on the current crumb — exactly as Task 2-b established.
- shadcn/ui used: `Card`, `CardContent`, `Badge`, `Button`, `Input`, `Textarea`, `Label`, `Select` (inquiry form), `Accordion` + `AccordionItem` + `AccordionTrigger` + `AccordionContent` (syllabus). Icons from `lucide-react`.
- Forms follow the exact pattern from Task 2-b's `contact-form.tsx`: react-hook-form + zodResolver, controlled `Select` with `watch` + hidden `register` input, success state with `role="status"` + `aria-live="polite"`, sonner toast feedback, emerald submit button.
- `scroll-mt-24` on `#inquiry` / `#retail` / `#training` / `#enroll` sections so anchor links don't hide behind the sticky header.

## Verification
- `bun run lint` — passes clean (exit 0), no errors or warnings.
- `curl -s -o /dev/null -w "%{http_code}"` against the dev server:
  - `GET /services/computer-works` → 200 (first-compile ~2.7s, subsequent ~70ms).
  - `GET /services/mobile-hub` → 200 (first-compile ~1.3s).
- Content spot-check via `curl | grep`: both pages render expected headings, service titles, course code (MOBILE-REPAIR), benefits, and CTAs. HTML entities (`&` → `&amp;`) render correctly.
- No errors in `dev.log` after the requests.

## Notes for downstream agents
- Two new lead sources are now in play: `"computer-works"` and `"mobile-hub"`. The admin dashboard lead list (Task 3+) should treat these as filterable sources alongside the existing `"contact"` source.
- The mobile-hub page renders ALL active courses from the `mobile-hub` institute (not just MOBILE-REPAIR), so if an admin adds another course via `/api/admin/courses` with `institute: "mobile-hub"`, it will automatically appear on the page with the same accordion layout. The first one is auto-tagged "Featured".
- The `TOPIC_DESCRIPTIONS` map in `mobile-hub/page.tsx` is keyed by lowercased syllabus topic. To enrich descriptions for new topics added via the admin, extend that map — otherwise the generic "Practical, hands-on training on this module with real devices." fallback is shown.
- Anchor scroll targets use `scroll-mt-24` to clear the sticky header (z-50, ~64px tall). Future pages with hash navigation should follow the same offset.
- The inquiry/enroll forms do NOT use `useSearchParams` (would require a Suspense boundary). Card "Get this service" buttons simply scroll to `#inquiry` and the user picks a service in the select — kept simple and robust.
