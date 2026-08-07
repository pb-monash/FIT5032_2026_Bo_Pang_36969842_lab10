# FIT5032_2026_Bo_Pang_36969842_lab10

FIT5032 Lab 10 and Lab 11 Vue project for API usage and Cloudflare Pages deployment.

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create `.env` from the example file:

```bash
cp .env.example .env
```

3. Put your OpenWeather API key in `.env`:

```bash
VITE_OPENWEATHER_API_KEY=your_real_api_key_here
```

4. Start the development server:

```bash
npm run dev
```

5. Open:

```text
http://127.0.0.1:5173/WeatherCheck
```

## Deployment

Cloudflare Pages settings:

- Framework preset: Vue
- Build command: `npm run build`
- Build output directory: `dist`
- Environment variable: `VITE_OPENWEATHER_API_KEY`

The `public/_redirects` file is included so Vue history routes work after deployment.
