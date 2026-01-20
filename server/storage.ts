import { db } from "./db";
import { profiles, type Profile, type InsertProfile } from "@shared/schema";
import { eq } from "drizzle-orm";

export interface IStorage {
  getProfile(): Promise<Profile | undefined>;
  createProfile(profile: InsertProfile): Promise<Profile>;
}

export class DatabaseStorage implements IStorage {
  async getProfile(): Promise<Profile | undefined> {
    // Return the first profile (assuming single user app for now)
    const [profile] = await db.select().from(profiles).limit(1);
    return profile;
  }

  async createProfile(insertProfile: InsertProfile): Promise<Profile> {
    const [profile] = await db.insert(profiles).values(insertProfile).returning();
    return profile;
  }
}

export const storage = new DatabaseStorage();
