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
- **Thank-you page** — Confirmation page after sending a message
- **Polish** — Smooth scroll navigation, scroll-reveal animations, staggered card entrances, floating hero image, scroll-to-top button, compact sticky navbar, and `prefers-reduced-motion` support

## 🛠️ Tech Stack

- **HTML5** — Semantic, accessible markup
- **CSS3** — Custom properties (design tokens), flexbox/grid layouts, keyframe animations, responsive breakpoints
- **JavaScript** — Vanilla JS for navigation, scroll effects, and UI interactions (no frameworks)
- **Bootstrap Icons** — Icon set loaded via CDN
- **Google Fonts** — Inter + Poppins
- **FormSubmit** — Zero-backend contact form delivery

## 📁 Project Structure

```
.
├── index.html              # Main portfolio page
├── thank-you.html          # Post-form-submission confirmation page
├── package.json
├── README.md
├── public/
│   └── images/
│       └── Me.jpg          # Profile photo
└── src/
    ├── styles/
    │   └── style.css       # All styles & animations
    └── scripts/
        └── script.js       # Navigation, scroll & reveal logic
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

### Option 3: Install dependencies (optional)

```bash
npm install
```

> `bootstrap-icons` is listed as a dependency for reference, but the site loads icons from a CDN, so installation is not required to run it.

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
