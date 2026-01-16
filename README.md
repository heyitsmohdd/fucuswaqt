# 🎯 FocusWaqt

> **An atmospheric lofi focus tool** - Beautiful Pomodoro timer with immersive backgrounds, ambient soundscapes, and productivity tracking.

[![Next.js](https://img.shields.io/badge/Next.js-16.1-black?style=flat&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2-blue?style=flat&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.x-38bdf8?style=flat&logo=tailwind-css)](https://tailwindcss.com/)


---

## ✨ Features

### 🕐 **Pomodoro Timer**
- Customizable work/break intervals
- Visual countdown with glassmorphism UI
- Audio notifications for session transitions
- Keyboard shortcuts for quick control

### 🎬 **Immersive Backgrounds**
- 8+ high-quality looping video backgrounds
- Smooth transitions between scenes
- Loading states for optimal UX
- Responsive video player with error handling

### 🎵 **Multi-Track Sound Mixer**
- Pre-loaded ambient tracks (rain, forest, coffee shop, lofi beats)
- Individual volume controls per track
- YouTube integration for custom music
- URL validation and error boundaries

### ✅ **Task Management**
- Create and manage daily tasks
- Track task completion
- Synced with Supabase for logged-in users
- Local storage fallback for guests
- Input sanitization (XSS protection)

### 🔥 **Streak Tracking**
- Daily login streak counter
- Visual streak display with animations
- Automatic streak updates
- Synced across devices (Supabase)

### 🔐 **Authentication**
- GitHub OAuth integration
- Google OAuth integration
- Secure session management
- Rate limiting protection (10 req/min)

### ♿ **Accessibility**
- WCAG 2.1 compliant
- Comprehensive ARIA labels
- Keyboard navigation support
- Screen reader optimized

### 🛡️ **Security**
- XSS protection with DOMPurify
- Rate limiting on auth endpoints
- OAuth redirect vulnerability fixes
- Input length validation
- CSP headers configured
- Error boundaries for graceful failures

---

## 🚀 Tech Stack

### **Frontend**
- **[Next.js 16](https://nextjs.org/)** - React framework with App Router
- **[React 19](https://react.dev/)** - UI library
- **[TypeScript](https://www.typescriptlang.org/)** - Type safety
- **[Tailwind CSS 4](https://tailwindcss.com/)** - Utility-first styling
- **[Lucide React](https://lucide.dev/)** - Icon library

### **State Management**
- **[Zustand](https://zustand-demo.pmnd.rs/)** - Lightweight state management
- **React Context** - Authentication state

### **Backend & Database**
- **[Supabase](https://supabase.com/)** - PostgreSQL database, authentication, and real-time
- **Server Actions** - Next.js 14+ server actions for data mutations

### **Security & Validation**
- **[DOMPurify](https://github.com/cure53/DOMPurify)** - XSS sanitization
- **Custom rate limiting** - Supabase-based IP tracking
- **eslint-plugin-security** - Security linting

### **Testing**
- **[Vitest](https://vitest.dev/)** - Unit testing framework
- **[React Testing Library](https://testing-library.com/react)** - Component testing

### **Developer Experience**
- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **Vercel Analytics** - Usage tracking

---

## 📦 Installation

### Prerequisites
- **Node.js** 18.x or higher
- **npm**, **pnpm**, or **yarn**
- **Supabase account** (free tier works)

### 1. Clone the Repository
```bash
git clone https://github.com/shariqattarr/fucuswaqt.git
cd focuswaqt
```

### 2. Install Dependencies
```bash
npm install
# or
pnpm install
# or
yarn install
```

### 3. Set Up Environment Variables
Copy `.env.example` to `.env.local` and fill in your credentials:

```bash
cp .env.example .env.local
```

**Required variables:**
```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

> 💡 **Get Supabase credentials:** Create a project at [supabase.com](https://supabase.com/), then navigate to **Project Settings → API** to find your keys.

### 4. Set Up Database Schema

Create the following tables in your Supabase project:

#### **`tasks` Table**
```sql
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_tasks_user_id ON tasks(user_id);
```

#### **`user_streaks` Table**
```sql
CREATE TABLE user_streaks (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  current_streak INTEGER DEFAULT 0,
  last_login_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### **`rate_limits` Table** (for security)
```sql
CREATE TABLE rate_limits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  identifier TEXT NOT NULL,
  count INTEGER DEFAULT 1,
  reset_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_rate_limits_identifier ON rate_limits(identifier);
CREATE INDEX idx_rate_limits_reset_at ON rate_limits(reset_at);
```

### 5. Configure OAuth Providers

#### **GitHub OAuth**
1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Create a new OAuth App
3. Set callback URL: `https://your-project.supabase.co/auth/v1/callback`
4. Add credentials to Supabase **Authentication → Providers → GitHub**

#### **Google OAuth**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create OAuth 2.0 credentials
3. Set authorized redirect URI: `https://your-project.supabase.co/auth/v1/callback`
4. Add credentials to Supabase **Authentication → Providers → Google**

### 6. Run Development Server
```bash
npm run dev
# or
pnpm dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app! 🎉

---

## 🧪 Testing

### Run Tests
```bash
# Run all tests once
npm test

# Run tests in watch mode
npm run test:watch
```

### Current Test Coverage
- ✅ Timer store state management (`timerStore.test.ts`)
- ✅ Streak counter component (`StreakCounter.test.tsx`)
- ✅ Utility functions (`utils.test.ts`)

**Total:** 237+ lines of unit tests

---

## 🏗️ Project Structure

```
focuswaqt/
├── public/
│   ├── images/          # Background images
│   ├── sounds/          # Ambient audio tracks
│   ├── videos/          # Background video files
│   └── MEDIA_MANIFEST.md
├── src/
│   ├── actions/         # Server actions
│   │   ├── fetchUserStreak.ts
│   │   └── updateStreak.ts
│   ├── app/
│   │   ├── auth/        # Auth routes
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/      # React components
│   │   ├── AuthButton.tsx
│   │   ├── AuthModal.tsx
│   │   ├── BackgroundPickerModal.tsx
│   │   ├── BackgroundVideo.tsx
│   │   ├── ErrorBoundary.tsx
│   │   ├── MusicModal.tsx
│   │   ├── SoundMixer.tsx
│   │   ├── TaskModal.tsx
│   │   ├── Timer.tsx
│   │   └── ...
│   ├── hooks/           # Custom React hooks
│   │   └── useTasks.ts
│   ├── lib/             # Utilities & config
│   │   ├── mediaConstants.ts
│   │   ├── ratelimit.ts
│   │   ├── supabase/
│   │   └── utils.ts
│   ├── stores/          # Zustand stores
│   │   └── timerStore.ts
│   ├── constants.ts     # App-wide constants
│   └── middleware.ts    # Auth middleware
├── .env.example         # Environment template
├── RECENT_CHANGES.md    # Development log
├── README.md
└── package.json
```

---

## 🎨 Key Components

### **Timer** (`Timer.tsx`)
The core Pomodoro timer with play/pause/reset controls. Uses Zustand for state management.

### **BackgroundVideo** (`BackgroundVideo.tsx`)
Full-screen video player with error handling, loading states, and smooth transitions.

### **SoundMixer** (`SoundMixer.tsx` + `SoundMixerModal.tsx`)
Multi-track audio mixer with volume controls and YouTube integration.

### **TaskModal** (`TaskModal.tsx`)
Task management interface with Supabase sync and local storage fallback.

### **AuthButton** (`AuthButton.tsx`)
Authentication UI with profile display and logout dropdown.

---

## 🔒 Security Features

FocusWaqt implements enterprise-grade security:

- ✅ **XSS Protection** - DOMPurify sanitization on all user inputs
- ✅ **Rate Limiting** - IP-based throttling (10 req/min on auth)
- ✅ **OAuth Security** - Redirect validation, secure callbacks
- ✅ **CSP Headers** - Content Security Policy configured
- ✅ **Input Validation** - Length limits on all text inputs
- ✅ **Error Boundaries** - Graceful error handling
- ✅ **Type Safety** - Full TypeScript coverage

---

## 📝 Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm test` | Run unit tests |
| `npm run test:watch` | Run tests in watch mode |

---

## 🚀 Deployment

### Deploy to Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/shariqattarr/fucuswaqt)

1. Click the deploy button above
2. Connect your GitHub repository
3. Add environment variables in Vercel dashboard
4. Deploy! 🎉

### Environment Variables for Production
Make sure to set these in your Vercel project settings:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_APP_URL` (your production domain)

---

## 📚 Documentation

- **[RECENT_CHANGES.md](./RECENT_CHANGES.md)** - Comprehensive changelog and collaboration guide
- **[MEDIA_MANIFEST.md](./public/MEDIA_MANIFEST.md)** - Media assets inventory
- **[.env.example](./.env.example)** - Environment variable reference

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Write tests for new features
- Follow existing code style
- Run `npm run lint` before committing
- Update documentation as needed

---

## 🐛 Known Issues

- Video playback may be slow on first load (caching improves subsequent loads)
- YouTube audio requires user interaction to play (browser autoplay policy)

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---


---

## 📧 Contact

**Shariq Attar**
- GitHub: [@shariqattarr](https://github.com/shariqattarr)
- Email: shariqattar@icloud.com
- Instagram: [@your.velon](https://instagram.com/your.velon)

---

## 🌟 Show Your Support

If you found this project helpful, please give it a ⭐️ on GitHub!

**Built with 🎯 by Shariq Attar**
