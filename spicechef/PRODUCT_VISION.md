# SpiceChef — Product Vision v1.0

**Upload any cookbook. Cook anything. Your content. Your kitchen.**

Venky Kandula · March 2026 · Founder, SpiceStrong & SpiceChef

---

## 1. The Core Idea

SpiceChef is not a recipe app. It is an empty notebook.

Most people own cookbooks — physical or digital — but never cook from them because the format is friction-heavy. SpiceChef takes any cookbook PDF the user already owns and transforms it into a fully guided, interactive cooking experience: ingredient checklists, step-by-step cook mode, built-in timers, and auto-scaled serving quantities.

> **The Empty Notebook Philosophy**
> SpiceChef does not own or provide any recipe content. We give users a beautiful, guided vessel — they bring their own cookbooks, family recipes, URLs, or handwritten recipes. We are a tool, not a content platform. This is our legal foundation, our marketing story, and our product identity in one sentence.

Think of it like GoodNotes for cooking. GoodNotes does not write your notes — it gives you the most beautiful canvas to write them. SpiceChef does not write your recipes — it gives you the most guided way to cook them.

---

## 2. The Problem Being Solved

- **Unused cookbooks** — People buy cookbooks, download PDFs, and never cook from them because flipping between pages, scaling quantities mentally, and managing timers all at once is genuinely hard.
- **Lost recipe inspiration** — Family recipes, blog posts, and handwritten notes get scattered across notes apps, screenshots, and browser bookmarks with no structured way to actually cook from them.
- **No guided cook mode** — Every other recipe app shows you the recipe but leaves you to manage the actual cooking process yourself. No one guides you step by step with the ingredients you need right now.

SpiceChef solves all three with one simple loop: **Upload → Browse → Check ingredients → Cook guided.**

---

## 3. Target Audience

| Segment | Description |
| --- | --- |
| **Primary user** | Home cooks who own cookbooks (physical or PDF) but find them too cumbersome to actually cook from regularly |
| **Secondary user** | People who collect recipe inspiration from the internet and want a structured way to cook from their saved content |
| **Occasion user** | Anyone cooking for a special occasion who wants guidance through an unfamiliar or complex recipe |
| **Cocktail makers** | Bartenders and home entertainers who own cocktail books and want guided drink-making with ingredient checklists |
| **Family recipe keepers** | People who want to digitize and cook from handwritten or passed-down family recipes with guided assistance |

---

## 4. What Users Can Bring (Content Sources)

- PDF cookbooks they own (the primary use case)
- Photos of recipe pages (AI extracts text)
- Typed or pasted recipes from memory or websites
- Public domain cookbooks from Project Gutenberg (starter library)
- Phase 3: Social media video links (TikTok, Instagram, YouTube)
- Phase 3: Any cooking website URL

> **Legal Position**
> SpiceChef is a tool, not a content distributor. Users upload their own content for their own personal use. This is equivalent to using a PDF reader or a note-taking app. Our Terms of Service make clear that content uploaded belongs to the user, is stored only to power their personal experience, and is never shared without explicit user action.

---

## 5. Core Product Flow (Phase 1)

| Step | Description |
| --- | --- |
| **Step 1** | Splash screen — single Get Started CTA, no sign-in required in Phase 1 |
| **Step 2** | Onboarding Screen 1 — Dietary restrictions (multi-select chips, skippable) |
| **Step 3** | Onboarding Screen 2 — Skill level (Just Starting / Home Cook / Experienced, skippable) |
| **Step 4** | Onboarding Screen 3 — Household size for auto-scaling quantities (1 / 2 / 3-4 / 5+, skippable) |
| **Step 5** | Home Library — Upload a cookbook PDF or browse starter public domain books |
| **Step 6** | Recipe Browser — AI-extracted recipe list with filters (dietary, time, veg/non-veg dot indicator) |
| **Step 7** | Ingredient Checklist — Full ingredient list grouped by category, checkboxes, Shopping List tab |
| **Step 8** | Cook Mode — One step at a time, gold-highlighted quantities, inline timer, per-step ingredient pills |
| **Step 9** | Completion — Stats (steps / minutes / ingredients), star rating, Back to Library |

---

## 6. Onboarding Design Decisions

Onboarding is 3 screens maximum, each with a Skip and Next option. The philosophy is progressive profiling — learn preferences as they cook, not before.

### Why 3 screens, not 10
Apps like MyFitnessPal and Paprika ask too many questions upfront, leading to drop-off. We ask only the 3 things that immediately improve the experience: dietary filters (affects recipe visibility), skill level (affects step detail), and serving size (affects all quantities).

### Skip + Next on every screen
Skip is always available and always visible but visually subordinate (muted underline link) vs Next (gold pill button). This removes pressure without removing guidance.

### Screen 3 shows a preference summary
The third onboarding screen shows a preview of choices made in screens 1 and 2 as gold tags. This creates a satisfying confirmation moment before finishing setup.

---

## 7. Key Features — Phase 1

