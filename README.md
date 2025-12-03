# Medicines Registration System

A Next.js application for pharmaceutical companies to register medicines with the Iraqi government. This system serves as an intermediary between pharmaceutical companies and government approval processes.

## Features

- 🌐 **Bilingual Support**: Arabic and English language support with RTL/LTR layouts
- 🌓 **Dark Mode**: Light and dark theme support
- 🔐 **Authentication**: Login system for pharmaceutical offices/companies
- 💊 **Medicine Registration**: Register medicines with details and file attachments
- ✅ **Approval System**: Admin dashboard to track and manage approval status
- 📊 **Progress Tracking**: Visual progress indicators for each medicine's approval process

## Tech Stack

- **Next.js 14** (App Router)
- **React 18**
- **Tailwind CSS** for styling
- **next-themes** for dark mode
- **JavaScript** (no TypeScript)

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

The application will automatically redirect to `/en` (English) or you can manually navigate to `/ar` for Arabic.

## Project Structure

```
medicines/
├── app/
│   ├── [locale]/          # Locale-based routing (en, ar)
│   │   ├── page.js        # Home page
│   │   ├── login/         # Login page
│   │   ├── dashboard/     # User dashboard
│   │   ├── medicine/      # Medicine registration
│   │   └── admin/         # Admin dashboard
│   ├── components/        # Reusable components
│   ├── globals.css        # Global styles
│   └── layout.js          # Root layout
├── i18n.js                # Translation messages
├── middleware.js          # Locale routing middleware
└── package.json
```

## Features Overview

### Login Page (`/en/login` or `/ar/login`)
- Email and password authentication
- Remember me functionality
- Forgot password link
- Sign up option

### Dashboard (`/en/dashboard` or `/ar/dashboard`)
- View all registered medicines
- See status and progress of each medicine
- Quick access to register new medicines

### Medicine Registration (`/en/medicine/register` or `/ar/medicine/register`)
- Register new medicines with:
  - Medicine name
  - Company name
  - Description
  - File attachments
- Automatic status assignment (pending)

### Admin Dashboard (`/en/admin` or `/ar/admin`)
- View all registered medicines
- Statistics overview (total, pending, approved, rejected)
- Manage approval status for each medicine
- Track progress of approval process
- Multiple approval stages:
  - Ministry Approval
  - Quality Control
  - Documentation Review

## Language Switching

Click the language switcher (EN/AR) in the navbar to switch between English and Arabic. The layout automatically adjusts for RTL (Arabic) and LTR (English).

## Dark Mode

Click the theme toggle button in the navbar to switch between light and dark modes. The preference is saved in the browser.

## Data Storage

Currently, the application uses `localStorage` for data persistence. In a production environment, this should be replaced with a proper backend API and database.

## Future Enhancements

- Backend API integration
- Database for persistent storage
- User authentication with JWT
- File upload to cloud storage
- Email notifications
- Advanced filtering and search
- Export functionality
- User roles and permissions

## License

This project is for internal use.
