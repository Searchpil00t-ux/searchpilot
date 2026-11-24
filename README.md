# SearchPilot
Guiding businesses towards better search visibility.

## Run locally
    cp .env.example .env && npm install && npx prisma db push && npm run dev

## Deploy (Docker, any VPS)
    cp .env.example .env   # add keys, or leave blank for demo mode
    docker compose up -d --build

Without PAGESPEED_API_KEY / MOZ keys the app runs in demo mode. The HTML crawler and RDAP lookups are always live (RDAP falls back to demo values if unreachable).
Put Nginx/Caddy in front for HTTPS.
