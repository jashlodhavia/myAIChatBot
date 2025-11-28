# AirIndia Guide – Conversational Workspace

AirIndia Guide is a Next.js 14 application that powers a branded AI cockpit for Air India teams. It combines a responsive chat workspace, focused onboarding/login experience, and a detailed terms-of-use surface—all tuned for aviation, safety, and enterprise workflows.

This README summarizes how the project is organized, what features it ships with, and how to configure or extend it.

---

## Highlights

- **Tailored AI chat** with a gold-on-crimson Air India theme, responsive header layout, and golden “New” button.
- **Session persistence** via localStorage with automatic titles and conversation history browsing.
- **Safety workflows** that detect hazardous or operational keywords and fire email alerts to compliance teams.
- **Custom login journey** featuring a radial red/white gradient background, branded logos, and authentication gating.
- **Readable terms page** that mirrors the chat theme and stays legible on all screen sizes.
- **Smooth auto-scroll** behavior that keeps the active message in view, even across refreshes.

---

## Tech Stack

- **Framework**: Next.js App Router (React 18, TypeScript)
- **UI**: Tailwind CSS, Lucide icons, custom design tokens
- **AI Runtime**: `@ai-sdk/react` (`useChat` hook) + OpenAI-compatible providers
- **State & Forms**: React Hook Form + Zod validation
- **Styling Utilities**: shadcn/ui inputs, buttons, and layout primitives
- **Email delivery**: Native `fetch` against webhook/Resend/SendGrid endpoints (no extra deps)

---

## Application Walkthrough

### 1. Chat Page – `app/page.tsx`

- Renders the full conversational workspace with sidebar history, header, message wall, and composer.
- Stores up to 5 recent conversations in localStorage, autogenerating session titles based on intent.
- Implements smooth, continuous scrolling via `scrollContainerRef` so the latest response is always visible and the view jumps to the end after refresh.
- “New” button starts a clean session, while message durations track assistant thinking time.
- Chat input supports quick file-attachment placeholder, Enter-to-send, and stop-stream controls.

### 2. Login Page – `app/login/page.tsx`

- White outer canvas with a subtle red radial gradient, red card-style form, and enlarged Air India / Onboardly logos.
- Inputs use golden borders, descriptive placeholders, and validation via React Hook Form.
- Successful login writes `isAuthenticated=true` to `sessionStorage`, gating access to the chat route.

### 3. Terms Page – `app/terms/page.tsx`

- Shares the dark Air India palette while improving readability with translucent black panes, golden headings, and responsive typography.
- Presents sections such as acceptable use, privacy, and operational obligations.

### 4. Safety Alert Pipeline – `app/api/chat/route.ts` + `lib/email.ts`

- Every user prompt passes through `isSafetyRelated`, a bespoke keyword matcher seeded with operational, fueling, cargo, SMS, and emergency terminology.
- When a match occurs, `sendSafetyAlertEmail` fires an email to `jashlodhavia15@gmail.com` with subject “Safety Alert Triggered” and a hard-coded `username = employee`.
- Email delivery tries a webhook URL first, then Resend, then SendGrid, giving flexibility without extra dependencies.

### 5. Content Moderation & Tooling

- Messages are screened with the AI provider’s moderation APIs (see `lib/moderation.ts`).
- Optional tools include web search (Exa) and Pinecone vector lookup; tool-call UI is already wired in `components/messages`.

---

## Project Structure

```
AirIndiaGuide/
├── app/
│   ├── api/chat/route.ts        # Chat handler + safety email trigger
│   ├── api/chat/tools/          # Web search / vector search adapters
│   ├── login/page.tsx           # Radial login experience
│   ├── terms/page.tsx           # Styled terms of use
│   └── page.tsx                 # Main chat surface
├── components/
│   ├── messages/                # Message wall + assistant/user rendering
│   ├── ai-elements/             # Markdown + tool UI
│   └── ui/                      # Reusable inputs, buttons, fields
├── lib/
│   ├── email.ts                 # Safety keyword list + email dispatchers
│   ├── moderation.ts            # Content guardrails
│   ├── pinecone.ts              # Vector DB helper
│   └── sources.ts               # Result formatting + citations
├── config.ts                    # Branding, copy, and model config
├── prompts.ts                   # System/tone/tool instructions
├── env.template                 # Required secrets
└── README.md                    # (this file)
```

---

## Environment Variables

Copy `env.template` to `.env.local` (for local dev) or configure in Vercel:

| Variable | Required | Description |
|----------|----------|-------------|
| `OPENAI_API_KEY` | ✅ | Used by the chat model and moderation |
| `EXA_API_KEY` | ⛔ optional | Enables web search tool |
| `PINECONE_API_KEY` | ⛔ optional | Enables vector knowledge lookup |
| `EMAIL_WEBHOOK_URL` | ⛔ optional | Custom webhook target for safety emails |
| `RESEND_API_KEY` | ⛔ optional | Resend fallback |
| `SENDGRID_API_KEY` | ⛔ optional | SendGrid fallback |

The email helper automatically prefers webhook → Resend → SendGrid. Provide whichever credentials you have.

---

## Running Locally

```bash
pnpm install        # or npm/yarn
pnpm dev            # starts Next.js on http://localhost:3000
```

Login requires `sessionStorage.isAuthenticated = "true"`. Use the login page (`/login`) to set it, or mock it manually for quick testing.

---

## Customization Quick Start

1. **Branding & copy**: Update `config.ts` for `AI_NAME`, `OWNER_NAME`, `WELCOME_MESSAGE`, button text, and moderation refusal strings.
2. **Prompting**: Edit `prompts.ts` to change tone, allowed topics, or tool-usage strategy.
3. **Safety keywords**: Extend `safetyKeywords` inside `lib/email.ts` when new operational phrases should trigger alerts.
4. **Tool stack**: Add new functions under `app/api/chat/tools/`, register them inside `route.ts`, and surface their UI in `components/messages/tool-call.tsx`.
5. **Styling tweaks**: Stick to Tailwind classes inside the page components; each layout is already mobile-first and uses CSS variables from Tailwind config.

---

## Troubleshooting

- **Chat doesn’t load**: Confirm `isAuthenticated` flag is set (login) and `OPENAI_API_KEY` exists.
- **Safety emails not firing**: Check server logs for `sendSafetyAlertEmail` errors and ensure at least one email transport env variable is configured.
- **Web/Pinecone tools fail**: Missing optional keys will silently disable those tools; verify env vars if you expect them to run.
- **Auto-scroll issues**: `scrollContainerRef` drives the scrolling behavior; ensure CSS doesn’t remove `overflow-y-auto` from the main container.

---

## Contributing & Next Steps

- Expand the keyword list or routing logic (ex: Slack alerts instead of email).
- Wire real authentication/SSO in place of sessionStorage.
- Hook the “attach file” button to an upload + retrieval pipeline.
- Add analytics or audit logging for each chat session.

PRs are welcome. For deeper architectural details, see `AGENTS.md`.

---

Enjoy building with AirIndia Guide ✈️
