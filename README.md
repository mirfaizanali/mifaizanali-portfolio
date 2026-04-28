# Mir Faizan Ali — Portfolio

A modern, responsive developer portfolio built with **Angular 20**, featuring dark theme, 3D effects, glassmorphism design, typing animations, and server-side rendering (SSR).

**Live:** [mirfaizanali.vercel.app](https://mirfaizanali.vercel.app) <!-- Update with your Vercel URL -->

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Angular 20 — Standalone Components, SSR |
| Language | TypeScript |
| Styling | SCSS with CSS custom properties |
| Animations | Angular Animations, CSS keyframes, Three.js |
| 3D Graphics | Three.js — particle system with custom shaders |
| Email | EmailJS |
| Icons | Devicon CDN, Font Awesome 6 |
| Deployment | Vercel |

## Features

- Dark theme with `#00bcd4` cyan accent, `#7c3aed` purple secondary, and glassmorphism cards
- Animated gradient text on hero name (cyan-to-purple shift)
- Cursor spotlight effect — radial glow follows mouse movement (desktop only)
- Sticky navbar with scroll-aware transparency and backdrop blur
- Hero section with Three.js particle background and typewriter animation
- Animated monogram cube avatar (MFA) with rotating conic-gradient glow ring
- "What I Do" services section — Backend, Frontend, Database Design cards
- About section with stat cards (Experience, Projects, Tech Skills)
- Skills grid with Devicon icons, stagger animation, and bounce on hover
- Project cards with tech tags, GitHub and Live links
- Education timeline with animated connecting line
- Contact form with Reactive Forms validation, quick-fill templates, and EmailJS delivery
- Footer with social links and back-to-top button
- Scroll progress bar and floating scroll-to-top button
- Sections lazy-loaded with Angular `@defer (on viewport)`
- Parallax and 3D tilt hover effects via custom directives
- SEO meta tags — Open Graph and Twitter Card
- Fully responsive — mobile, tablet, desktop

## Project Structure

```
my-portfolio/src/app/
├── core/
│   └── services/
│       ├── viewport.service.ts       # IntersectionObserver wrapper (observeOnce)
│       ├── portfolio-data.service.ts # All typed portfolio content (nav, skills, projects…)
│       └── email.service.ts          # EmailJS abstraction returning Observable
├── shared/
│   ├── directives/
│   │   ├── parallax.directive.ts     # Scroll-based parallax via rAF outside zone
│   │   └── tilt-3d.directive.ts      # Mouse-driven 3D tilt + glare overlay
│   └── models/
│       └── portfolio.models.ts       # All TypeScript interfaces
├── features/
│   ├── navbar/        # Sticky nav, SSR-safe scroll handler
│   ├── hero/          # Particle background + typewriter
│   ├── particle-bg/   # Three.js canvas component
│   ├── about/         # 3D cube avatar + stats
│   ├── skills/        # Category cards with Devicon icons
│   ├── projects/      # Project cards with links
│   ├── education/     # Vertical timeline
│   ├── what-i-do/     # Service cards
│   ├── contact/       # Reactive form + EmailJS
│   └── footer/        # Social links
├── app.ts             # Root component — scroll tracking, cursor spotlight
├── app.html           # Layout shell with @defer lazy loading
├── app.scss           # Progress bar, cursor spotlight, scroll-to-top
└── app.config.ts      # Providers: router, animations, SSR hydration
```

**`core/`** — singleton services injected app-wide (`providedIn: 'root'`).  
**`shared/`** — directives and interfaces with no app-specific logic.  
**`features/`** — one folder per page section, each self-contained.

## Getting Started

```bash
cd my-portfolio
npm install
ng serve
```

Open [http://localhost:4200](http://localhost:4200)

## Build

```bash
# Production build with SSR
ng build

# Output
dist/my-portfolio/browser/   ← static assets
dist/my-portfolio/server/    ← SSR server bundle
```

## Environment

EmailJS credentials live in `src/environments/environment.ts` — swap in your own service/template/public key before deploying:

```ts
export const environment = {
  emailjs: {
    serviceId: 'YOUR_SERVICE_ID',
    templateId: 'YOUR_TEMPLATE_ID',
    publicKey: 'YOUR_PUBLIC_KEY',
  },
};
```

## Connect

- **LinkedIn:** [Mir Faizan Ali](https://www.linkedin.com/in/mir-faizan-ali-62a18a282/)
- **GitHub:** [mirfaizanali](https://github.com/mirfaizanali)
- **Email:** mir_faizan_ali@hotmail.com
