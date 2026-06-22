# CSI Desktop Environment

An interactive, desktop-inspired web application for CSI. Built with [Next.js](https://nextjs.org), [Framer Motion](https://www.framer.com/motion/), React, and GSAP. 

## Features

- **Mac Desktop Interface**: Features a fully functional macOS-like dock and window management system.
- **Interactive Animations**: Advanced liquid backgrounds, interactive cursor tracking, and fluid transitions using Framer Motion & GSAP.
- **Section Modules**: Discover what we do at CSI with standalone application windows, including:
  - About Us
  - Projects
  - Events
  - Team
  - Departments
  - And more...

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org) (App Router)
- **Styling/Animations**: [Framer Motion](https://www.framer.com/motion/), [GSAP](https://gsap.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Language**: TypeScript

## Getting Started

1. **Install dependencies**

```bash
npm install
```

2. **Run the development server**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Structure

- `/src/components` - Core UI components including `DesktopWindow`, `MacDock`, and animated modules.
- `/src/components/sections` - Content sections meant to act as discrete app windows on the desktop.
- `/public` - Static assets and icons.
