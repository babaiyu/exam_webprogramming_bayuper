# Exam Web Programming

This project is created using `Laravel 10` and `Inertiajs/react`

## Requirements

-   NodeJS v.18 (LTS)
-   Composer
-   PHP 8+

## Available Credentials

You can using below credentials for authentication:

```
email: superadmin@admin.com
password: superadmin1234
```

```
email: admin@admin.com
password: admin1234
```

## Getting Started

-   Clone this project
-   Run installation for backend

```bash
composer install
```

-   Create `sqlite` database

```bash
touch database/database.sqlite
```

-   Generate `.env` file

```bash
cp .env.example .env
```

-   Generate `key` and `jwt-key`

```bash
php artisan key:generate && php artisan jwt:secret
```

-   Run database migration

```bash
php artisan migrate:fresh --seed
```

-   Run installation for frontend

```bash
npm install
```

-   (optional) Run generate bundle or run development for frontend

```bash
npm run build
```

-   If you already build frontend bundle, this step is unnecessary

```bash
npm run dev
```

-   Open new tab terminal or new window terminal, then run the server for backend and frontend

```bash
php artisan serve
```

-   Finally, open [link here](http://localhost:8000)