### PDF Upload & AI Extraction
On upload, Claude API scans the PDF and extracts: recipe names, ingredient lists with quantities, cook times, dietary flags, and step-by-step instructions. Runs once on upload and is cached. Bad PDF layouts rejected gracefully with a clear message.

### Ingredient Checklist
Ingredients grouped by category (Produce, Dairy, Pantry, Spices, etc.) matching how a real kitchen is organized. Shopping List tab collects unchecked items, shareable via native iOS share sheet.

### Cook Mode
One step at a time. Quantities and times highlighted in gold. Inline timer auto-appears for time mentions. Per-step ingredients shown below the instruction card. Large thumb-friendly prev/next buttons.

### Serving Size Auto-Scaling
Default from onboarding, overridable per session on ingredient checklist screen. AI adjusts all quantities proportionally.

### Dietary Filtering
Filters from onboarding applied automatically. Additional per-session toggles in recipe browser. Veg/non-veg dot indicator (green/red).

### Recipe Card Sharing
Post-cook shareable card with recipe name, stats, star rating, and "Cooked with SpiceChef" watermark. Does NOT include full instructions (copyright safe). Shareable via WhatsApp, Instagram Stories, iMessage.

> **No AI Images in Phase 1**
> Removes DALL-E latency, reduces cost, avoids visual distraction during active cooking, and lets us ship faster.

---

## 8. Phased Roadmap

### Phase 1 — Launch
- PDF cookbook upload + AI recipe extraction
- 3-screen onboarding (dietary / skill / serving preferences)
- Recipe browser with dietary and time filters
- Ingredient checklist grouped by category
- Shopping list tab (unchecked items, shareable as text)
- Cook mode: step-by-step, inline timers, per-step ingredients
- Serving size auto-scaling
- Recipe completion screen with star rating
- Shareable recipe card
- Starter library: 2-3 free public domain cookbooks

### Phase 2 — Enhance
- Voice narration (ElevenLabs TTS)
- Screen-stay-on during cook mode
- AI image generation per recipe (DALL-E 3)
- Sign in with Apple and Google
- Photo of recipe page → AI text extraction
- Manual recipe entry
- Extract cover image from PDF
- Cooking history and favourites

### Phase 3 — Scale
- Social media video import (TikTok, Instagram, YouTube → recipe)
- Any website URL import
- Meal planning and calendar integration
- Pantry tracking
- Grocery delivery integration
- Multiple language support

---

## 9. Competitive Landscape

Primary competitor: **BeChef: Recipe Manager** by Habesha Labs (March 2025).

| Feature | BeChef | SpiceChef |
| --- | --- | --- |
| Core identity | Social media recipe collector | Personal cookbook library |
| PDF import | Recently added (Phase 2) | Core — entire product built around it |
| Cook mode + timers | Yes (recently added) | Yes (Phase 1) |
| Per-step ingredients | Yes | Yes |
| Shopping list | Yes | Yes |
| Preference onboarding | Not prominent | 3-screen dedicated flow |
| Dietary filtering | Basic | Built-in from onboarding |
| Serving size scaling | Yes | Yes |
| Social media import | Yes (core feature) | Phase 3 |
| Meal planning | Yes | Phase 3 |
| Collaborative sharing | Yes | Intentionally no (copyright safe) |
| Public domain starter library | No | Yes |
| Privacy-first philosophy | Social by design | Personal use, user-owned content |

> **Strategic Differentiation**
> BeChef is a content aggregator — their soul is "save inspiration from the internet." SpiceChef is a personal library — our soul is "bring the books you already own to life."

---

## 10. Relationship to SpiceStrong

| Product | Description |
| --- | --- |
| **SpiceStrong** | Curated high-protein fitness cooking. AI-generated recipes. Closed content system. |
| **SpiceChef** | Any recipe from any book. Open content system. Broader audience. |

Shared tech stack (React Native / Expo, Claude API, Supabase) — development velocity benefits from everything built for SpiceStrong.

---

## 11. Design Identity

| Element | Value |
| --- | --- |
| Visual theme | Dark forest green (#0B1610) + aged gold (#C8A44A) + cream text |
| Typography | Cormorant Garamond (headings) + Plus Jakarta Sans (body) |
| Energy | Calm, refined, culinary-magazine |
| Tone of voice | Knowledgeable culinary companion |
| vs SpiceStrong | SpiceStrong: warm orange/white, fitness-forward. SpiceChef: dark/gold, culinary-refined. Zero visual overlap. |

---

## 12. Open Questions & Decisions Pending

- App name final confirmation — check for BeChef similarity risk on App Store search
- Monetisation model — free with premium, one-time purchase, or subscription?
- PDF rejection UX — what happens when a PDF is too poor quality to parse?
- Public domain starter library curation — which specific Project Gutenberg books?
- Serving size override — mid-cook or only before starting?
- Rating data usage — how to surface "your highest-rated cooked recipes" in Phase 2?
- Recipe card copyright boundary — legal review of what the card can include

---

*SpiceChef Product Document · Venky Kandula · March 2026 · v1.0*

*Stack: React Native (Expo) · Claude API · Supabase · ElevenLabs (Phase 2) · DALL-E 3 (Phase 2)*
