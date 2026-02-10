# Smart Placement Tracker 🎓

> Your personal companion for a stress-free placement journey - Track opportunities, deadlines, and progress all in one beautiful, offline-first application.

**Smart Placement Tracker** is a modern, full-stack React web application designed specifically for students navigating the placement process. Built with TypeScript, Vite, and cutting-edge web technologies, it helps you organize job applications, track deadlines, manage preparation checklists, visualize analytics, and reduce placement stress—all while working completely offline.

---

## ✨ Features

### Core Features
- 🎯 **Interactive Dashboard** - Get a bird's-eye view of your placement journey with glanceable widgets showing upcoming deadlines, application progress, and pending tasks
- 💼 **Opportunities Management** - Track unlimited job opportunities with detailed information (company, role, status, deadlines, package, location)
- 📊 **Analytics & Insights** - Visualize your success rate, status distribution, and application trends with interactive charts
- ✅ **Dynamic Checklists** - Create role-specific preparation checklists for each opportunity (resume, cover letter, coding prep, etc.)
- ⏰ **Deadline Tracking** - Never miss an application deadline with smart countdown timers and notifications
- 🎨 **Beautiful UI/UX** - Clean, modern design with calming colors, generous spacing, and minimal mental load
- 🌓 **Dark/Light Mode** - Full theme support with system preference detection
- 💾 **Offline-First** - All data stored locally in browser (localStorage) - works without internet
- 📱 **Fully Responsive** - Perfect experience on desktop, tablet, and mobile devices
- 🔒 **Privacy-Focused** - Your data never leaves your device

### Technical Features
- ⚡ **Lightning Fast** - Built with Vite for instant hot module replacement (HMR)
- 🎯 **Type-Safe** - Full TypeScript coverage for robust, error-free development
- 🔄 **State Management** - Zustand with persistence middleware for reactive, persistent state
- 📝 **Form Validation** - React Hook Form + Zod for bulletproof form handling
- 🎭 **Accessible Components** - Radix UI primitives for keyboard navigation and screen readers
- 🎨 **Tailwind CSS** - Utility-first styling with custom design system
- 📦 **Smart Routing** - React Router v6 with protected routes and navigation guards

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** React 18.2 with TypeScript 5.2
- **Build Tool:** Vite 5.0 (⚡ Fast refresh, instant HMR)
- **Routing:** React Router DOM v6.21
- **State Management:** Zustand 4.4 with persist middleware
- **Styling:** Tailwind CSS 3.4 with custom design tokens
- **Forms:** React Hook Form 7.49 + Zod 3.22 validation
- **UI Components:** Radix UI primitives + Custom components
- **Icons:** Lucide React 0.303
- **Charts:** Recharts 2.10
- **Date Handling:** date-fns 3.0
- **Utilities:** clsx, tailwind-merge, class-variance-authority

### Development
- **Linting:** ESLint with TypeScript plugin
- **Type Checking:** TypeScript strict mode
- **Package Manager:** npm / yarn / pnpm

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed on your system:

