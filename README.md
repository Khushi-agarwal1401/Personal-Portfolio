# ui-portfolio

A personal portfolio website for **Khushi Munna Kumar Agarwal** — a Computer Science student at PW Institute of Innovation, aspiring innovator, and future tech entrepreneur with a vision to build India's own technology brand ("Indus").

The site showcases my skills, projects, education, and career vision in a clean, modern, fully responsive single-page design.

## ✨ Features

- **Home** — Hero section with profile photo, intro, and quick links to email, GitHub, and LinkedIn
- **About** — Personal background, skill summary, and the "Indus" vision story
- **Skills & Expertise** — Technical skills (HTML/CSS/JS, Python, MySQL) and soft skills displayed on animated cards
- **Projects & Practice Work** — Portfolio website, Python mini-projects, MySQL database practice, and HTML/CSS layout designs
- **Education** — Higher Secondary Education (11th & 12th) and current B.Tech in Computer Science
- **Career Vision & Goals** — The "Indus" vision, "Make in India" mission, and supporting goals
- **Get In Touch** — Contact details plus a working message form powered by [FormSubmit](https://formsubmit.co/)
- **Thank-you page** — Confirmation page after sending a message, styled to match the glassmorphism theme
- **Light/Dark theme toggle** — Switch between light and dark (charcoal-black) glassmorphism palettes; the choice persists in `localStorage`, defaults to the system preference, is applied before first paint, and cross-fades via the View Transitions API. Both the portfolio and thank-you pages respect it
- **Scroll animation pack** — Reading progress bar (native CSS scroll-driven animations with a JS fallback), scroll-linked parallax on the hero photo and background blobs, animated skill proficiency bars, plus the existing scroll-reveal/staggered entrances
- **Skills radar charts** — Two animated hexagon (radar) charts for technical and soft skills: the gradient fill grows from the center, the outline draws itself around the data polygon, and vertex dots pop in with a stagger as the section scrolls into view. Colors follow the active light/dark theme
- **Magnetic buttons** — Hero CTAs, submit button, footer icons, and the thank-you button gently pull toward the cursor (fine pointers only, respects reduced motion)
- **Hero typewriter** — A blinking-caret typing effect cycles through roles (Web Developer, Problem Solver, Tech Entrepreneur, Future Innovator); reduced-motion users get the first role shown statically
- **Tech-stack marquee** — A seamless, pure-CSS scrolling strip of technologies (HTML, CSS, JS, Python, MySQL, C++, Git, responsive design, OOP) with edge fading and pause-on-hover; reduced-motion users get a static scrollable strip
- **SEO & performance** — JSON-LD `Person` schema, Open Graph + Twitter cards, canonical URL, `robots.txt`, `sitemap.xml`, LCP `fetchpriority` hint on the hero image, `noindex` on the thank-you page, and an improved `<title>`/description
- **Polish** — Smooth scroll navigation, scroll-reveal animations, staggered card entrances, floating hero photo with an animated gradient ring, decorative background blobs, scrollspy (the nav link of the section in view is highlighted), a scroll-to-top button, a compact sticky navbar, custom scrollbar/selection styles, keyboard focus indicators, auto-updating footer year, and `prefers-reduced-motion` support
- **Responsive navigation** — Hamburger menu with animated icon on mobile/tablet; the dropdown closes on link click, outside click, or `Esc`

## 🛠️ Tech Stack

- **HTML5** — Semantic, accessible markup
- **CSS3** — Custom properties (design tokens), flexbox/grid layouts, keyframe animations, responsive breakpoints
- **JavaScript** — Vanilla JS for navigation, scroll effects, and UI interactions (no frameworks)
- **Bootstrap Icons** — Icon set loaded via CDN (no npm dependency required)
- **Google Fonts** — Inter + Poppins
- **FormSubmit** — Zero-backend contact form delivery

## 📁 Project Structure

```
.
├── index.html              # Main portfolio page
├── thank-you.html          # Post-form-submission confirmation page
├── sitemap.xml             # SEO sitemap
├── robots.txt              # Crawler rules
├── package.json            # Project metadata & scripts
├── README.md
├── .gitignore
├── public/
│   └── images/
│       └── Me.jpg          # Profile photo
├── src/
│   ├── styles/
│   │   └── style.css       # All styles & animations (incl. thank-you page)
│   └── scripts/
│       ├── theme-init.js   # Pre-paint theme bootstrap (both pages)
│       └── script.js       # Navigation, scroll & UI interactions
└── scripts/
    └── validate.mjs        # Zero-dependency HTML/link/asset validator (npm test)
```

## 🚀 Getting Started

This is a static site — no build step or install required.

### Option 1: Open directly

Simply open `index.html` in any modern browser.

### Option 2: Local server (recommended)

```bash
# From the project root
python3 -m http.server 8080
# Then visit http://localhost:8080
```

### Option 3: Validate the project (recommended before deploying)

```bash
npm test
```

> Zero-dependency checks: duplicate IDs, broken in-page anchors, missing local assets, duplicate `<title>` tags, `console.*` statements, and missing `rel="noopener"` on external links. There are no runtime dependencies — icons and fonts load from CDNs, so `npm install` is not required to run the site.

## 📬 Contact Form Setup

The contact form uses [FormSubmit](https://formsubmit.co/) and sends messages to `khushiagarwalg1@gmail.com`.

- The form action points to `https://formsubmit.co/khushiagarwalg1@gmail.com`
- On submit, users are redirected to `thank-you.html` (configured via the `_next` hidden field)
- To point the form at a different email, update the address in the form's `action` attribute in `index.html`

> **Note:** The first submission to a new email address triggers a one-time confirmation email from FormSubmit — click the confirmation link once to activate delivery.

## 🌐 Deployment

The site is designed for static hosting (GitHub Pages, Netlify, Vercel, etc.).

Example — deploy to GitHub Pages:

```bash
git add .
git commit -m "Deploy portfolio"
git push origin main
```

Then enable **GitHub Pages** in your repository settings (branch: `main`, root folder).

## 📄 License

Distributed under the MIT License. See `package.json` for details.

---

Built with passion and purpose. 💙
