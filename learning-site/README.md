# Learning site — The Anatomy of a Workflow Skill

An interactive, zero-build learning guide that explains the concepts behind the
`workflow-skill-creator` plugin: what makes a good multi-phase workflow skill, the
quality-control mechanisms (gates, state contracts, validation loops, execution-depth
contracts, the anti-pattern audit), and how those ideas generalize to building complex
multi-step agents.

It also traces the design lineage to three sources: the Agent Skills open standard
(agentskills.io), obra's **superpowers**, and Every's **compound engineering**.

## Read it

- **Live site:** [deremer.github.io/workflow-skills/learning-site/](https://deremer.github.io/workflow-skills/learning-site/)
- **One-page handout (PDF):** [`handout.pdf`](./handout.pdf) — printable Letter-size summary of the method, ideal for a meeting or wall pin.
- **Full Workflow Skills Guide (PDF):** [`VGV_Workflow_Skills_Guide.pdf`](./VGV_Workflow_Skills_Guide.pdf) — in-depth reference covering the full method end to end.

## What's here

```
learning-site/
├── index.html                          # the full editorial scroll story + inline SVG diagrams
├── styles.css                          # editorial layout, light/dark themes, reduced-motion handling
├── main.js                             # scroll reveals, diagram animation triggers, scroll progress, theme toggle
├── handout.html                        # printable one-page handout (source for handout.pdf)
├── handout.pdf                         # one-page Letter handout
├── VGV_Workflow_Skills_Guide.pdf       # full in-depth guide
├── vgv-lockup.svg                      # VGV lockup used in the handout
└── README.md                           # this file
```

No build step, no dependencies, no tracking. Plain HTML, CSS, and JavaScript using inline
SVG and system fonts, so it works offline.

## View it locally

Open the file directly:

```
open learning-site/index.html      # macOS
```

Or serve it (closest to how GitHub Pages behaves):

```
cd learning-site
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Deploy on GitHub Pages

The site uses relative asset paths, so it works from any base path.

1. In the repository: **Settings → Pages**.
2. Set **Source** to **Deploy from a branch**, branch `main`, folder `/ (root)`.
3. The guide will be served at:
   `https://deremer.github.io/workflow-skills/learning-site/`

If you would rather have it at the root of the Pages site, move these four files into a
`/docs` folder and set the Pages folder to `/docs`, or copy them to the repository root.

## Features

- Editorial long-form layout: single centered column, large type, generous whitespace.
- Scroll-triggered reveals and animated inline-SVG diagrams (architecture, gates, the
  contract chain, the validation loop, execution models).
- Light/dark theme toggle, persisted in `localStorage`, defaulting to the OS preference.
- A scroll-progress bar.
- Respects `prefers-reduced-motion`: animations collapse to instant reveals.
- Responsive down to small phone widths.
