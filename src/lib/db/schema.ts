import { pgTable, serial, text, timestamp, varchar, integer, boolean, numeric } from 'drizzle-orm/pg-core';

// App table
export const apps = pgTable('apps', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  description: text('description'),
  iconUrl: text('icon_url'),
  category: varchar('category', { length: 50 }),
  price: varchar('price', { length: 20 }),
  developer: varchar('developer', { length: 100 }),
  rating: numeric('rating', { precision: 3, scale: 1 }),
  downloads: varchar('downloads', { length: 20 }),
  websiteUrl: text('website_url'),
  androidUrl: text('android_url'),
  iosUrl: text('ios_url'),
  solanaMobileUrl: text('solana_mobile_url'),
  projectTwitter: text('project_twitter'),
  submitterTwitter: text('submitter_twitter'),
  contractAddress: text('contract_address'),
  featureBannerUrl: text('feature_banner_url'),
  tags: text('tags').array(),
  isShown: boolean('is_shown').default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// App screenshots table
export const screenshots = pgTable('screenshots', {
  id: serial('id').primaryKey(),
  appId: integer('app_id').references(() => apps.id).notNull(),
  imageUrl: text('image_url').notNull(),
  sortOrder: integer('sort_order').default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Categories table
export const categories = pgTable('categories', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 50 }).notNull().unique(),
  description: text('description'),
  iconUrl: text('icon_url'),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Click counter table
export const clickCounter = pgTable('click_counter', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 50 }).notNull().unique(),
  count: integer('count').default(0).notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Waitlist table for SuperApp
export const waitlist = pgTable('waitlist', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  signupDate: timestamp('signup_date').defaultNow().notNull(),
  isNotified: boolean('is_notified').default(false),
  notificationDate: timestamp('notification_date'),
  source: varchar('source', { length: 100 }),
  notes: text('notes'),
});

// Export all tables for use in the app
export type App = typeof apps.$inferSelect;
export type NewApp = typeof apps.$inferInsert;

export type Screenshot = typeof screenshots.$inferSelect;
export type NewScreenshot = typeof screenshots.$inferInsert;

export type Category = typeof categories.$inferSelect;
export type NewCategory = typeof categories.$inferInsert;

export type ClickCounter = typeof clickCounter.$inferSelect;
export type NewClickCounter = typeof clickCounter.$inferInsert;

export type Waitlist = typeof waitlist.$inferSelect;
export type NewWaitlist = typeof waitlist.$inferInsert; 