# DoIt4Jesus 🙏

A modern web application helping Catholics pray the rosary, track their prayer journey, and connect with a faith-based community.

## 🌟 Features

- **Interactive Rosary Prayer** - Audio-guided rosary with beautiful visuals
- **Prayer Tracking** - Track your daily rosary streaks and statistics
- **Social Features** - Connect with friends, join prayer groups, and pray together
- **Live Events** - Participate in live rosary prayer sessions
- **Multi-language Support** - Available in English and Spanish
- **Responsive Design** - Works seamlessly on desktop and mobile devices

## 🛠 Tech Stack

- **Framework:** [Next.js 15](https://nextjs.org/) (React 18)
- **Language:** TypeScript
- **UI Library:** [Material-UI (MUI) v5](https://mui.com/)
- **Styling:** SASS/SCSS + Emotion
- **Database:** [Supabase](https://supabase.com/) (PostgreSQL)
- **Authentication:** Supabase Auth + Google OAuth
- **Deployment:** [Vercel](https://vercel.com/)
- **Analytics:** Vercel Analytics + Speed Insights

## 📦 Project Structure

```
doit4jesus-app/
├── classes/           # Core classes (Rosary, SupabaseDB, YouTube)
├── components/        # React components (70+ components)
├── constants/         # App constants and configuration
├── context/           # React Context providers
├── data/             # Static data and content
├── interfaces/        # TypeScript interfaces and types
├── locales/          # i18n translations (EN/ES)
├── pages/            # Next.js pages and routing
│   ├── app/          # Protected app pages (dashboard, events, etc.)
│   └── ...           # Public pages (landing, login, etc.)
├── public/           # Static assets
├── services/         # API service functions
├── styles/           # Global styles and SASS variables
├── utils/            # Utility functions and helpers
└── __test__/         # Test files

```

## 🚀 Getting Started

### Prerequisites

- Node.js >= 16.16.0
- npm >= 8.11.0
- Docker Desktop (for local database)
- Supabase CLI (optional, for local development)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/samsoftwaredev/doit4jesus-app.git
   cd doit4jesus-app
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env.local` file in the root directory:

   ```env
   NEXT_PUBLIC_SUPABASE_PROJECT_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_PROJECT_KEY=your_supabase_anon_key
   NEXT_PUBLIC_GOOGLE_AUTH_KEY=your_google_oauth_client_id
   ```

4. **Run the development server**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🗄️ Database Setup

### Using Supabase Cloud

1. Create a project at [supabase.com](https://supabase.com)
2. Copy your project URL and anon key to `.env.local`
3. Run migrations (if available) or set up tables manually

### Running Database Locally

1. **Install Docker Desktop** and **Supabase CLI**

2. **Start local Supabase instance**

   ```bash
   supabase start --ignore-health-check
   ```

   > **Note:** The `--ignore-health-check` flag is required for local development. See [Supabase docs](https://supabase.com/docs/reference/cli/supabase-start) for details.

3. **Generate TypeScript types from database schema**

   ```bash
   npm run db-ts
   ```

   This generates type definitions in:
   - `interfaces/database.ts` (for frontend)
   - `supabase/functions/*/types.ts` (for edge functions)

## 🧪 Testing

Run all tests:

```bash
npm test
```

Watch mode for development:

```bash
npm run test:watch
```

Generate coverage report:

```bash
npm run test-coverage
```

## 📝 Development Workflow

### Branch Naming Conventions

Before creating a pull request, create a branch following these conventions:

- **Features:** `feature/feature-name` (e.g., `feature/login-system`)
- **Bug Fixes:** `fix/bug-description` (e.g., `fix/header-styling`)
- **Hotfixes:** `hotfix/critical-issue` (e.g., `hotfix/security-patch`)
- **Releases:** `release/version` (e.g., `release/v1.0.1`)
- **Documentation:** `docs/topic` (e.g., `docs/api-endpoints`)

### Pre-commit Hooks

This project uses Husky for pre-commit hooks:

- **Linting:** ESLint auto-fixes code style issues
- **Formatting:** Prettier formats code
- **Testing:** Runs tests on staged files

### Code Quality

```bash
# Lint and fix code
npm run lint

# Format code with Prettier
npm run lint-stage

# Type check
npm run compile
```

## 🚢 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy!

Vercel will automatically deploy on every push to `main`.

### Manual Build

```bash
# Build for production
npm run build

# Start production server
npm start

# Export static site (if applicable)
npm run export
```

## 📜 Available Scripts

| Command                 | Description                             |
| ----------------------- | --------------------------------------- |
| `npm run dev`           | Start development server                |
| `npm run build`         | Build for production                    |
| `npm start`             | Start production server                 |
| `npm run lint`          | Lint and fix code                       |
| `npm test`              | Run tests once                          |
| `npm run test:watch`    | Run tests in watch mode                 |
| `npm run test-coverage` | Generate coverage report                |
| `npm run db-ts`         | Generate TypeScript types from database |
| `npm run export`        | Export static site                      |

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`feature/amazing-feature`)
3. Commit your changes
4. Push to your branch
5. Open a Pull Request

Please ensure:

- Code passes all tests
- Code follows ESLint and Prettier rules
- Commit messages are clear and descriptive

## 🙏 Acknowledgments

- Built with faith and dedication
- Inspired by the Catholic tradition of praying the rosary
- Thanks to all contributors and users

---

**Made with ❤️ and prayers**
