import { db, schema } from './index';
import * as dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const seedDatabase = async () => {
  try {
    console.log('🌱 Seeding database...');

    // Delete existing categories
    console.log('Deleting existing categories...');
    await db.delete(schema.categories);

    // Insert categories
    const categories = await db.insert(schema.categories).values([
      {
        name: 'AI',
        description: 'Artificial Intelligence applications',
        iconUrl: 'https://placehold.co/200x200?text=AI',
        isActive: true,
      },
      {
        name: 'Launchpad',
        description: 'Launchpad and fundraising applications',
        iconUrl: 'https://placehold.co/200x200?text=Launchpad',
        isActive: true,
      },
      {
        name: 'Trading',
        description: 'Trading and exchange applications',
        iconUrl: 'https://placehold.co/200x200?text=Trading',
        isActive: true,
      },
      {
        name: 'Wallets',
        description: 'Wallet and asset management applications',
        iconUrl: 'https://placehold.co/200x200?text=Wallets',
        isActive: true,
      },
      {
        name: 'Social',
        description: 'Social networking applications',
        iconUrl: 'https://placehold.co/200x200?text=Social',
        isActive: true,
      },
      {
        name: 'Other',
        description: 'Miscellaneous applications',
        iconUrl: 'https://placehold.co/200x200?text=Other',
        isActive: true,
      },
    ]).returning();

    console.log(`✅ Inserted ${categories.length} categories`);

    // Insert apps
    const apps = await db.insert(schema.apps).values([
      {
        name: 'TaskMaster',
        description: 'The ultimate task management app with powerful features for organizing your work and personal life.',
        iconUrl: 'https://placehold.co/512x512?text=TM',
        category: 'AI',
        price: 'Free',
        developer: 'TaskMaster Inc.',
        rating: 4.5,
        downloads: '1M+',
      },
      {
        name: 'BlockPuzzle',
        description: 'Addictive puzzle game that challenges your spatial reasoning skills.',
        iconUrl: 'https://placehold.co/512x512?text=BP',
        category: 'Other',
        price: '$1.99',
        developer: 'Fun Games Studio',
        rating: 4.8,
        downloads: '5M+',
      },
      {
        name: 'FriendZone',
        description: 'Connect with friends and share your life moments in this safe social network.',
        iconUrl: 'https://placehold.co/512x512?text=FZ',
        category: 'Social',
        price: 'Free',
        developer: 'Social Networks Ltd.',
        rating: 4.2,
        downloads: '50M+',
      },
      {
        name: 'MathGenius',
        description: 'Learn mathematics in a fun and interactive way with adaptive learning technology.',
        iconUrl: 'https://placehold.co/512x512?text=MG',
        category: 'AI',
        price: '$4.99',
        developer: 'EduTech Solutions',
        rating: 4.7,
        downloads: '500K+',
      },
    ]).returning();

    console.log(`✅ Inserted ${apps.length} apps`);

    // Insert screenshots for each app
    for (const app of apps) {
      const screenshotsToAdd = [];
      
      // Add 3 screenshots for each app
      for (let i = 1; i <= 3; i++) {
        screenshotsToAdd.push({
          appId: app.id,
          imageUrl: `https://placehold.co/1242x2688?text=${app.name}-Screenshot-${i}`,
          sortOrder: i - 1,
        });
      }
      
      const screenshots = await db.insert(schema.screenshots)
        .values(screenshotsToAdd)
        .returning();
        
      console.log(`✅ Inserted ${screenshots.length} screenshots for ${app.name}`);
    }

    console.log('✅ Database seeding completed successfully');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  } finally {
    process.exit(0);
  }
};

// Run the seeding function
seedDatabase(); 