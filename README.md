# The Tracker Guy

Next.js (App Router) + Tailwind CSS v4 + Firebase (Authentication + Firestore).

- `npm install` then `npm run dev` (http://localhost:3000)
- `npm run build` for production (static export to `out/`)
- Admin panel: `/admin`

## Content
- All website text lives in `lib/content.ts` as the defaults.
- Edits made in `/admin` are saved to Firestore (`content/main`) and laid over the defaults.
- The live site loads saved edits in the browser, so changes show on the next page load.
  Every new deploy also bakes the latest saved content into the HTML (better for Google).
- Images (`public/logo.png`, `public/fawas.jpg`) are not edited from the admin. Replace the files to change them.
- `public/llms.txt` is a separate hand-written file and is not edited from the admin.

## Invoices
- Admin > Invoices: create, save, mark paid/unpaid, export PDF or PNG.
- Numbers are automatic: `INV-2026-001`, restarting each year.
- Clients are saved to Admin > Customers when an invoice is saved.
- Admin > Invoice settings: business details, bank details, terms, thank-you line, number prefix.

## Firebase setup
1. Firebase console > Authentication > Sign-in method: enable **Email/Password**.
2. Authentication > Users > **Add user**: your admin email and a password.
3. Authentication > Settings > Authorized domains: add `thetrackerguy.com.ng` (and your Vercel/Netlify domain).
4. Firestore Database > Rules: paste `firestore.rules` (admin email already set to fawas@thetrackerguy.com.ng), click **Publish**.
5. Copy `.env.example` to `.env.local` and fill in the values from Project settings > Your apps > Web app.
6. Add the same variables in your Vercel/Netlify project settings (Environment Variables), then redeploy.
