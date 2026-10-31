# Deployment Guide — Boardwalk 3D PC & Hardware Explorer

This guide covers everything required to build, test, containerize, and deploy the **Boardwalk 3D PC Hardware Explorer** to any modern web hosting platform or cloud infrastructure.

---

## 1. Quick Start & Prerequisites

- **Node.js**: v18.0.0 or higher (v20+ LTS recommended)
- **Package Manager**: `npm`, `pnpm`, or `bun`
- **Modern Browser**: Chrome 90+, Firefox 90+, Safari 15+, Edge 90+ (WebGL 2.0 or WebGL 1.0 hardware acceleration enabled)

### Local Build & Preview
```bash
# 1. Install dependencies
npm install

# 2. Run automated test suite (all 31 tests must pass)
npm test

# 3. Check TypeScript types
npm run lint

# 4. Generate optimized production bundle
npm run build

# 5. Preview production build locally
npm run preview
```

The production output will be generated in the `/dist` directory.

---

## 2. Environment Variables

| Variable | Required | Description | Default |
| :--- | :---: | :--- | :--- |
| `GEMINI_API_KEY` | Optional | API key for server-side Gemini hardware assistant (`/api/ask`) | Unset (UI degrades gracefully) |
| `DISABLE_HMR` | Optional | Set to `true` in automated build environments to disable HMR watchers | `false` |

Copy `.env.example` to `.env` if you are providing local environment variables:
```bash
cp .env.example .env
```

---

## 3. Platform Deployment Guides

### Option A: Vercel (Recommended for SPAs)
1. Import the repository into your Vercel Dashboard.
2. Configure Project Settings:
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
3. Optional: Add `GEMINI_API_KEY` to **Environment Variables**.
4. Deploy.

Add a `vercel.json` if you wish to enforce SPA rewrite routing:
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }],
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        { "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }
      ]
    }
  ]
}
```

---

### Option B: Netlify
1. Connect repository in Netlify.
2. Build settings:
   - **Base directory**: `/` (root)
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
3. SPA routing redirect rule (`_redirects` file in `public/` or `dist/`):
   ```text
   /*    /index.html   200
   ```

---

### Option C: Cloudflare Pages
1. Select **Workers & Pages** > **Create application** > **Pages** > **Connect to Git**.
2. Build configuration:
   - **Framework preset**: `Vite`
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
3. Cloudflare Pages handles single-page app routing automatically.

---

### Option D: GitHub Pages
1. In `vite.config.ts`, verify the `base` path matches your repo name if not hosted at the root domain:
   ```ts
   // Example for https://<user>.github.io/<repo>/
   export default defineConfig({
     base: '/3D-PC/',
     ...
   });
   ```
2. Build and push `dist` via GitHub Actions (`actions/deploy-pages`).

---

### Option E: Docker & Nginx (Self-Hosted / Cloud Run / Kubernetes)

Create a `Dockerfile` at the root:

```dockerfile
# Stage 1: Build application
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Serve via Nginx
FROM nginx:alpine-slim
COPY --from=builder /app/dist /usr/share/nginx/html

# Custom Nginx SPA configuration
RUN printf 'server {\n\
    listen 80;\n\
    server_name _;\n\
    root /usr/share/nginx/html;\n\
    index index.html;\n\
\n\
    location / {\n\
        try_files $uri $uri/ /index.html;\n\
    }\n\
\n\
    location ~* \.(?:css|js|woff2?|png|jpg|svg|ico)$ {\n\
        expires 1y;\n\
        add_header Cache-Control "public, max-age=31536000, immutable";\n\
    }\n\
}\n' > /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

Build and run:
```bash
docker build -t boardwalk-3d-pc .
docker run -p 8080:80 boardwalk-3d-pc
```

---

## 4. WebGL & Client Compatibility Considerations

- **Canvas Context**: Three.js initializes a standard WebGL 2.0 context with fallback to WebGL 1.0.
- **Shadow Maps**: Configured using `THREE.PCFShadowMap` for maximum mobile and low-power GPU compatibility.
- **Resize Observer**: Canvas dimensions scale dynamically with debounced aspect-ratio updates to prevent layout shifts.
- **Pointer Isolation**: Interaction events on UI panels, notes, and lesson strips stop propagation to OrbitControls, ensuring trouble-free touch and mouse control on all viewports.
- **High-DPI / Retina**: Renderer clamps device pixel ratio to `Math.min(window.devicePixelRatio, 2)` to avoid performance degradation on 3x/4x mobile screens.

---

## 5. Pre-Deployment Verification Checklist

Before pushing to production or tagging a release:

- [x] Run `npm run lint` (`tsc --noEmit` returns code 0).
- [x] Run `npm test` (all 31 unit & integration tests pass).
- [x] Run `npm run build` (build completes with 0 warnings or chunk size alerts).
- [x] Check `<title>` and OpenGraph tags in `index.html` match metadata.
- [x] Verify study notes persist correctly across reloads in `localStorage`.
- [x] Verify Print Notes stylesheet formats cleanly on standard letter/A4 page layouts.
- [x] Verify Fullscreen Mode works seamlessly across desktop and mobile devices.
