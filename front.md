# 🎨 HireIQ BD — Frontend Agent Master Instruction v2.0
# ⚠️ COMPLETE REWRITE — Previous version had color + UI issues

---

## 🚨 CRITICAL ISSUES TO FIX (From Screenshot Review)

The current build has these problems that MUST be fixed:

1. ❌ **Color palette wrong** — Background is pitch black (#0B0F19), should be deep navy with warm red accents
2. ❌ **Hero section text too small** — H1 needs to be 56-64px, bold, commanding
3. ❌ **Stats section incomplete** — Numbers cut off, layout broken
4. ❌ **AI Features section missing** — "Proprietary IQ Matching Engine" section is incomplete
5. ❌ **Testimonials broken** — Only showing one partial quote
6. ❌ **Blog section incomplete** — Cards not rendering properly
7. ❌ **Colors not applied consistently** — Red #EB4C4C only on a few elements
8. ❌ **Section backgrounds identical** — No visual separation between sections
9. ❌ **Swagger not showing** — Backend swagger docs not accessible

**READ THIS ENTIRE FILE BEFORE WRITING A SINGLE LINE OF CODE.**

---

## 🎨 DESIGN SYSTEM — NON-NEGOTIABLE

### Color Palette (FINAL — DO NOT CHANGE)

```css
/* globals.css — REPLACE EVERYTHING WITH THIS */

@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

:root {
  /* ===== BRAND COLORS ===== */
  --red-primary: #EB4C4C;
  --red-hover: #D63E3E;
  --red-coral: #FF7070;
  --red-peach: #FFA6A6;
  --red-cream: #FFEDC7;
  --red-light: #FFF5F5;

  /* ===== LIGHT MODE ===== */
  --bg-base: #FFFFFF;
  --bg-muted: #FFF5F5;
  --bg-cream: #FFEDC7;
  --bg-card: #FFFFFF;
  --text-primary: #0F172A;
  --text-secondary: #475569;
  --text-muted: #94A3B8;
  --border-color: #FFE4E4;
  --shadow-sm: 0 1px 3px rgba(235,76,76,0.08);
  --shadow-md: 0 4px 16px rgba(235,76,76,0.12);
  --shadow-lg: 0 8px 32px rgba(235,76,76,0.16);

  /* ===== SHADCN OVERRIDES ===== */
  --background: 0 0% 100%;
  --foreground: 222 47% 11%;
  --primary: 0 75% 60%;
  --primary-foreground: 0 0% 100%;
  --secondary: 0 100% 96%;
  --secondary-foreground: 0 75% 30%;
  --muted: 30 100% 96%;
  --muted-foreground: 215 16% 47%;
  --accent: 0 100% 72%;
  --accent-foreground: 222 47% 11%;
  --destructive: 0 84% 60%;
  --destructive-foreground: 0 0% 100%;
  --border: 0 30% 92%;
  --input: 0 30% 92%;
  --ring: 0 75% 60%;
  --radius: 0.75rem;
  --card: 0 0% 100%;
  --card-foreground: 222 47% 11%;
  --popover: 0 0% 100%;
  --popover-foreground: 222 47% 11%;
}

.dark {
  --bg-base: #0B1120;
  --bg-muted: #111827;
  --bg-cream: #1A1A2E;
  --bg-card: #1E293B;
  --text-primary: #F1F5F9;
  --text-secondary: #CBD5E1;
  --text-muted: #64748B;
  --border-color: #1E293B;

  --background: 222 47% 7%;
  --foreground: 210 40% 98%;
  --primary: 0 75% 60%;
  --primary-foreground: 0 0% 100%;
  --secondary: 222 30% 18%;
  --secondary-foreground: 210 40% 98%;
  --muted: 222 30% 14%;
  --muted-foreground: 215 20% 60%;
  --accent: 0 100% 72%;
  --accent-foreground: 0 0% 100%;
  --card: 222 30% 11%;
  --card-foreground: 210 40% 98%;
  --border: 222 30% 18%;
  --input: 222 30% 18%;
  --popover: 222 30% 11%;
  --popover-foreground: 210 40% 98%;
}

* {
  font-family: 'Plus Jakarta Sans', sans-serif;
  box-sizing: border-box;
}

body {
  background-color: var(--bg-base);
  color: var(--text-primary);
  -webkit-font-smoothing: antialiased;
}
```

### Section Background Alternating Pattern (STRICT)

```
Section 1  HeroSection          bg-white          dark:bg-[#0B1120]      full bleed
Section 2  TrustedBy            bg-[#FFF5F5]       dark:bg-[#111827]      logos strip
Section 3  FeaturedJobs         bg-white           dark:bg-[#0B1120]
Section 4  CategoriesSection    bg-[#FFF5F5]       dark:bg-[#111827]
Section 5  HowItWorks           bg-white           dark:bg-[#0B1120]
Section 6  StatsSection         bg-[#EB4C4C]       text-white              BOLD RED
Section 7  AIFeaturesSection    bg-white           dark:bg-[#0B1120]
Section 8  TestimonialsSection  bg-[#FFF5F5]       dark:bg-[#111827]
Section 9  BlogPreview          bg-white           dark:bg-[#0B1120]
Section 10 FAQSection           bg-[#FFF5F5]       dark:bg-[#111827]
Section 11 CTASection           bg-[#EB4C4C]       text-white              BOLD RED
Section 12 NewsletterSection    bg-[#FFEDC7]       dark:bg-[#111827]
Footer                          bg-[#0F0808]       text-white              DEEP DARK
```

### Typography Scale

```
H1 (Hero):     text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight
H2 (Section):  text-3xl md:text-4xl font-bold
H3 (Card):     text-lg md:text-xl font-semibold
Body:          text-base font-normal text-[var(--text-secondary)]
Small:         text-sm text-[var(--text-muted)]
Label pill:    text-xs font-semibold uppercase tracking-widest
```

### Spacing System (8px grid STRICTLY)

```
Section padding:   py-20 md:py-28
Container:         max-w-7xl mx-auto px-4 md:px-8
Card padding:      p-6
Gap between cards: gap-6
Section gap:       mb-12
```

---

## 📁 COMPLETE FOLDER STRUCTURE

```
hireiq-frontend/
├── public/
│   ├── logo.svg
│   └── og-image.png
├── src/
│   ├── app/
│   │   ├── globals.css                         ← FULL CSS above
│   │   ├── layout.tsx                          ← ThemeProvider + LenisProvider + QueryProvider + Toaster
│   │   ├── loading.tsx                         ← Root skeleton
│   │   ├── not-found.tsx                       ← Custom 404
│   │   ├── error.tsx                           ← Error boundary
│   │   ├── (public)/
│   │   │   ├── page.tsx                        ← Home (all 12 sections)
│   │   │   ├── jobs/
│   │   │   │   ├── page.tsx                    ← Explore page
│   │   │   │   ├── loading.tsx
│   │   │   │   └── [id]/
│   │   │   │       ├── page.tsx                ← Job detail
│   │   │   │       └── loading.tsx
│   │   │   ├── blog/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [slug]/page.tsx
│   │   │   ├── about/page.tsx
│   │   │   ├── contact/page.tsx
│   │   │   └── ai-tools/page.tsx
│   │   ├── (auth)/
│   │   │   ├── login/page.tsx
│   │   │   └── register/page.tsx
│   │   └── dashboard/
│   │       ├── layout.tsx
│   │       ├── loading.tsx
│   │       ├── admin/
│   │       │   ├── page.tsx
│   │       │   ├── users/page.tsx
│   │       │   ├── jobs/page.tsx
│   │       │   ├── applications/page.tsx
│   │       │   ├── blogs/page.tsx
│   │       │   ├── messages/page.tsx
│   │       │   └── settings/page.tsx
│   │       ├── employer/
│   │       │   ├── page.tsx
│   │       │   ├── post-job/page.tsx
│   │       │   ├── my-jobs/page.tsx
│   │       │   ├── applicants/page.tsx
│   │       │   └── profile/page.tsx
│   │       └── jobseeker/
│   │           ├── page.tsx
│   │           ├── applications/page.tsx
│   │           ├── saved-jobs/page.tsx
│   │           ├── ai-cv/page.tsx
│   │           ├── ai-interview/page.tsx
│   │           └── profile/page.tsx
│   ├── components/
│   │   ├── ui/                                 ← shadcn auto-generated (DO NOT EDIT)
│   │   ├── shared/
│   │   │   ├── Navbar.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── ThemeToggle.tsx
│   │   │   ├── LenisProvider.tsx
│   │   │   ├── DashboardSidebar.tsx
│   │   │   └── AIChatSidebar.tsx
│   │   ├── home/
│   │   │   ├── HeroSection.tsx
│   │   │   ├── TrustedBySection.tsx
│   │   │   ├── FeaturedJobs.tsx
│   │   │   ├── CategoriesSection.tsx
│   │   │   ├── HowItWorks.tsx
│   │   │   ├── StatsSection.tsx
│   │   │   ├── AIFeaturesSection.tsx
│   │   │   ├── TestimonialsSection.tsx
│   │   │   ├── BlogPreview.tsx
│   │   │   ├── FAQSection.tsx
│   │   │   ├── CTASection.tsx
│   │   │   └── NewsletterSection.tsx
│   │   ├── jobs/
│   │   │   ├── JobCard.tsx
│   │   │   ├── JobCardSkeleton.tsx
│   │   │   ├── JobFilter.tsx
│   │   │   ├── ApplyModal.tsx
│   │   │   └── JobDetailTabs.tsx
│   │   ├── ai/
│   │   │   ├── CVAnalyzer.tsx
│   │   │   ├── JobMatcher.tsx
│   │   │   └── InterviewCoach.tsx
│   │   └── dashboard/
│   │       ├── OverviewCard.tsx
│   │       ├── RevenueChart.tsx
│   │       ├── CategoryChart.tsx
│   │       ├── StatusPieChart.tsx
│   │       └── DataTable.tsx
│   ├── lib/
│   │   ├── utils.ts
│   │   ├── axiosInstance.ts
│   │   └── auth.config.ts
│   ├── hooks/
│   │   ├── useDebounce.ts
│   │   ├── useFilterURL.ts
│   │   └── useAIChat.ts
│   ├── store/
│   │   └── useSavedJobsStore.ts
│   └── types/
│       └── index.ts
```

---

## 🚀 SETUP COMMANDS (Run in order)

```bash
# Step 1: Create Next.js app
npx create-next-app@latest hireiq-frontend \
  --typescript --tailwind --app --src-dir \
  --import-alias "@/*" --no-git

cd hireiq-frontend

# Step 2: Install all dependencies
npm install \
  lenis \
  gsap \
  framer-motion \
  next-themes \
  next-auth \
  axios \
  @tanstack/react-query \
  @tanstack/react-query-devtools \
  zustand \
  react-hook-form \
  @hookform/resolvers \
  zod \
  sonner \
  lucide-react \
  date-fns

# Step 3: Init shadcn/ui
npx shadcn@latest init
# When prompted:
# ✓ Style: Default
# ✓ Base color: Neutral
# ✓ CSS variables: Yes
# ✓ Tailwind config: tailwind.config.ts

# Step 4: Add ALL shadcn components
npx shadcn@latest add \
  button input card badge dialog table \
  dropdown-menu skeleton select sheet \
  separator avatar tabs tooltip form \
  label textarea progress accordion chart \
  popover command scroll-area

# Step 5: Replace globals.css with the CSS from DESIGN SYSTEM section above
```

---

## 🏠 SECTION-BY-SECTION IMPLEMENTATION

### Section 1: Navbar (`Navbar.tsx`)

```tsx
/**
 * EXACT REQUIREMENTS:
 * - position: sticky top-0 z-50
 * - backdrop-blur-md bg-white/90 dark:bg-[#0B1120]/90
 * - border-b border-[#FFE4E4] dark:border-[#1E293B]
 * - height: h-16
 * - Container: max-w-7xl mx-auto px-4 md:px-8
 *
 * LEFT: Logo
 *   <span className="font-extrabold text-xl">
 *     <span className="text-[#0F172A] dark:text-white">Hire</span>
 *     <span className="text-[#EB4C4C]">IQ</span>
 *     <span className="text-[#0F172A] dark:text-white"> BD</span>
 *   </span>
 *
 * CENTER (hidden on mobile): nav links
 *   - text-sm font-medium text-[var(--text-secondary)]
 *   - hover:text-[#EB4C4C] transition-colors
 *   - Active: text-[#EB4C4C] font-semibold
 *   - Links: Home | Jobs | AI Tools | Blog | About | Contact
 *
 * RIGHT:
 *   Logged out:
 *     - ThemeToggle component
 *     - "Login" → variant="ghost" className="text-[#EB4C4C] hover:bg-[#FFF5F5]"
 *     - "Get Started" → bg-[#EB4C4C] hover:bg-[#D63E3E] text-white rounded-full px-6
 *
 *   Logged in:
 *     - ThemeToggle
 *     - Notification bell icon with red badge
 *     - Avatar dropdown (shadcn DropdownMenu):
 *         Profile, Dashboard, Saved Jobs, ── , Logout
 *
 * MOBILE:
 *   - Show hamburger menu (Menu icon from lucide-react)
 *   - Opens shadcn Sheet from right
 *   - Sheet content: logo + stacked nav links + auth buttons
 *   - MUST work perfectly at 375px
 */
```

### Section 2: Hero (`HeroSection.tsx`)

```tsx
/**
 * EXACT REQUIREMENTS:
 * - bg-white dark:bg-[#0B1120]
 * - min-height: min-h-[65vh]
 * - padding: pt-20 pb-16
 * - Layout: 2-column on desktop (60% left, 40% right)
 *
 * LEFT COLUMN:
 *   1. Badge pill:
 *      <span className="inline-flex items-center gap-2 bg-[#FFF5F5] border border-[#FFA6A6]
 *             text-[#EB4C4C] text-xs font-semibold px-4 py-1.5 rounded-full mb-6">
 *        <Sparkles size={12} /> AI-Powered Job Matching
 *      </span>
 *
 *   2. H1 — MUST be this size:
 *      <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.1]
 *                     text-[#0F172A] dark:text-white mb-6">
 *        Find Your Dream Job<br/>
 *        in <span className="text-[#EB4C4C]">Bangladesh</span>
 *      </h1>
 *
 *   3. Subtitle:
 *      <p className="text-lg md:text-xl text-[#475569] dark:text-[#94A3B8] mb-8 max-w-xl">
 *        AI-powered matching connects top talent with Bangladesh's best companies.
 *        40,000+ opportunities waiting for you.
 *      </p>
 *
 *   4. Search Bar (white card, shadow):
 *      <div className="flex flex-col md:flex-row gap-3 bg-white dark:bg-[#1E293B]
 *                      rounded-2xl p-2 shadow-lg border border-[#FFE4E4]
 *                      dark:border-[#1E293B] max-w-2xl">
 *        <Input placeholder="Job title, skills, company..." className="flex-1 border-0 shadow-none" />
 *        <Select> districts list </Select>
 *        <Button className="bg-[#EB4C4C] hover:bg-[#D63E3E] text-white rounded-xl px-8">
 *          Find Jobs
 *        </Button>
 *      </div>
 *
 *   5. Stat chips row (fetch from /api/v1/stats/overview):
 *      4 chips: "40K+ Jobs" | "5K+ Companies" | "2K+ Hired" | "64 Districts"
 *      Each: <span className="flex items-center gap-1.5 text-sm font-medium
 *                   text-[#0F172A] dark:text-white bg-[#FFF5F5] dark:bg-[#1E293B]
 *                   px-4 py-2 rounded-full border border-[#FFE4E4]">
 *
 * RIGHT COLUMN (hidden on mobile, show on md+):
 *   - Decorative: 2-3 overlapping job card mockups
 *   - Each mockup: white card, company logo, job title, salary, location badge
 *   - Behind cards: soft red gradient blob (CSS radial-gradient)
 *   - Framer Motion: cards float up/down gently (y: [0, -10, 0], duration: 3s)
 *
 * GSAP ANIMATION on mount:
 *   gsap.fromTo('.hero-content', { opacity: 0, y: 60 }, { opacity: 1, y: 0, duration: 0.8, stagger: 0.15 })
 */
```

### Section 3: TrustedBy (`TrustedBySection.tsx`)

```tsx
/**
 * bg-[#FFF5F5] dark:bg-[#111827]
 * py-8
 * Center text: "TRUSTED BY TOP COMPANIES" — text-xs tracking-widest text-[#94A3B8] mb-6
 * Logo row: Pathao, bKash, Daraz, Grameenphone, BRAC, Shohoz, Chaldal, ShajGoj
 * Each logo: grayscale opacity-50 hover:opacity-100 hover:grayscale-0 transition
 * Mobile: horizontal scroll with overflow-x-auto
 * NO external image dependencies — use text-based company names if no logos
 */
```

### Section 4: FeaturedJobs (`FeaturedJobs.tsx`)

```tsx
/**
 * bg-white dark:bg-[#0B1120]
 * py-20
 *
 * HEADER:
 *   - Small pill: "Latest Opportunities" — bg-[#FFF5F5] text-[#EB4C4C] border border-[#FFA6A6]
 *   - H2: "Featured Jobs" — text-3xl md:text-4xl font-bold
 *   - Subtitle: muted text
 *   - Right: "View All →" text-[#EB4C4C] hover:underline
 *
 * GRID: grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6
 *
 * JobCard component (see below)
 * Show 8 cards
 * While loading: show 8 JobCardSkeleton components
 * Data: fetch from GET /api/v1/jobs?isFeatured=true&limit=8
 */
```

### `JobCard.tsx` — EXACT IMPLEMENTATION

```tsx
/**
 * Props: job: Job
 *
 * CARD:
 * className="bg-white dark:bg-[#1E293B] rounded-2xl overflow-hidden
 *            border border-[#FFE4E4] dark:border-[#1E293B]
 *            shadow-sm hover:shadow-lg hover:-translate-y-1
 *            transition-all duration-300 flex flex-col min-h-[300px]"
 *
 * TOP SECTION (p-5):
 *   Row 1:
 *     - Company logo: <img> or Avatar fallback (initials), size 48x48, rounded-xl
 *     - Right: {job.isFeatured && <Badge className="bg-[#EB4C4C] text-white text-xs">Featured</Badge>}
 *              {job.type badge} — e.g. "Full Time" → bg-[#FFF5F5] text-[#EB4C4C] border border-[#FFA6A6]
 *
 *   Job Title:
 *     <h3 className="font-bold text-base text-[#0F172A] dark:text-white mt-3 mb-1 line-clamp-2">
 *
 *   Company + Location:
 *     <p className="text-sm text-[#475569] dark:text-[#94A3B8] flex items-center gap-1">
 *       <Building2 size={13}/> {job.companyName}
 *     </p>
 *     <p className="text-sm text-[#475569] flex items-center gap-1 mt-0.5">
 *       <MapPin size={13}/> {job.district}
 *     </p>
 *
 *   Salary:
 *     <p className="text-sm font-semibold text-[#EB4C4C] mt-2 flex items-center gap-1">
 *       <Banknote size={13}/> {job.salary}
 *     </p>
 *
 *   Skills row:
 *     {job.skills.slice(0,3).map(skill => (
 *       <span className="text-xs bg-[#FFF5F5] dark:bg-[#0B1120] text-[#475569]
 *                        border border-[#FFE4E4] px-2 py-0.5 rounded-full">
 *         {skill}
 *       </span>
 *     ))}
 *
 * BOTTOM (mt-auto, border-t border-[#FFE4E4] p-4):
 *   Row: "2 days ago" text-xs text-[#94A3B8] | "Apply Now →" Button
 *   Button: size="sm" className="bg-[#EB4C4C] hover:bg-[#D63E3E] text-white rounded-lg ml-auto"
 *
 * HEART ICON (absolute top-3 right-3):
 *   - onClick: toggle useSavedJobsStore
 *   - Filled red if saved, outline if not
 */
```

### `JobCardSkeleton.tsx`

```tsx
/**
 * Same dimensions as JobCard (min-h-[300px])
 * Use shadcn Skeleton component
 * Pulse animation
 * Match: logo skeleton (48x48 rounded-xl) + 2 line skeletons + 3 tag skeletons + button skeleton
 */
```

### Section 5: CategoriesSection (`CategoriesSection.tsx`)

```tsx
/**
 * bg-[#FFF5F5] dark:bg-[#111827]
 * py-20
 *
 * 6 category cards in grid (3 cols desktop, 2 tablet, 1 mobile):
 * Categories: Technology, Finance, Healthcare, Marketing, Education, Engineering
 *
 * Each category card:
 * className="bg-white dark:bg-[#1E293B] rounded-2xl p-6 text-center
 *            border border-[#FFE4E4] dark:border-[#1E293B]
 *            hover:border-[#EB4C4C] hover:shadow-md cursor-pointer
 *            transition-all duration-300 group"
 *
 * - Icon: lucide-react icon in red circle: bg-[#FFF5F5] group-hover:bg-[#EB4C4C]
 *         icon color: text-[#EB4C4C] group-hover:text-white transition
 * - Category name: font-semibold text-base mt-3
 * - Job count: text-sm text-[#94A3B8] — fetch from API
 * - "Browse All →": text-xs text-[#EB4C4C] mt-2
 *
 * Data: GET /api/v1/stats/overview → category counts
 */
```

### Section 6: HowItWorks (`HowItWorks.tsx`)

```tsx
/**
 * bg-white dark:bg-[#0B1120]
 * py-20
 *
 * 3 steps with connecting line on desktop:
 *
 * Step 1: Create Your Profile
 *   - Icon: UserPlus in red circle
 *   - Number "01" in large gray text behind
 *   - Title + description
 *
 * Step 2: AI Matches You  
 *   - Icon: Brain/Sparkles in red circle
 *   - Number "02"
 *
 * Step 3: Get Hired
 *   - Icon: CheckCircle in red circle
 *   - Number "03"
 *
 * Connecting arrows between steps on desktop
 * Framer Motion: stagger fade-up on scroll (useInView hook)
 * Each step delay: 0.1s, 0.2s, 0.3s
 */
```

### Section 7: StatsSection (`StatsSection.tsx`)

```tsx
/**
 * ⚠️ THIS SECTION WAS BROKEN IN SCREENSHOT — MUST BE PERFECT
 *
 * bg-[#EB4C4C]  ← SOLID RED BACKGROUND
 * py-16
 * text-white
 *
 * Layout: 4 stats in a row (2x2 on mobile)
 * Container: max-w-7xl mx-auto px-8
 *
 * Each stat:
 * <div className="text-center">
 *   <div className="text-4xl md:text-5xl font-extrabold text-white mb-2">
 *     {animatedCount}+   ← useCountUp hook with IntersectionObserver
 *   </div>
 *   <div className="text-sm md:text-base text-white/80 font-medium uppercase tracking-wider">
 *     {label}
 *   </div>
 * </div>
 *
 * Stats data (fetch from /api/v1/stats/overview):
 *   - "5,000+" Jobs Listed
 *   - "1,200+" Companies
 *   - "800+" Successfully Hired
 *   - "8" Districts Covered
 *
 * Dividers between stats: border-r border-white/20 (hidden on mobile)
 *
 * useCountUp hook implementation:
 * - Uses IntersectionObserver to trigger when section is visible
 * - Animates from 0 to target over 2 seconds
 * - Easing: easeOutQuart
 * - Only animates ONCE (not on every scroll)
 */
```

### Section 8: AIFeaturesSection (`AIFeaturesSection.tsx`)

```tsx
/**
 * ⚠️ THIS SECTION WAS MISSING/INCOMPLETE IN SCREENSHOT — MUST BE COMPLETE
 *
 * bg-white dark:bg-[#0B1120]
 * py-20
 *
 * HEADER:
 *   - Pill: "✨ Powered by Google Gemini" — gradient border
 *   - H2: "Your Personal AI Career Assistant"
 *   - Subtitle: "Three powerful AI tools designed to accelerate your career"
 *
 * 3 CARDS (horizontal, full width each, stacked vertically OR side by side):
 *
 * Card 1 — CV Analyzer:
 *   className="bg-gradient-to-br from-[#FFF5F5] to-white dark:from-[#1E293B] dark:to-[#111827]
 *              rounded-2xl p-8 border border-[#FFE4E4] dark:border-[#1E293B]
 *              hover:border-[#EB4C4C] transition-all duration-300"
 *
 *   Left: Icon (FileText) in large red circle (64px)
 *         "Most Popular" badge in red
 *         H3: "AI CV Analyzer"
 *         Description text
 *         3 feature items with CheckCircle icons in red
 *         "Try Free →" Button (red)
 *         Social proof: "Used by 12K+ jobseekers"
 *
 *   Right: Mockup preview of CV analyzer results UI
 *          (Progress bars, score circles, badge pills)
 *
 * Card 2 — Job Matcher (same structure)
 * Card 3 — Interview Coach (same structure)
 *
 * Framer Motion: each card slides in from bottom with stagger
 */
```

### Section 9: TestimonialsSection (`TestimonialsSection.tsx`)

```tsx
/**
 * ⚠️ THIS SECTION WAS BROKEN IN SCREENSHOT — ONLY 1 PARTIAL QUOTE SHOWED
 *
 * bg-[#FFF5F5] dark:bg-[#111827]
 * py-20
 *
 * MUST show at least 3 testimonials using Framer Motion carousel
 *
 * Data: fetch from GET /api/v1/reviews (use first 6)
 * Fallback: if API returns empty, use hardcoded Bangladesh names
 *
 * CAROUSEL IMPLEMENTATION:
 * - Use Framer Motion AnimatePresence
 * - Auto-advance every 4 seconds
 * - Manual dot navigation at bottom
 * - Show 1 testimonial at a time (mobile) or 3 (desktop grid)
 *
 * FOR DESKTOP: 3-column grid showing 3 testimonials at once
 * FOR MOBILE: Single card with prev/next buttons
 *
 * Each card:
 * <div className="bg-white dark:bg-[#1E293B] rounded-2xl p-8 shadow-sm border border-[#FFE4E4]">
 *   - Quote icon: large " in red
 *   - Quote text: italic, text-base, text-[#0F172A]
 *   - Bottom: Avatar + Name + "★★★★★" + Role
 * </div>
 *
 * Hardcoded fallback testimonials (Bangladesh names):
 * 1. "HireIQ found me a job at Pathao in 2 weeks!" — Rahul Ahmed, Software Engineer
 * 2. "The AI CV analyzer improved my interview rate by 3x" — Fatima Khatun, Marketing Manager
 * 3. "Interview prep feature is incredible. Got hired at bKash!" — Karim Hassan, Data Analyst
 */
```

### Section 10: BlogPreview (`BlogPreview.tsx`)

```tsx
/**
 * ⚠️ THIS SECTION WAS INCOMPLETE IN SCREENSHOT
 *
 * bg-white dark:bg-[#0B1120]
 * py-20
 *
 * HEADER: "Latest From Our Blog" + "View All →" right aligned
 *
 * GRID: 3 cards (1 col mobile, 3 col desktop)
 * Data: GET /api/v1/blogs?isPublished=true&limit=3
 *
 * Each blog card:
 * - Cover image (next/image, aspect-video, rounded-t-2xl)
 * - Category badge: bg-[#FFF5F5] text-[#EB4C4C] border border-[#FFA6A6]
 * - Title: font-bold text-base line-clamp-2
 * - Excerpt: line-clamp-3 text-sm text-[#475569]
 * - Bottom: Author avatar + name + date
 * - "Read More →" text link in red
 *
 * SKELETON: 3 blog card skeletons while loading (cover image skeleton + text lines)
 *
 * If API returns no blogs → show 3 hardcoded blog previews about BD job market
 */
```

### Section 11: FAQSection (`FAQSection.tsx`)

```tsx
/**
 * bg-[#FFF5F5] dark:bg-[#111827]
 * py-20
 *
 * Use shadcn Accordion component
 * 6 questions minimum:
 *
 * 1. "How does the AI job matching work?"
 * 2. "Is my CV data safe and private?"
 * 3. "Can employers see my profile without applying?"
 * 4. "How accurate is the AI CV analyzer?"
 * 5. "What districts in Bangladesh are covered?"
 * 6. "Is HireIQ BD free to use?"
 *
 * Accordion styling:
 * - Trigger: font-semibold text-base text-[#0F172A] dark:text-white
 * - Active trigger: text-[#EB4C4C]
 * - Content: text-[#475569] leading-relaxed
 * - Border: border-[#FFE4E4] dark:border-[#1E293B]
 * - Open indicator: Plus/Minus icon in red (not the default chevron)
 */
```

### Section 12: CTASection + NewsletterSection

```tsx
/**
 * CTASection:
 * bg-[#EB4C4C] py-20 text-white text-center
 * H2: "Ready to Land Your Dream Job?" — text-4xl font-extrabold text-white
 * Subtitle: white/80
 * Buttons: "Browse Jobs" white bg red text | "Post a Job" white/20 border white text
 *
 * NewsletterSection:
 * bg-[#FFEDC7] dark:bg-[#111827] py-16
 * H2: "Stay Updated" — text-3xl font-bold text-[#0F172A] dark:text-white
 * Subtitle: text-[#475569]
 * Form: Input (email) + Button (red "Subscribe")
 *   - On submit: show toast "Thanks for subscribing!" (Sonner)
 *   - No backend call needed (or POST to /api/v1/contact)
 *   - Form uses RHF + Zod (email validation)
 */
```

---

## 🔐 AUTH PAGES

### Login Page (`/login/page.tsx`)

```tsx
/**
 * LAYOUT: 2-column split screen (50/50)
 *
 * LEFT PANEL (bg-[#EB4C4C] text-white):
 *   - HireIQ BD logo in white, large
 *   - Tagline: "Your AI Career Partner"
 *   - 3 feature bullets with icons (white)
 *   - Floating mockup graphic (optional)
 *   - Bottom quote: italic testimonial
 *   - Hidden on mobile
 *
 * RIGHT PANEL (bg-white dark:bg-[#0B1120]):
 *   - Top right: "Don't have an account? Sign up →"
 *   - H2: "Welcome back 👋"
 *   - Subtitle: muted text
 *
 *   DEMO BUTTONS ROW (3 pills):
 *     <div className="flex gap-2 mb-6">
 *       <Button variant="outline" size="sm" onClick={() => form.setValue('email', 'user@hireiq.com') + form.setValue('password', 'User@123')}>
 *         👤 Jobseeker
 *       </Button>
 *       <Button variant="outline" size="sm" onClick={...}>🏢 Employer</Button>
 *       <Button variant="outline" size="sm" onClick={...}>👑 Admin</Button>
 *     </div>
 *
 *   Divider: "— or continue with email —"
 *
 *   shadcn Form + RHF + Zod:
 *     - Email field (FormField + FormItem + FormLabel + FormControl + FormMessage)
 *     - Password field with show/hide eye toggle
 *     - "Remember me" checkbox + "Forgot password?" right aligned
 *     - Submit button: full width, red, "Login" or "Logging in..." with spinner
 *
 *   Google button (white, border, Google SVG logo)
 *
 *   Error: Sonner toast.error() on API failure
 *   Success: redirect to role-based dashboard
 *
 * MOBILE: Full white screen, no left panel, compact layout
 */
```

---

## 📊 DASHBOARD PAGES

### Dashboard Layout (`dashboard/layout.tsx`)

```tsx
/**
 * SIDEBAR (240px, fixed):
 *   - bg-[#0F0808] dark:bg-[#0B1120] text-white
 *   - Top: HireIQ BD logo in white
 *   - User info: Avatar (shadcn Avatar) + name + role badge
 *   - Nav items: each with lucide icon
 *     Active item: bg-[#EB4C4C] text-white rounded-xl
 *     Inactive: text-white/60 hover:text-white hover:bg-white/10 rounded-xl
 *   - Bottom: Logout button (red text, hover bg-red-500/10)
 *   - MOBILE: hidden, opened via Sheet
 *   - CRITICAL: add data-lenis-prevent to sidebar scroll area
 *
 * MAIN CONTENT:
 *   - bg-[#F8FAFC] dark:bg-[#0B1120]
 *   - ml-[240px] on desktop, ml-0 on mobile
 *   - Top header: breadcrumb + user avatar dropdown + notification bell
 *   - Content area: p-6 md:p-8
 *   - CRITICAL: add data-lenis-prevent to main scroll area
 *
 * MOBILE DASHBOARD:
 *   - Hamburger → shadcn Sheet (sidebar slides in)
 *   - Bottom nav bar alternative (optional)
 */
```

### Admin Overview (`dashboard/admin/page.tsx`)

```tsx
/**
 * METRIC CARDS (4 in row):
 *   Data: GET /api/v1/stats/overview
 *   Cards: Total Jobs | Total Users | Applications | Hired
 *   Each card:
 *     <Card className="bg-white dark:bg-[#1E293B] rounded-2xl p-6 border border-[#FFE4E4]">
 *       <div className="flex justify-between items-start">
 *         <div>
 *           <p className="text-sm text-[#94A3B8]">{label}</p>
 *           <p className="text-3xl font-bold text-[#0F172A] dark:text-white mt-1">{value}</p>
 *           <p className="text-xs text-green-500 mt-1">+{change}% this month</p>
 *         </div>
 *         <div className="bg-[#FFF5F5] p-3 rounded-xl">
 *           <Icon className="text-[#EB4C4C]" size={20} />
 *         </div>
 *       </div>
 *     </Card>
 *
 * CHARTS (2 in row):
 *   Left (65%): Line chart — Monthly Job Postings
 *     - shadcn ChartContainer + LineChart from recharts
 *     - chartConfig: { jobs: { label: 'Jobs Posted', color: '#EB4C4C' } }
 *     - Data from /api/v1/stats/overview → monthlyData
 *
 *   Right (35%): Donut chart — Application Status
 *     - shadcn ChartContainer + PieChart
 *     - Colors: Pending=#FFA6A6, Shortlisted=#EB4C4C, Hired=#22C55E, Rejected=#94A3B8
 *
 * RECENT TABLE:
 *   shadcn Table showing last 5 applications
 *   Columns: Applicant | Job | Company | Status badge | Date | Action
 */
```

### Charts Implementation (CORRECT WAY)

```tsx
// RevenueChart.tsx — COPY THIS EXACTLY
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';

const chartConfig: ChartConfig = {
  jobs: {
    label: 'Jobs Posted',
    color: '#EB4C4C',
  },
  applications: {
    label: 'Applications',
    color: '#FFA6A6',
  },
} satisfies ChartConfig;

export function MonthlyChart({ data }: { data: Array<{ month: string; jobs: number; applications: number }> }) {
  return (
    <div className="bg-white dark:bg-[#1E293B] rounded-2xl p-6 border border-[#FFE4E4] dark:border-[#1E293B]">
      <h3 className="font-semibold text-base mb-4">Monthly Activity</h3>
      <ChartContainer config={chartConfig} className="h-[280px] w-full">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#FFE4E4" />
          <XAxis dataKey="month" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Line type="monotone" dataKey="jobs" stroke="var(--color-jobs)" strokeWidth={2.5} dot={{ fill: '#EB4C4C', r: 4 }} />
          <Line type="monotone" dataKey="applications" stroke="var(--color-applications)" strokeWidth={2.5} dot={{ fill: '#FFA6A6', r: 4 }} />
        </LineChart>
      </ChartContainer>
    </div>
  );
}
```

---

## 🤖 AI TOOLS PAGE (`/ai-tools/page.tsx`)

```tsx
/**
 * This is a PUBLIC showcase page — no auth required
 * 3 interactive demo sections:
 *
 * === CV ANALYZER ===
 * Left: Form
 *   - Textarea (shadcn): "Paste your CV text here..." rows={10}
 *   - Input: "Target Job Title (optional)"
 *   - Button: full width red "🤖 Analyze My CV" — shows spinner when loading
 *
 * Right: Results panel (show skeleton while loading, then animate in)
 *   - 2 circular score indicators (CSS custom, or use shadcn Progress in circle variant)
 *     Overall Score: {score}/100 — red ring
 *     ATS Score: {atsScore}/100 — coral ring
 *   - Strengths: green Badge pills (variant="secondary" with green styling)
 *   - Weaknesses: amber Badge pills
 *   - Missing Skills: red Badge pills
 *   - Improvement list: numbered, each item as a Card
 *   - Summary: italic paragraph
 *   Framer Motion: stagger animate each section (0.1s delay each)
 *
 * === JOB MATCHER ===
 * Form: skills tag input + experience select + location select
 * Results: 5 job cards with match % badge (red, large)
 *
 * === INTERVIEW COACH ===
 * Form: job title input + experience level select
 * Results: shadcn Accordion with questions + model answers
 *   - Tab sections: Technical | Behavioral | Salary Tips
 */
```

---

## 🌊 LENIS SMOOTH SCROLL (`LenisProvider.tsx`)

```tsx
'use client';
import Lenis from 'lenis';
import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

export default function LenisProvider({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
    });

    lenisRef.current = lenis;

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  const pathname = usePathname();
  useEffect(() => {
    lenisRef.current?.scrollTo(0, { immediate: true });
  }, [pathname]);

  return <>{children}</>;
}
// ⚠️ Add data-lenis-prevent to ALL dashboard overflow containers
```

---

## 🔌 Axios Instance (`lib/axiosInstance.ts`)

```ts
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1',
  withCredentials: true,
  timeout: 15000,
});

// Request interceptor — attach JWT
axiosInstance.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('accessToken');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor — handle 401 refresh
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const { data } = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh-token`,
          { refreshToken }
        );
        localStorage.setItem('accessToken', data.data.accessToken);
        original.headers.Authorization = `Bearer ${data.data.accessToken}`;
        return axiosInstance(original);
      } catch {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
```

---

## 📝 TypeScript Types (`types/index.ts`)

```ts
export type Role = 'ADMIN' | 'EMPLOYER' | 'JOBSEEKER';
export type JobType = 'FULL_TIME' | 'PART_TIME' | 'REMOTE' | 'CONTRACT' | 'INTERNSHIP';
export type JobStatus = 'OPEN' | 'CLOSED' | 'DRAFT';
export type ApplicationStatus = 'PENDING' | 'SHORTLISTED' | 'REJECTED' | 'HIRED';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
  phone?: string;
  location?: string;
  bio?: string;
  skills: string[];
  resumeUrl?: string;
  isActive: boolean;
  createdAt: string;
}

