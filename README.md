<p align="center">
  <br>
  <strong>K &nbsp; Q &nbsp; L &nbsp; &nbsp; L &nbsp; I &nbsp; B &nbsp; R &nbsp; A &nbsp; R &nbsp; Y</strong>
  <br>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=flat-square&amp;logo=react&amp;logoColor=white">
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&amp;logo=typescript&amp;logoColor=white">
  <img src="https://img.shields.io/badge/Vite-8-646CFF?style=flat-square&amp;logo=vite&amp;logoColor=white">
  <img src="https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=flat-square&amp;logo=tailwindcss&amp;logoColor=white">
</p>

---

**KQL Library** is a security-focused hub for browsing and copying Kusto (KQL) queries. Queries are grouped by Microsoft security product, with fast search and one-click copy for investigation and detection work.

## Features

- About 145 queries across Entra ID, Intune, Microsoft Sentinel, Defender for Endpoint (endpoint, attack surface reduction, SmartScreen, governance), Defender for Identity, Defender for Office 365, Defender for Cloud Apps, and Microsoft 365 Copilot agents.
- Sidebar navigation by category and subcategory.
- Search across titles, descriptions, and tags.
- One-click copy for every query.
- Responsive layout for desktop and mobile.

## Stack

React 19, TypeScript, Vite, Tailwind CSS v4, Framer Motion, Lucide icons, and Vercel Web Analytics.

## Development

```bash
npm install
npm run dev      # start the dev server
npm run build    # build to dist/
npm run preview  # serve the production build
```

## Adding queries

Queries are static JSON files in `public/queries/`, one file per product area. Each entry looks like this (see `public/template.json`):

```json
{
  "title": "Dormant Accounts",
  "description": "What the query finds and why it matters.",
  "query": "SigninLogs | ...",
  "category": "Entra ID",
  "subCategory": "Accounts",
  "tags": ["signin", "user"]
}
```

To add a new file, place it in `public/queries/` and add its name to the `queryFiles` list in `src/app.tsx`.

## License

[MIT](LICENSE)
