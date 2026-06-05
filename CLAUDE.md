# idohirsh.com — Project Guide

Personal website of Ido Hirsh. Two parts:

- **`/`** (root `index.html`) — portfolio page. Hebrew RTL, self-hosted Noto Sans Hebrew, pure HTML/CSS.
- **`/amit/`** — a playful "fan club" troll page for Amit (Ido's partner). Self-contained `amit/index.html` + images. Hebrew RTL, inline CSS + vanilla JS. Tone: funny/meme, but **not cringe** — keep it light, dial back over-the-top superlatives.

## Tech stack

- Pure HTML + CSS + vanilla JS. **No build step, no framework.**
- `assets/` — css, fonts, images. `functions/_middleware.js` — Cloudflare Pages Function (redirects `www.idohirsh.com` → bare `idohirsh.com`).
- The original root portfolio was once recreated from a reference screenshot; if asked to match a design, render with Puppeteer and compare to the reference (spacing, font sizes, colors, radii) until within ~2–3px.

## ⚠️ Deployment — MANUAL, not git-auto

This site is hosted on **Cloudflare Pages**, project name **`idohirsh`**, deployed via **wrangler direct upload**. It is **NOT** connected to GitHub auto-deploy. **Pushing to GitHub does NOT update the live site.** To ship a change you must do **BOTH**:

**1. Commit + push to GitHub** (`origin/main`, repo `itsidohirsh/idohirsh.com`).

**2. Deploy to Cloudflare Pages** with wrangler, from a **clean staging dir** (never deploy `.` — it could expose `.git`):

```bash
rm -rf /tmp/deploy && mkdir -p /tmp/deploy
cp index.html /tmp/deploy/ && cp -R amit assets functions /tmp/deploy/
find /tmp/deploy -name .DS_Store -delete
npx wrangler pages deploy /tmp/deploy --project-name=idohirsh --branch=main --commit-dirty=true
```

- Deploy **only** `index.html`, `amit/`, `assets/`, `functions/`. Never `.git`, `.wrangler`, `CLAUDE.md`, `README.md`.
- `--branch=main` makes it a **production** deploy (publishes to idohirsh.com). Other branch names create preview URLs only.
- **Auth:** wrangler is already logged in via OAuth as `bizidohirsh@gmail.com` (account "Ido Hirsh", id `6132390e168d2b7ea284928030f30d7e`). Verify with `npx wrangler whoami`; if not logged in, `npx wrangler login` (interactive).
- **SPA fallback gotcha:** unknown paths return `index.html` with HTTP **200** (not 404). So a 200 on a missing path does NOT prove the file deployed — grep the HTML for a real marker instead.

## Verify changes

- **Local preview:** `python3 -m http.server 8788` → http://127.0.0.1:8788/amit/
- **Render/inspect:** install Puppeteer in a temp dir (`cd /tmp/x && npm i puppeteer`), load the local URL, screenshot, simulate clicks/touch, read computed styles. Animations (ticker/carousel) won't show in a single frame — sample multiple transforms or check geometry.
- **After deploy, confirm live:** `curl -s "https://idohirsh.com/amit/?cb=$(date +%s)" | grep <new-marker>`

## `/amit/` page details

- Single self-contained `amit/index.html`, `dir="rtl"`. Favicon = chocolate emoji 🍫 (inline SVG data URI).
- **Images** (clean names, no spaces — rename uploads): `amit.jpg` + `amit3/4/5.jpg` = Amit solo (profile rotation); `moment1.jpg` (historic moment) + `moment2.jpg` (Amit + Ido at airport) = carousel slides.
- **Profile photo** rotates through `[amit.jpg, amit3, amit4, amit5]` every 2s, preloaded, with a soft opacity fade.
- **"Historic moment" carousel** — 2 slides, **non-looping**: white nudging arrows + dots + mobile swipe. Track is `direction:rtl`, `transform: translateX(idx*100%)`, dynamic per-slide height. `go()` clamps to `[0, total-1]` (no wraparound). The unusable edge arrow is hidden: back arrow (right, `›`) hidden on slide 1; forward arrow (left, `‹`) hidden on slide 2. Swipe-right = forward, swipe-left = back (past an end = no-op via clamp).
- **News ticker** — RTL marquee: two identical `<span>` copies inside `.ticker__track` for a seamless loop, moves rightward, items wrapped in `<i class="ti">` with a `::after` bullet (even margins). One copy is wider than the viewport so there's no black gap.
- **Love button** — increments a `localStorage` counter, fires confetti, shows a random quip. Under-button text starts as `עוד לא לחצת? 👀`. The displayed "fans" stat jumps on each click.

## RTL gotchas (learned the hard way)

- `‹ ›` (U+2039/203A) are **bidi-mirrored** — in an RTL context they visually flip. Force `direction:ltr` on the arrow buttons.
- Marquee/carousel `translateX` behaves differently under RTL (the track is right-aligned and overflows left). **Test the actual on-screen direction**, don't assume from the sign.
- Use `unicode-bidi:isolate` on ticker items so neutral separators (`·`) and emoji don't reorder.