export interface Job {
  id: string;
  title: string;
  description: string;
  requirements: string[];
  responsibilities: string[];
  skills: string[];
  type: JobType;
  category: string;
  location: string;
  district: string;
  salary: string;
  salaryMin?: number;
  salaryMax?: number;
  deadline: string;
  status: JobStatus;
  isFeatured: boolean;
  views: number;
  companyName: string;
  companyLogo?: string;
  companyWebsite?: string;
  employerId: string;
  employer?: User;
  createdAt: string;
}

export interface Application {
  id: string;
  jobId: string;
  job?: Job;
  userId: string;
  user?: User;
  coverLetter: string;
  resumeUrl: string;
  status: ApplicationStatus;
  aiScore?: number;
  aiFeedback?: string;
  createdAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  meta?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface StatsOverview {
  totalJobs: number;
  totalUsers: number;
  totalApplications: number;
  totalHired: number;
  jobsByCategory: Array<{ category: string; count: number }>;
  applicationsByStatus: Array<{ status: string; count: number }>;
  monthlyData: Array<{ month: string; jobs: number; applications: number }>;
}
```

---

## 🚀 EXECUTION PHASES

### Phase 1 — Foundation (Do this FIRST)
```
1. Run all setup commands above
2. Replace globals.css completely with CSS from Design System
3. Create layout.tsx with ThemeProvider + LenisProvider + QueryProvider + Toaster
4. Create LenisProvider.tsx (exact code above)
5. Create lib/utils.ts (cn helper)
6. Create lib/axiosInstance.ts (exact code above)
7. Create types/index.ts (exact types above)
8. Create lib/auth.config.ts
VERIFY: npm run dev should start without errors on localhost:3000
```

### Phase 2 — Shared Components
```
1. Navbar.tsx (sticky, blur, responsive, dropdown, dark toggle)
2. Footer.tsx (4-column, all links functional)
3. ThemeToggle.tsx
VERIFY: Navbar renders on all breakpoints without overflow
```

### Phase 3 — Home Page (ALL 12 sections)
```
Build in this exact order:
1. HeroSection.tsx (GSAP animation, search bar, stat chips)
2. TrustedBySection.tsx
3. FeaturedJobs.tsx + JobCard.tsx + JobCardSkeleton.tsx
4. CategoriesSection.tsx
5. HowItWorks.tsx (Framer Motion stagger)
6. StatsSection.tsx (useCountUp + red bg)  ← WAS BROKEN, fix now
7. AIFeaturesSection.tsx ← WAS MISSING, build fully
8. TestimonialsSection.tsx ← WAS BROKEN, use 3-column grid
9. BlogPreview.tsx ← WAS INCOMPLETE, add fallback data
10. FAQSection.tsx (shadcn Accordion)
11. CTASection.tsx (red bg)
12. NewsletterSection.tsx (cream bg)
13. Assemble in (public)/page.tsx
VERIFY: All 12 sections visible, data loads from API, skeletons show on load
```

### Phase 4 — Jobs Explore + Detail
```
1. JobFilter.tsx (URL-synced with useSearchParams)
2. useDebounce.ts + useFilterURL.ts
3. Pagination.tsx
4. /jobs/page.tsx (4 cards/row, filter sidebar, pagination)
5. ApplyModal.tsx (shadcn Dialog, RHF + Zod)
6. /jobs/[id]/page.tsx (tabs, sidebar, reviews)
VERIFY: Filters update URL, search debounces 300ms
```

### Phase 5 — Auth Pages
```
1. /login/page.tsx (split screen, 3 demo buttons, Google)
2. /register/page.tsx
VERIFY: Demo buttons auto-fill, redirect to correct dashboard after login
```

### Phase 6 — AI Tools Page
```
1. CVAnalyzer.tsx
2. JobMatcher.tsx
3. InterviewCoach.tsx
4. /ai-tools/page.tsx
5. AIChatSidebar.tsx (fixed bottom-right)
6. useAIChat.ts
VERIFY: All 3 AI features call correct API endpoints, results animate in
```

### Phase 7 — Dashboards
```
1. dashboard/layout.tsx (sidebar + header)
2. DashboardSidebar.tsx (role-based menu)
3. Admin: overview + charts + 5 data tables
4. Employer: post-job form + applicants view
5. Jobseeker: applications + AI tools + profile
6. useSavedJobsStore.ts
VERIFY: Charts render with real data, tables paginate, role-based menus show correctly
```

### Phase 8 — Additional Pages
```
1. /blog/page.tsx + /blog/[slug]/page.tsx
2. /contact/page.tsx (form + validation)
3. /about/page.tsx
VERIFY: Contact form submits to backend
```

### Phase 9 — Polish
```
1. All loading.tsx files (skeleton matching page layout)
2. not-found.tsx (custom 404 with red branding)
3. error.tsx (retry button)
4. Remove ALL console.logs
5. Verify dark mode on every page
6. Test mobile at 375px — no overflow
7. Test all forms validate correctly
```

---

## 🚫 ABSOLUTE RULES

| ❌ NEVER | ✅ ALWAYS |
|----------|----------|
| Use `any` TypeScript type | Strict interfaces for everything |
| Leave `console.log` in code | Remove all debug logs |
| Hardcode API URLs | Use `process.env.NEXT_PUBLIC_API_URL` |
| Use raw Recharts without ChartContainer | Wrap ALL charts in shadcn ChartContainer |
| Use black (#000 or #0B0F19) as bg | Use white or navy from palette |
| Skip skeleton loaders | Every async section has skeleton |
| Direct axios calls in components | Use TanStack Query for all API calls |
| Use Lenis in dashboard panels | Add `data-lenis-prevent` attribute |
| Custom modal HTML | Use shadcn Dialog |
| Custom dropdown HTML | Use shadcn DropdownMenu |
| Inconsistent card sizes | All JobCards min-h-[300px] |
