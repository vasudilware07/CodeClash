# CodeClash Frontend

The frontend application for **CodeClash** — a real-time 1v1 competitive programming platform where users battle on DSA problems and Codeforces duels.

## Tech Stack

| Technology | Purpose |
|---|---|
| React 19 | UI framework |
| TypeScript | Type safety |
| Vite | Build tool & dev server |
| Tailwind CSS | Styling |
| Monaco Editor | In-browser code editor |
| StompJS / SockJS | WebSocket-based real-time communication |
| React Router | Client-side routing |
| TanStack Query | Server state management |
| Framer Motion | Animations |
| React Hook Form + Zod | Form handling & validation |

## Features

- Google OAuth login
- Real-time 1v1 coding duels (Standard & Codeforces mode)
- Monaco-based code editor with multi-language support
- Live submission result updates via WebSockets
- Match history and performance stats
- Admin / Problem Setter workflows

## Getting Started

### Prerequisites

- Node.js (v18+)
- npm

### Install dependencies

```bash
npm install
```

### Configure environment variables

Create a `.env` file based on `.env.example`:

```env
VITE_API_BASE_URL=http://localhost:8080
VITE_WS_BASE_URL=ws://localhost:8080
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

### Run in development mode

```bash
npm run dev
```

### Build for production

```bash
npm run build
```

## Deployment

The frontend is built via GitHub Actions and deployed to **AWS S3**, with **Amazon CloudFront** used for content delivery when the AWS environment is active.
