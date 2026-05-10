# DBBack Frontend - Architecture Guide

## 🏗️ Project Structure & SOLID Principles

### Folder Organization
```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home/Landing page
│   └── (auth)/            # Auth routes group
│       ├── login/page.tsx
│       └── register/page.tsx
│
├── (dashboard)/           # Protected routes group
│   ├── layout.tsx         # Dashboard layout
│   ├── page.tsx           # Dashboard home
│   ├── backups/           # Backups section
│   ├── schedules/         # Schedules section
│   └── settings/          # Settings section
│
├── lib/                   # Core utilities
│   ├── api/              # API client (SRP)
│   │   ├── client.ts
│   │   ├── endpoints.ts
│   │   └── interceptors.ts
│   ├── auth/             # Auth utilities
│   ├── validators/       # Zod schemas (SRP)
│   └── utils/            # Helper functions
│
├── hooks/                 # Custom hooks (SRP)
│   ├── useAuth.ts
│   ├── useApi.ts
│   └── useFetch.ts
│
├── store/                 # Zustand stores (SRP)
│   ├── authStore.ts      # Auth state
│   ├── backupStore.ts    # Backup state
│   └── uiStore.ts        # UI state
│
├── components/            # Reusable components (SRP)
│   ├── common/           # Shared UI components
│   ├── auth/             # Auth specific
│   ├── dashboard/        # Dashboard specific
│   └── forms/            # Form components
│
├── types/                 # TypeScript types
│   ├── auth.ts
│   ├── backup.ts
│   └── api.ts
│
└── middleware.ts          # Auth middleware
```

## 🎯 SOLID Principles Implementation

### 1. **Single Responsibility Principle (SRP)**
- **API Client**: Only handles HTTP requests
- **Validators**: Only validates data (Zod schemas)
- **Stores**: Each store manages one domain (auth, backups, ui)
- **Hooks**: Each hook does one thing (useAuth, useApi, useFetch)
- **Components**: Each component has one responsibility

Example:
```typescript
// ❌ BAD - Multiple responsibilities
function UserComponent() {
  // Fetches data, validates, handles auth, renders UI
}

// ✅ GOOD - Single responsibility
function UserCard({ userId }: { userId: string }) {
  // Only renders user info
  const { user } = useUser(userId);
  return <div>{user.name}</div>;
}
```

### 2. **Open/Closed Principle (OCP)**
- Components are **open for extension, closed for modification**
- Use composition over inheritance
- Props-based customization

Example:
```typescript
// ✅ GOOD - Extensible without modification
interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
}

function Button({ variant = 'primary', size = 'md', ...props }: ButtonProps) {
  return <button className={cn(styles[variant], styles[size])} {...props} />;
}
```

### 3. **Liskov Substitution Principle (LSP)**
- Child types can replace parent types
- Consistent interfaces across similar components

### 4. **Interface Segregation Principle (ISP)**
- Don't create "god" interfaces
- Break into smaller, focused interfaces

Example:
```typescript
// ❌ BAD - God interface
interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  salt: string;
  backupConfigs: BackupConfig[];
  schedules: Schedule[];
  apiKeys: ApiKey[];
}

// ✅ GOOD - Segregated interfaces
interface UserProfile {
  id: string;
  name: string;
  email: string;
}

interface AuthUser extends UserProfile {
  token: string;
  expiresAt: number;
}
```

### 5. **Dependency Inversion Principle (DIP)**
- Depend on abstractions, not concrete implementations
- Use custom hooks for dependencies

Example:
```typescript
// ✅ GOOD - Abstraction
interface IAuthService {
  login(email: string, password: string): Promise<AuthUser>;
  logout(): Promise<void>;
  refresh(): Promise<void>;
}

// Inject through context/hook
const useAuth = (): IAuthService => useContext(AuthContext);
```

## 🔐 Authentication Flow

```
Login Page
    ↓
Form Submission (Zod validation)
    ↓
API Client (Axios) → Backend
    ↓
Store JWT token (Zustand + localStorage)
    ↓
Middleware: Check auth status
    ↓
Protected Routes (Dashboard)
```

## 🔄 Data Flow Architecture

```
Component
    ↓
Custom Hook (useApi, useAuth)
    ↓
Zustand Store (State management)
    ↓
API Client (Axios)
    ↓
Backend API
```

## 🚀 Best Practices

### Type Safety
- Use TypeScript for all files
- Define interfaces for API responses
- Use Zod for runtime validation

### Error Handling
- Centralized error handling in API client
- Custom error types
- User-friendly error messages

### Performance
- Code splitting (automatic with Next.js)
- Image optimization
- Lazy loading components

### Security
- HTTP-only cookies for tokens (prefer over localStorage)
- CSRF protection
- Environment variables for secrets

### Testing
- Unit tests for utilities
- Integration tests for API calls
- Component tests for UI

## 📚 Learning Path

1. **Week 1**: Authentication & Routing
   - Login/Register pages
   - Protected routes with middleware
   - Token management

2. **Week 2**: Dashboard Structure
   - Layout system
   - Data fetching patterns
   - State management

3. **Week 3**: Backup Management
   - Backup listing
   - CRUD operations
   - Real-time updates

4. **Week 4**: Advanced Features
   - Schedule management
   - Settings & preferences
   - Error handling & notifications
