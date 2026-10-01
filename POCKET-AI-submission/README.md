# POCKET.AI

Smart Budget & Recommendation Assistant.

## What this submission includes

- Cyber-brutalist fintech dashboard
- Responsive desktop/mobile layout
- Dashboard with live demo calculations
- Add/delete transactions
- Search transactions
- Budget tracking
- Savings goals
- Spending analytics and charts
- POCKET AI recommendation screen
- Demo login screen
- Supabase production schema with Row Level Security
- `.env.example` for future Google OAuth/OpenAI integration

## Run locally

Requirements:
- Node.js 18.17+
- npm

```bash
npm install
npm run dev
```

Open:

http://localhost:3000

## Production build

```bash
npm run build
npm start
```

## Google OAuth / Supabase upgrade

The current submission intentionally runs without external credentials so it can be demonstrated immediately.

For a production version:

1. Create a Supabase project.
2. Enable Google provider under Authentication > Providers.
3. Add the callback URL supplied by Supabase.
4. Add the values from `.env.example`.
5. Run `supabase/schema.sql` in the Supabase SQL editor.
6. Replace the demo login/session with Supabase Auth.
7. Connect transaction, budget and goal actions to the database.

Never store or request a user's Google password. Google handles credentials through OAuth.
