# SpiceChef

**Upload any cookbook. Cook anything. Your content. Your kitchen.**

## Product Identity

SpiceChef is an "empty notebook" for cooking. It does not own or provide recipe content — users bring their own cookbooks (PDF), family recipes, URLs, or handwritten recipes. SpiceChef transforms them into a fully guided, interactive cooking experience.

Think: GoodNotes for cooking.

## Tech Stack

- React Native (Expo)
- Claude API (recipe extraction from PDFs)
- Supabase (backend/auth)
- ElevenLabs TTS (Phase 2 — voice narration)
- DALL-E 3 (Phase 2 — recipe images)

## Design System

| Token          | Value                                          |
| -------------- | ---------------------------------------------- |
| Background     | Dark forest green `#0B1610`                    |
| Accent/Gold    | Aged gold `#C8A44A`                            |
| Text           | Cream                                          |
| Heading font   | Cormorant Garamond (editorial, cookbook feel)   |
| Body font      | Plus Jakarta Sans                              |
| Energy         | Calm, refined, culinary-magazine               |
| Tone of voice  | Knowledgeable culinary companion. "Enjoy your meal." not "Amazing job!" |

## Phase 1 Screens (9 total)

1. **Splash** — Single "Get Started" CTA, no sign-in required
2. **Onboarding 1** — Dietary restrictions (multi-select chips, skippable)
3. **Onboarding 2** — Skill level (Just Starting / Home Cook / Experienced, skippable)
4. **Onboarding 3** — Household size for auto-scaling (1 / 2 / 3-4 / 5+, skippable) + preference summary as gold tags
5. **Home Library** — Upload cookbook PDF or browse starter public domain books
6. **Recipe Browser** — AI-extracted recipe list with dietary/time filters, veg/non-veg dot indicator (green/red)
7. **Ingredient Checklist** — Grouped by category (Produce / Dairy / Pantry / Spices), checkboxes, Shopping List tab for unchecked items
8. **Cook Mode** — One step at a time, gold-highlighted quantities, inline timer, per-step ingredient pills, large thumb-friendly nav
9. **Completion** — Stats (steps / minutes / ingredients), star rating, shareable recipe card, Back to Library

## Phase 1 Core Features

- **PDF Upload & AI Extraction** — Claude API extracts recipe names, ingredients with quantities, cook times, dietary flags, step-by-step instructions. Runs once on upload, cached. Bad PDFs rejected gracefully.
- **Ingredient Checklist** — Grouped by kitchen category. Shopping List tab collects unchecked items, shareable via native iOS share sheet.
- **Cook Mode** — One step at a time. Quantities/times highlighted in gold. Inline timer auto-appears for time mentions. Per-step ingredients shown below instruction card. Large prev/next buttons.
- **Serving Size Auto-Scaling** — Default from onboarding, overridable per session on ingredient checklist screen.
- **Dietary Filtering** — From onboarding, toggleable per session in recipe browser.
- **Recipe Card Sharing** — Post-cook shareable card with name, stats, star rating, "Cooked with SpiceChef" watermark. No full instructions (copyright safe). Shareable via WhatsApp, Instagram Stories, iMessage.

## Phase 2 Features

- Voice narration (ElevenLabs TTS)
- Screen-stay-on during cook mode
- AI image generation per recipe (DALL-E 3)
- Sign in with Apple and Google
- Photo of recipe page → AI text extraction
- Manual recipe entry
- Extract cover image from PDF
- Cooking history and favourites

## Phase 3 Features

- Social media video import (TikTok, Instagram, YouTube → recipe)
- Website URL import
- Meal planning and calendar
- Pantry tracking
- Grocery delivery integration
- Multiple language support

## Relationship to SpiceStrong

- **SpiceStrong**: Curated high-protein fitness cooking. AI-generated recipes. Closed content system.
- **SpiceChef**: Any recipe from any book. Open content system. Broader audience.
- Shared tech stack — cook mode architecture, timer logic, recipe card components carry over.

## Competitive Positioning

Primary competitor: BeChef (social media recipe collector). SpiceChef differentiates as a personal cookbook library. BeChef's PDF import is bolted-on; ours is the entire product.

## Open Questions

- App name final confirmation (BeChef similarity risk)
- Monetisation model (freemium, one-time, subscription?)
- PDF rejection UX details
- Public domain starter library curation (Project Gutenberg)
- Serving size override mid-cook vs only before starting
- Rating data usage in Phase 2
- Recipe card copyright boundary (legal review)

## Conventions

- No AI-generated food images in Phase 1
- No emojis in UI tone — calm, refined
- Skip + Next on every onboarding screen (Skip = muted underline, Next = gold pill button)
- Veg/non-veg dot indicator follows Indian food convention (green/red)
- All user content stored locally, never shared without explicit action
