# Quantum Vortex Experience

## Deploy ke Cloudflare Pages

### Opsi 1: Static Export (Recommended)

```bash
npm install
npm run build
```

Output ada di folder `dist/`. Upload ke Cloudflare Pages via Dashboard atau Wrangler.

### Opsi 2: Wrangler CLI

```bash
npm install
npm run build
npx wrangler pages deploy dist
```

### Opsi 3: Git Integration (Auto Deploy)

1. Push repo ke GitHub
2. Buka Cloudflare Dashboard → Pages → Create a project
3. Connect ke GitHub repo
4. Build settings:
   - Framework preset: Next.js
   - Build command: `npm run build`
   - Build output directory: `dist`
5. Deploy

## Fitur

- 50.000 particle quantum vortex dengan GLSL shaders
- Text morphing (particles ke 3D text geometry)
- Biomechanical backbone dengan cyberpunk lighting
- Reactor core dengan Fresnel shader + white-out finale
- Glassmorphism UI cards
- Post-processing: Bloom, Noise, Chromatic Aberration
- Lenis smooth scroll + GSAP ScrollTrigger

## Tech Stack

- Next.js 14 (App Router)
- React Three Fiber + Three.js
- GSAP + ScrollTrigger
- Lenis Smooth Scroll
- @react-three/postprocessing
- Tailwind CSS
