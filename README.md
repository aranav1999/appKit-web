# Solana  App Kit

Build Solana Apps in Minutes 
From Trading to Social to AI to Launchpads to Wallets 

## Getting Started

First, set up your environment variables:

1. Follow the detailed instructions in [src/ENV_SETUP.md](src/ENV_SETUP.md) to set up your environment variables.

2. Generate the database migrations:
```bash
npm run db:generate
```

3. Apply the migrations to your database:
```bash
npm run db:migrate
```

4. (Optional) Seed your database with sample data:
```bash
npm run db:seed
```

5. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Backend Architecture

This project uses:

- **Drizzle ORM** for database operations
- **Supabase Storage** for image uploads
- **PostgreSQL** as the database

### Project Structure

```
src/
  ├── lib/
  │   ├── db/
  │   │   ├── drizzle/        # Database migrations
  │   │   ├── schema.ts       # Database schema definitions
  │   │   ├── index.ts        # Database connection
  │   │   ├── migrate.ts      # Migration utility
  │   │   └── seed.ts         # Database seeding utility
  │   └── supabase/
  │       └── index.ts        # Supabase storage utilities
  └── app/
      ├── api/                # API routes
      │   ├── apps/           # App-related endpoints
      │   ├── categories/     # Category-related endpoints
      │   └── screenshots/    # Screenshot-related endpoints
      └── ...                 # Frontend pages
```

### Database Schema

The main entities in the database are:
- **Apps**: Main app listings
- **Screenshots**: App screenshots
- **Categories**: App categories

### API Routes

The following API routes are available:

- `GET /api/apps` - Get all apps
- `POST /api/apps` - Create a new app
- `GET /api/apps/:id` - Get a specific app
- `PATCH /api/apps/:id` - Update an app
- `DELETE /api/apps/:id` - Delete an app

- `POST /api/screenshots` - Add a screenshot
- `PATCH /api/screenshots/:id` - Update a screenshot
- `DELETE /api/screenshots/:id` - Delete a screenshot

- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create a new category
- `GET /api/categories/:id` - Get a specific category
- `PATCH /api/categories/:id` - Update a category
- `DELETE /api/categories/:id` - Delete a category

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
- [Drizzle ORM Documentation](https://orm.drizzle.team/docs/overview) - learn about Drizzle ORM.
- [Supabase Storage Documentation](https://supabase.com/docs/guides/storage) - learn about Supabase Storage.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
