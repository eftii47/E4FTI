import { db } from "./db";
import { profiles, type Profile, type InsertProfile } from "@shared/schema";
import { eq } from "drizzle-orm";

export interface IStorage {
  getProfile(): Promise<Profile | undefined>;
  createProfile(profile: InsertProfile): Promise<Profile>;
  updateProfile(profile: Partial<InsertProfile>): Promise<Profile>;
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

  async updateProfile(updateData: Partial<InsertProfile>): Promise<Profile> {
    // Get the first profile and update it
    const existingProfile = await this.getProfile();
    if (!existingProfile) {
      // If no profile exists, create one
      return this.createProfile(updateData as InsertProfile);
    }
    
    console.log("Updating profile ID:", existingProfile.id, "with data:", updateData);
    const [updatedProfile] = await db
      .update(profiles)
      .set(updateData)
      .where(eq(profiles.id, existingProfile.id))
      .returning();
    
    console.log("Updated profile:", updatedProfile);
    return updatedProfile;
  }
}

export const storage = new DatabaseStorage();
