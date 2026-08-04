# Shrnkly

> Shorten URLs, share text, and generate QR codes from one multilingual web application.

[![Live app](https://img.shields.io/badge/Live-Netlify-00C7B7?logo=netlify&logoColor=white)](https://shrnkly.netlify.app)
[![Support on SupportKori](https://img.shields.io/badge/Support-SupportKori-00B8B5)](https://www.supportkori.com/montasim)

Shrnkly combines three common sharing workflows: create redirect links, publish bounded text/code shares, and generate downloadable QR codes. Accounts add a dashboard for managing URLs and text shares, while click and view records support basic usage analysis.

**[Open Shrnkly](https://shrnkly.netlify.app) · [Create a text share](https://shrnkly.netlify.app/texts) · [Generate a QR code](https://shrnkly.netlify.app/qr) · [Report an issue](https://github.com/montasim/shrnkly-url-shortener/issues)**

> **Project status:** The Netlify deployment is reachable. The repository has no license file, and several pricing, subscription, Redis, and Docker claims in the previous README were ahead of the checked-in implementation. This document distinguishes current code paths from unverified or planned behavior.

## Features

### URLs

- Create short redirect keys for long URLs
- Use guest or authenticated ownership
- Request a custom slug where supported
- Record click totals plus IP address, country fields, and user-agent value
- View URL records and charts in the dashboard
- Generate a QR image for a short URL
- Store optional expiry and password-hash fields

### Text shares

- Publish plain text, Markdown, or code-oriented content
- Add a title, syntax language, custom slug, password, expiry, and view limit
- Choose public or non-public visibility
- Track view counts and access records
- Manage shares from the dashboard

### QR generator

- Generate QR codes in the browser for text, URLs, notes, Wi-Fi, vCard, SMS, and email content
- Adjust size, colors, and error-correction options
- Download, copy, or use the browser share capability
- Use the generator without an account

### Access and localization

- Email/password registration and login
- Google OAuth configuration
- Password-reset email
- JWT access and refresh tokens
- Cloudflare Turnstile integration
- English, German, Spanish, French, Chinese, Hindi, Urdu, Arabic, and Bengali routes

## Use Shrnkly

### Shorten a URL

1. Open the [home page](https://shrnkly.netlify.app).
2. Submit a valid destination URL.
3. Copy the generated short URL.
4. Open dashboard details when you need recorded click information.

### Share text

1. Open [text sharing](https://shrnkly.netlify.app/texts).
2. Enter the content and optional title.
3. Choose format, syntax language, visibility, expiry, password, view limit, or custom slug as applicable.
4. Create and copy the share link.

### Generate a QR code

1. Open the [QR generator](https://shrnkly.netlify.app/qr).
2. Select the content type and enter the payload.
3. Adjust appearance and error correction.
4. Download, copy, or share the generated image.

Never place secrets in public text shares or QR payloads. Password protection limits access through the application but does not replace safe secret storage.

## Data and privacy

Shrnkly persists account, URL, text-share, token, usage, click, and view data in MongoDB. Click and text-view logs can include IP address, country information, and user-agent strings. Operators should disclose retention, lawful basis, access, deletion, and log-protection practices for their deployment.

QR generation uses browser-side code. URL shortening, redirects, accounts, analytics, and text sharing use server routes and persistent storage.

Review the deployed [privacy page](https://shrnkly.netlify.app/privacy) and [terms](https://shrnkly.netlify.app/terms), but self-hosters must replace branding and policy content with terms that match their own operation.

## Local development

### Prerequisites

- Node.js 20 or newer, matching [`.node-version`](.node-version)
- pnpm 10.12
- MongoDB
- Infisical CLI only if using `pnpm start` as currently defined

```bash
git clone https://github.com/montasim/shrnkly-url-shortener.git
cd shrnkly-url-shortener
pnpm install
cp .env.example .env
pnpm prisma:generate
pnpm dev
```

Open <http://localhost:3000>. The locale middleware selects the localized route.

### Required configuration

The annotated [`.env.example`](.env.example) is the source of truth. Core groups include:

| Group | Variables |
| --- | --- |
| Branding and URLs | `NEXT_PUBLIC_PROJECT_NAME`, `NEXT_PUBLIC_BASE_URL`, public contact/repository URLs |
| Database | `DATABASE_URL` |
| JWT | access/refresh secrets, expirations, browser refresh interval |
| Cookies | secure, same-site, HTTP-only, name, and age settings |
| Timeouts | `API_CALL_TIMEOUT_S`, `FORGET_PASSWORD_EXPIRES_MS` |
| Text sharing | maximum content, default expiry, cleanup schedule |

Optional integrations include Google OAuth, Nodemailer, Cloudflare Turnstile, and placeholder Stripe values. Use independent high-entropy secrets, production-safe cookies, and exact provider callback URLs.

> Stripe variables exist in the template and subscription fields exist in the schema, but no complete Stripe checkout/webhook route was verified. Do not advertise or charge for automated premium billing until that lifecycle is implemented and tested.

## Commands

| Command | Purpose |
| --- | --- |
| `pnpm dev` | Start Next.js with Turbopack |
| `pnpm prisma:generate` | Generate Prisma Client |
| `pnpm build` | Clear `.next`, generate Prisma Client, and build |
| `pnpm start` | Run `next start` through Infisical |
| `pnpm prettier:check` | Check formatting |
| `pnpm prettier:fix` | Format files |
| `pnpm test` | Run Jest |
| `pnpm test:watch` | Run Jest in watch mode |
| `pnpm cleanup` | Execute the TypeScript cleanup task |
| `pnpm release` | Version, tag, and push a release |

The declared `pnpm lint` command uses `next lint`. Verify it against the installed Next.js version before treating it as a release gate.

## Architecture

```text
browser
  ├── localized UI
  ├── client-side QR generation
  └── server actions / API
          │
          ├── auth and JWT
          ├── short URL redirects and click logs
          ├── text shares and view logs
          └── Prisma ──► MongoDB
```

| Path | Purpose |
| --- | --- |
| `app/[locale]/` | Localized public and dashboard routes |
| `app/api/v1/` | Authentication, URL, text, and QR HTTP routes |
| `services/` | User, URL, text-share, token, usage, and subscription logic |
| `prisma/schema.prisma` | MongoDB data model |
| `components/qr/` | Browser QR workflow |
| `schemas/` | Request and environment validation |
| `scripts/` | Cleanup and Infisical helpers |

## Deployment and maintenance

The verified deployment is [shrnkly.netlify.app](https://shrnkly.netlify.app). A production instance requires MongoDB, stable JWT secrets, secure cookie settings, its canonical base URL, and any enabled provider credentials.

Expired text shares require the cleanup task or an equivalent scheduler:

```bash
pnpm cleanup
```

A [scheduled cleanup workflow](.github/workflows/url-cleanup.yml) exists for monthly and manual runs. It currently selects Node.js 18 and runs `npm ci` even though the application requires Node.js 20+ and no `package-lock.json` is tracked. Correct those workflow assumptions before relying on scheduled deletion.

Review and back up MongoDB before schema or cleanup changes. A [`docker-compose.yml`](docker-compose.yml) file is tracked, but the container path is stale and currently broken: the Dockerfile uses Node 18 while `package.json` requires Node 20+, runs the misspelled `nppm install`, and copies `next.config.js` to `next.configuration.js` even though the repository tracks `next.config.ts`. Compose also points to `.env.development.development` and runs `yarn dev` despite the pnpm-based setup. Repair these files before using Docker.

The `pnpm start` script requires an authenticated Infisical environment. Without Infisical, run the built app through the underlying Next.js command after supplying environment variables by another secure mechanism.

## Current limitations

- There is no license file; the repository cannot be assumed open source.
- Subscription tiers are represented in code, but automated payment activation is not verified.
- Redis is listed as a dependency/keyword, but no active Redis integration was found in the inspected runtime path.
- URL logs record country fields and user agent, not the region, city, referrer, maps, or advanced attribution previously advertised.
- Custom-domain support is not implemented.
- QR generation is client-side, but offline/PWA availability is not established.
- The deployment operator is responsible for abuse controls, retention, deletion, backups, monitoring, and incident response.
- There is no pull-request CI workflow; the only GitHub Actions workflow is the currently mismatched scheduled cleanup job.

## Documentation

- [Environment template](.env.example)
- [Turnstile setup](TURNSTILE_SETUP.md)
- [Infisical and Turnstile setup](INFISICAL_TURNSTILE_SETUP.md)
- [Metadata guide](docs/METADATA.md)
- [Scheduled cleanup workflow](.github/workflows/url-cleanup.yml)
- [Security policy](SECURITY.md)
- [Changelog](CHANGELOG.md)

## Contributing

Issues and focused pull requests are welcome. Run `pnpm prettier:check`, `pnpm test`, and `pnpm build` before submitting; verify lint separately until its command is corrected. Include privacy and retention impact for changes to click or view logging.

No separate contribution guide or code of conduct is included.

## Support and security

Use [GitHub Issues](https://github.com/montasim/shrnkly-url-shortener/issues) for non-sensitive bugs and proposals. Never include tokens, passwords, private shares, IP logs, or database records.

Report vulnerabilities privately according to [SECURITY.md](SECURITY.md).

## Funding

Support continued maintenance through [SupportKori](https://www.supportkori.com/montasim). Security reports, tests, privacy review, and code contributions are also valuable.

## Author

Built and maintained by [Montasim](https://github.com/montasim).

## License status

No license file is included. Source visibility and a public deployment do not grant permission to copy, modify, or redistribute this project.
