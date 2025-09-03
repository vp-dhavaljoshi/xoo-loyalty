# XOO Loyalty - Customer Loyalty Program Management System

A comprehensive customer loyalty program management system built with Laravel 12 and React, designed to help businesses create, manage, and analyze customer loyalty programs with ease.

## 🚀 Features

### Core Functionality

-   **Customer Management**: Comprehensive customer database with segmentation and analytics
-   **Loyalty Rules Engine**: Flexible rule creation for points earning and redemption
-   **Campaign Management**: Create and manage marketing campaigns and promotions
-   **Rewards Catalog**: Manage reward offerings and redemption options
-   **Advanced Reporting**: Detailed analytics and insights across multiple dimensions
-   **Real-time Dashboard**: Live monitoring of program performance and KPIs

### Reporting & Analytics

-   **Participation Reports**: Track customer engagement and program adoption
-   **Points Analytics**: Monitor points issuance, redemption, and balance trends
-   **Redemption Reports**: Analyze reward redemption patterns and preferences
-   **Membership Analytics**: Track membership growth and retention metrics
-   **Customer Segmentation**: Advanced customer segmentation and targeting
-   **ROI Analysis**: Measure program return on investment
-   **Growth Metrics**: Track program growth and expansion metrics

## 🛠️ Tech Stack

### Backend

-   **Laravel 12**: Modern PHP framework with latest features
-   **PHP 8.2+**: Latest PHP version with enhanced performance
-   **MySQL**: Robust database for data persistence
-   **Laravel Sanctum**: API authentication and security
-   **Laravel Breeze**: Authentication scaffolding
-   **Inertia.js**: Modern SPA-like experience without API complexity

### Frontend

-   **React 18**: Modern React with hooks and concurrent features
-   **TypeScript**: Type-safe development with enhanced IDE support
-   **Tailwind CSS**: Utility-first CSS framework for rapid UI development
-   **Radix UI**: Accessible, unstyled UI components
-   **shadcn/ui**: Beautiful, customizable component library
-   **Lucide React**: Modern icon library
-   **React Hook Form**: Performant forms with easy validation
-   **Zod**: TypeScript-first schema validation

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

-   **PHP 8.2 or higher**
-   **Composer** (PHP dependency manager)
-   **Node.js 18+** and **npm**
-   **MySQL 8.0+** or **SQLite**
-   **Git**

## 🚀 Installation

1. **Clone the repository**

    ```bash
    git clone https://github.com/your-username/xoo-loyalty.git
    cd xoo-loyalty
    ```

2. **Install PHP dependencies**

    ```bash
    composer install
    ```

3. **Install Node.js dependencies**

    ```bash
    npm install
    ```

4. **Environment setup**

    ```bash
    cp .env.example .env
    php artisan key:generate
    ```

5. **Run database migrations**

    ```bash
    php artisan migrate
    ```

6. **Build frontend assets**
    ```bash
    npm run build
    ```

## 🏃‍♂️ Development

### Start Development Server

```bash
# Start all development services (Laravel, Vite, Queue, Logs)
composer run dev

# Or start individually:
php artisan serve          # Laravel server (http://localhost:8000)
npm run dev               # Vite dev server with HMR
php artisan queue:listen  # Queue worker
php artisan pail          # Log viewer
```

### Available Scripts

```bash
# Frontend
npm run dev      # Start Vite development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint

# Backend
php artisan serve                    # Start Laravel server
php artisan migrate                  # Run database migrations
php artisan test                     # Run PHP tests
composer run test                    # Run tests with config clear
php artisan queue:work               # Process queued jobs
php artisan pail                     # View application logs
```

## 🔧 Configuration

### Environment Variables

Key environment variables to configure:

```env
APP_NAME="XOO Loyalty"
APP_ENV=local
APP_DEBUG=true
APP_URL=http://localhost:8000

DB_CONNECTION=sqlite
# DB_CONNECTION=mysql
# DB_HOST=127.0.0.1
# DB_PORT=3306
# DB_DATABASE=xoo_loyalty
# DB_USERNAME=root
# DB_PASSWORD=

QUEUE_CONNECTION=database
```

## 🚀 Deployment

### Production Build

```bash
# Install production dependencies
composer install --optimize-autoloader --no-dev

# Build frontend assets
npm ci
npm run build

# Optimize Laravel
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

### Server Requirements

-   PHP 8.2+
-   MySQL 8.0+ or PostgreSQL
-   Nginx or Apache
-   SSL certificate (recommended)
-   Supervisor (for queue workers)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Standards

-   Follow PSR-12 coding standards
-   Use TypeScript for frontend code
-   Write tests for new features
-   Update documentation as needed

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
