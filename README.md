# Pollify - Modern Polling Application

A Next.js 15 application for creating, sharing, and participating in polls. Built with TypeScript, Tailwind CSS, and Shadcn UI components.

## 🚀 Features

- **User Authentication**: Login and registration system
- **Poll Creation**: Create polls with multiple options, descriptions, and settings
- **Poll Voting**: Participate in polls with real-time results
- **Dashboard**: View your polls and track engagement
- **Responsive Design**: Works seamlessly on all devices
- **Modern UI**: Beautiful interface built with Shadcn components

## 🏗️ Project Structure

```
alx-polly/
├── app/                          # Next.js app directory
│   ├── (auth)/                  # Authentication route group
│   │   ├── login/               # Login page
│   │   └── register/            # Registration page
│   ├── (dashboard)/             # Dashboard route group
│   │   └── dashboard/           # User dashboard
│   ├── polls/                   # Polls section
│   │   ├── create/              # Create poll page
│   │   ├── [id]/                # Individual poll view
│   │   └── page.tsx             # Polls listing
│   ├── api/                     # API routes
│   │   ├── auth/                # Authentication endpoints
│   │   └── polls/               # Poll management endpoints
│   ├── globals.css              # Global styles
│   ├── layout.tsx               # Root layout
│   └── page.tsx                 # Home page
├── components/                   # Reusable components
│   ├── ui/                      # Shadcn UI components
│   │   ├── button.tsx           # Button component
│   │   ├── card.tsx             # Card components
│   │   ├── input.tsx            # Input component
│   │   └── label.tsx            # Label component
│   ├── forms/                   # Form components
│   │   ├── login-form.tsx       # Login form
│   │   ├── register-form.tsx    # Registration form
│   │   └── create-poll-form.tsx # Poll creation form
│   ├── polls/                   # Poll-specific components
│   │   └── poll-card.tsx        # Poll display card
│   └── navigation.tsx           # Main navigation
├── lib/                         # Utility functions
│   └── utils.ts                 # Common utilities
├── types/                       # TypeScript type definitions
│   └── index.ts                 # App types and interfaces
├── package.json                 # Dependencies and scripts
└── README.md                    # Project documentation
```

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn UI + Radix UI
- **Icons**: Lucide React
- **State Management**: React hooks (useState, useEffect)
- **Routing**: Next.js built-in routing

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd alx-polly
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📱 Available Routes

- `/` - Home page with app overview
- `/login` - User login
- `/register` - User registration
- `/polls` - Browse all polls
- `/polls/create` - Create a new poll
- `/polls/[id]` - View and vote on a specific poll
- `/dashboard` - User dashboard with polls and stats

## 🔧 Development

### Adding New Features

1. **New Pages**: Add route files in the `app/` directory
2. **New Components**: Create components in the appropriate `components/` subdirectory
3. **New Types**: Extend the types in `types/index.ts`
4. **New API Routes**: Add endpoints in `app/api/`

### Component Guidelines

- Use Shadcn UI components for consistency
- Follow the established naming conventions
- Include proper TypeScript types
- Make components responsive by default

### Styling

- Use Tailwind CSS utility classes
- Follow the established color scheme
- Ensure mobile-first responsive design
- Use the `cn()` utility for conditional classes

## 🎯 Upcoming Features

- [ ] Real-time poll updates with WebSockets
- [ ] Advanced analytics and charts
- [ ] Poll categories and tags
- [ ] User profiles and avatars
- [ ] Poll sharing on social media
- [ ] Email notifications
- [ ] Poll templates
- [ ] Advanced voting options (ranked choice, etc.)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments


## 🤖 AI Usage

This project leveraged a suite of AI tools throughout the development process:

- **GitHub Copilot**: Used for scaffolding API routes, React components, and TypeScript types; accelerated boilerplate generation and repetitive code tasks; assisted with error handling, Supabase integration, and UI logic.
- **Cursor & Zed**: Provided smart code navigation, refactoring, and inline AI chat for clarifying requirements and debugging issues.
- **Coderabbit**: Offered conversational assistance and code reviews to improve reliability.
- **Google Gemini**: Enabled advanced code generation and documentation drafting, with generous free API keys for experimentation and integration.

All AI-generated code and suggestions were reviewed and iterated for correctness, security, and maintainability.
