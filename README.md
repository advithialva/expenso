# 💰 Expenso

Expenso is a cross-platform expense tracking application built with React Native (Expo) for mobile and Node.js for the backend. 

Track your income and expenses with a beautiful, modern interface featuring gradient designs and intuitive user experience.

---

## 🚀 Features

- ✨ **Modern UI/UX** - Beautiful gradient designs with black and white theme
- 📱 **Cross-platform Mobile App** - Built with React Native and Expo
- 💳 **Transaction Management** - Add, view, and categorize income/expenses
- 📊 **Balance Overview** - Real-time balance calculation with income/expense breakdown
- 🔐 **User Authentication** - Secure sign-in and sign-up functionality
- 🚀 **Real-time Updates** - Instant transaction updates
- 📈 **Visual Indicators** - Color-coded transactions and gradient icons
- ⚡ **Fast Performance** - Optimized with rate limiting and efficient data handling

---
## 🛠️ Tech Stack


| Category | Technology | Purpose |
|----------|------------|---------|
| **Mobile** | React Native + Expo | Cross-platform mobile app |
| | Clerk | User authentication |
| | Expo Linear Gradient | UI gradients |
| | Custom Hooks | State management |
| **Backend** | Node.js + Express | Web server |
| | NeonDB | PostgreSQL database |
| | Upstash Redis | Caching & sessions |
| | Rate Limiting | API protection |

---
## 🏗️ Project Structure

```
expenso/
├── mobile/               
│   ├── app/
│   │   ├── (auth)/        # Authentication screens
│   │   └── (root)/        # Main app screens
│   ├── components/        # Reusable UI components
│   ├── constants/         # App constants and configurations
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Utility functions and helpers
│   └── assets/           # Images, fonts, and styles
├── backend/              # Node.js backend server
│   ├── src/
│   │   ├── controllers/  # Route handlers
│   │   ├── middleware/   # Custom middleware
│   │   ├── routes/       # API routes
│   │   └── config/       # Database and service configs
│   └── server.js         # Main server file
└── package.json          # Root package.json with scripts
```
---

## 🚦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/advithialva/expenso.git
   cd expenso
   ```

2. **Install dependencies**

- Install root dependencies
   ```bash
   npm install
   ```

 - Install mobile dependencies
   ```bash
   cd mobile && npm install
   cd ..
   ```
   
 - Install backend dependencies
   ```bash
   cd backend && npm install
   cd ..
   ```

3. **Set up environment variables**
   
   Create `.env` files in the backend directory:
   ```bash
   DATABASE_URL=postgresql://neondb_owner:your_password@your-host.neon.tech/neondb?sslmode=require
   EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_clerk_publishable_key
   UPSTASH_REDIS_REST_URL=your_upstash_redis_url
   UPSTASH_REDIS_REST_TOKEN=your_upstash_redis_token
   PORT=3000
   ```
   
   Create `.env` file in the mobile directory:
   ```bash
   EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_clerk_publishable_key
   ```

4. **Running the Application**

- Start the Backend Server
```bash
npm run dev
```

- Start the Mobile App
```bash
npx expo
```
---


