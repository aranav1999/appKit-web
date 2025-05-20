import { db, schema } from "./index";
import * as dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

const seedDatabase = async () => {
  try {
    console.log("🌱 Seeding database...");

    // Delete existing categories
    console.log("Deleting existing categories...");
    await db.delete(schema.categories);

    // Insert categories
    const categories = await db
      .insert(schema.categories)
      .values([
        {
          name: "AI",
          description: "Artificial Intelligence applications",
          iconUrl: "https://placehold.co/200x200?text=AI",
          isActive: true,
        },
        {
          name: "Launchpad",
          description: "Launchpad and fundraising applications",
          iconUrl: "https://placehold.co/200x200?text=Launchpad",
          isActive: true,
        },
        {
          name: "Trading",
          description: "Trading and exchange applications",
          iconUrl: "https://placehold.co/200x200?text=Trading",
          isActive: true,
        },
        {
          name: "Wallets",
          description: "Wallet and asset management applications",
          iconUrl: "https://placehold.co/200x200?text=Wallets",
          isActive: true,
        },
        {
          name: "Social",
          description: "Social networking applications",
          iconUrl: "https://placehold.co/200x200?text=Social",
          isActive: true,
        },
        {
          name: "Other",
          description: "Miscellaneous applications",
          iconUrl: "https://placehold.co/200x200?text=Other",
          isActive: true,
        },
      ])
      .returning();

    console.log(`✅ Inserted ${categories.length} categories`);

    // Delete existing apps
    console.log("Deleting existing apps...");
    await db.delete(schema.apps);

    // Insert apps
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  } finally {
    process.exit(0);
  }
};
// Run the seeding function
seedDatabase();
