# Hostly Preview

This is a standalone, shareable preview version of the Hostly application frontend. 
It utilizes a synthetic mock database and demonstrates the fully operational UI/UX 
including the premium dark navy theme and role-based dashboard architectures.

## How to View Locally (Windows)

A convenient `start-preview.bat` script is included.
1. Simply double-click `start-preview.bat`.
2. It will automatically run a local static web server (`npx serve`) and open your browser.

*Note: Since this is a Single Page Application (SPA), directly opening `index.html` via `file://` will not work properly due to browser routing and CORS restrictions. It must be served via HTTP.*

## Deployment

This preview bundle is ready to be dropped into static hosting providers such as Netlify, Cloudflare Pages, or Render. A `_redirects` file is included in the bundle to automatically handle SPA history API fallback. 
For Vercel, you may need to add a `vercel.json` rewrite manually.

## Available Demo Roles

You can test the cross-role dashboard protection by using the **Demo accounts** section directly on the login page:
- **Super Admin** (`super@hostly.app`) -> SaaS Platform Control
- **Owner** (`owner@hostly.app`) -> Operational PG Management
- **Manager / Staff** (`manager@hostly.app`) -> Staff Tasks
- **Tenant** (`tenant@hostly.app`) -> Tenant App

## Limitations
- **Data is Fictional**: All users, properties, names, and MRR metrics are synthetic placeholders.
- **No Real Transactions**: The Pricing flow allows you to visualize subscription selection but does not process real payments.
- **No Real Backend**: Actions that attempt to persist data outside the local mock session will simply reset upon hard refresh.