- **Node.js** (v18.0.0 or higher) - [Download here](https://nodejs.org/)
- **npm** (v9.0.0 or higher), **yarn** (v1.22.0+), or **pnpm** (v8.0.0+)
- **Modern Web Browser** (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)
- **Git** (for cloning the repository) - [Download here](https://git-scm.com/)

### Verify Installation
```bash
node --version   # Should be v18.0.0 or higher
npm --version    # Should be v9.0.0 or higher
```

---

## 🚀 Quick Start

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/yourusername/smart-placement-tracker.git
cd smart-placement-tracker
```

### 2️⃣ Install Dependencies
Choose your preferred package manager:

```bash
# Using npm
npm install

# Using yarn
yarn install

# Using pnpm
pnpm install
```

⏱️ **Installation time:** ~2-3 minutes (depending on internet speed)

### 3️⃣ Start Development Server
```bash
# Using npm
npm run dev

# Using yarn
yarn dev

# Using pnpm
pnpm dev
```

🎉 **Success!** The app should now be running at:
```
➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

### 4️⃣ Open in Browser
Navigate to **http://localhost:5173** in your web browser.

You'll be greeted with the **Onboarding screen** 🎓

---

## 📁 Project Structure

```
smart-placement-tracker/
├── public/                      # Static assets
│   └── vite.svg                # Vite logo
├── src/
│   ├── components/              # Reusable components
│   │   ├── ui/                 # UI primitives (shadcn-style)
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Label.tsx
│   │   │   └── Switch.tsx
│   │   ├── Layout.tsx          # Main app layout with sidebar
│   │   ├── Sidebar.tsx         # Navigation sidebar
│   │   └── ThemeProvider.tsx   # Dark/light theme provider
│   ├── lib/                     # Utility libraries
│   │   ├── theme.ts            # Theme store and hooks
│   │   └── utils.ts            # Utility functions (cn, etc.)
│   ├── pages/                   # Route pages
│   │   ├── Dashboard.tsx       # Main dashboard with widgets
│   │   ├── Onboarding.tsx      # Initial profile setup
│   │   ├── Opportunities.tsx   # Opportunities list/management
│   │   ├── Analytics.tsx       # Charts and insights
│   │   └── Settings.tsx        # App settings and data export
│   ├── store/                   # Zustand state stores
│   │   ├── userProfileStore.ts # User profile state
│   │   └── opportunitiesStore.ts # Opportunities CRUD
│   ├── types/                   # TypeScript type definitions
│   │   └── index.ts            # Shared types and interfaces
│   ├── App.tsx                  # Main app component with routing
│   ├── main.tsx                # App entry point
│   └── index.css               # Global styles (Tailwind imports)
├── .eslintrc.cjs               # ESLint configuration
├── .gitignore                  # Git ignore rules
├── index.html                  # HTML entry point
├── package.json                # Dependencies and scripts
├── postcss.config.js           # PostCSS configuration
├── tailwind.config.js          # Tailwind CSS configuration
├── tsconfig.json               # TypeScript configuration
├── tsconfig.node.json          # TypeScript config for Node files
├── vite.config.ts              # Vite configuration
└── README.md                   # This file
```

---

## 📜 Available Scripts

In the project directory, you can run:

### `npm run dev`
Starts the development server with hot module replacement (HMR).
- **URL:** http://localhost:5173
- **Hot Reload:** Changes reflect instantly
- **Network Access:** Use `--host` flag to access from other devices

### `npm run build`
Creates an optimized production build in the `dist/` folder.
- **Output:** Minified, tree-shaken bundles
- **Size:** Typically 200-400 KB gzipped
- **TypeScript:** Runs type checking before build

### `npm run lint`
Runs ESLint to check code quality and catch errors.
- **Auto-fix:** Use `npm run lint -- --fix`
- **Coverage:** TypeScript + React files

### `npm run preview`
Serves the production build locally for testing.
- **URL:** http://localhost:4173
- **Purpose:** Test production build before deployment

---

## 🎨 Developer Setup

### Environment Configuration
⚠️ **No environment variables required!** This app is 100% client-side and uses browser localStorage.

### Local Storage Keys
The app uses the following localStorage keys:
- `user-profile-storage` - User profile data (name, email, CGPA, skills)
- `opportunities-storage` - All job opportunities and checklists
- `theme-storage` - Theme preference (dark/light/system)

### Clearing Local Storage
```javascript
// In browser console (F12)
localStorage.clear()
// Then refresh the page
```

### Browser Support
| Browser | Minimum Version |
|---------|----------------|
| Chrome  | 90+            |
| Firefox | 88+            |
| Safari  | 14+            |
| Edge    | 90+            |

---

## 🐛 Troubleshooting

### Issue: Port 5173 already in use
**Solution:**
```bash
# Kill the process using the port (Windows)
npx kill-port 5173

# Or specify a different port
npm run dev -- --port 3000
```

### Issue: `npm install` fails with dependency errors
**Solution:**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

### Issue: TypeScript errors after pulling latest changes
**Solution:**
```bash
# Restart TypeScript server in VS Code
# Command Palette (Ctrl+Shift+P) → "TypeScript: Restart TS Server"

# Or clear build cache
rm -rf node_modules/.vite
npm run dev
```

### Issue: Styles not updating / weird layout
**Solution:**
```bash
# Clear Vite cache
rm -rf node_modules/.vite

# Restart dev server
npm run dev
```

### Issue: Data not persisting after refresh
**Problem:** localStorage might be disabled or full

**Solution:**
```javascript
// Check localStorage in browser console
console.log(localStorage.getItem('user-profile-storage'))

// Check if localStorage is available
typeof Storage !== 'undefined'
```

### Issue: Build fails with type errors
**Solution:**
```bash
# Run type check
npx tsc --noEmit

# Check specific file
npx tsc --noEmit --skipLibCheck src/path/to/file.tsx
```

### ⚠️ Common Gotchas
- **Date Serialization:** Dates stored in localStorage are strings, not Date objects. Always convert with `new Date(dateString)`.
- **Path Aliases:** Use `@/` prefix for absolute imports (configured in vite.config.ts).
- **CSS Specificity:** Tailwind utility classes can be overridden - use `!` prefix for important styles.

---

## 🗂️ Data Storage

### How Data is Stored
All data is stored in **browser localStorage** using **Zustand persist middleware**. Data is automatically:
- Serialized to JSON when saved
- Deserialized when loaded
- Persisted across page refreshes
- Scoped to the domain (no cross-site access)

### Export Your Data
1. Go to **Settings** page
2. Click **Export All Data (JSON)**
3. Save the `.json` file to your device

### Import Data (Manual)
Currently, import is manual via browser console:
```javascript
// In browser console (F12)
const backup = { /* paste your backup JSON here */ }
localStorage.setItem('user-profile-storage', JSON.stringify({ state: backup.profile }))
localStorage.setItem('opportunities-storage', JSON.stringify({ state: { opportunities: backup.opportunities } }))
location.reload()
```

---

## 🎯 Usage Guide

### First Time Setup
1. **Onboarding:** Enter your name, email, branch, CGPA, and skills
2. **Dashboard:** Explore your personalized dashboard
3. **Add Opportunity:** Click "Add Opportunity" to track your first application

### Adding an Opportunity
1. Navigate to **Opportunities** page
2. Click **Add Opportunity** button
3. Fill in company name, role, status, deadline, etc.
4. Save to start tracking

### Managing Opportunities
- **Update Status:** Click on an opportunity and change its status (Saved → Applied → Interview → Offer)
- **Add Checklists:** Create custom prep tasks for each opportunity
- **Set Deadlines:** Track application deadlines with countdown timers

### Using Analytics
- **View Trends:** See application success rates and status distribution
- **Track Progress:** Monitor how many applications are in each stage

### Customizing Settings
- **Theme Toggle:** Switch between dark/light mode
- **Export Data:** Backup your data as JSON
- **Clear Data:** Reset app and return to onboarding

---

## 🌐 Deployment

### Deploy to Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Production deployment
vercel --prod
```

### Deploy to Netlify
```bash
# Build the app
npm run build

# Deploy dist/ folder to Netlify
# Or connect your GitHub repo in Netlify dashboard
```

### Deploy to GitHub Pages
```bash
# Install gh-pages
npm i -D gh-pages

# Add to package.json scripts:
# "deploy": "npm run build && gh-pages -d dist"

# Deploy
npm run deploy
```

### Build Configuration
- **Output Directory:** `dist/`
- **Build Command:** `npm run build`
- **Node Version:** 18+ (set in deployment platform)

---

## 🤝 Contributing

We welcome contributions from the community! Here's how you can help:

### Contribution Guidelines
1. **Fork** the repository
2. **Create** a new branch (`git checkout -b feature/AmazingFeature`)
3. **Commit** your changes (`git commit -m 'Add some AmazingFeature'`)
4. **Push** to the branch (`git push origin feature/AmazingFeature`)
5. **Open** a Pull Request

### Code Standards
- Follow existing code style (TypeScript, functional components)
- Write meaningful commit messages
- Add comments for complex logic
- Test your changes thoroughly
- Update documentation if needed

### Ideas for Contribution
- 🎨 UI/UX improvements
- 📊 New chart types in Analytics
- 🔔 Browser notifications for deadlines
- 📤 CSV/PDF export functionality
- 🔍 Advanced search and filtering
- 🏆 Gamification features (badges, streaks)
- 🌍 Internationalization (i18n)

---

## 📄 License

This project is licensed under the **MIT License**.

```
MIT License

Copyright (c) 2026 Smart Placement Tracker

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 📞 Support & Contact

### Need Help?
- 📧 **Email:** support@smartplacementtracker.com
- 💬 **Discord:** [Join our community](#)
- 🐛 **Issues:** [GitHub Issues](https://github.com/yourusername/smart-placement-tracker/issues)
- 📖 **Documentation:** [See Wiki](#)

### Stay Connected
- ⭐ **Star this repo** if you find it helpful!
- 🐦 **Follow us** on Twitter [@SmartPlacement](#)
- 💼 **LinkedIn:** [Smart Placement Tracker](#)

---

## 🙏 Acknowledgments

Built with ❤️ using amazing open-source technologies:
- [React](https://react.dev/) - UI library
- [Vite](https://vitejs.dev/) - Build tool
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Zustand](https://github.com/pmndrs/zustand) - State management
- [Radix UI](https://www.radix-ui.com/) - Accessible components
- [Lucide](https://lucide.dev/) - Beautiful icons

---

## 📚 Additional Resources

### Learning Resources
- [React Documentation](https://react.dev/learn)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vite Guide](https://vitejs.dev/guide/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)

### Related Projects
- [shadcn/ui](https://ui.shadcn.com/) - Component library inspiration
- [Next.js](https://nextjs.org/) - Alternative framework
- [TanStack Query](https://tanstack.com/query) - Data fetching (for API version)

---

<div align="center">

**Made with 💙 for students, by students**

*Simplifying placements, one application at a time* 🎓✨

[⬆ Back to Top](#smart-placement-tracker-)

</div>
