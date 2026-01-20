import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  app.get(api.profile.get.path, async (_req, res) => {
    const profile = await storage.getProfile();
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }
    res.json(profile);
  });

  // Seed data function
  await seedDatabase();

  return httpServer;
}

async function seedDatabase() {
  const existingProfile = await storage.getProfile();
  if (existingProfile) return;

  console.log("Seeding database with initial profile...");
  
  await storage.createProfile({
    username: "E F T I",
    bio: "I Spend Every Single Moment on Work",
    status: "online",
    pronouns: "",
    banner: "/assets/album-cover.jpg", // Using existing asset as banner for now
    avatar: {
      src: "/assets/album-cover.jpg",
      alt: "Profile Avatar",
      useDiscord: true
    },
    discord: {
      userId: "203320334923857921",
      showStatus: true,
      showActivity: true,
      showDecoration: true,
      serverId: "1068491603351715890" // Updated with new guild ID
    },
    spotify: {
      enabled: true,
      embedUrl: "https://open.spotify.com/playlist/7tiPEUSHxjSiJ2C5H5UFEn?si=769b1d2c4bb84315",
      height: 100,
      compact: true,
      showInDiscordStatus: true
    },
    background: {
      src: "/assets/background.mp4",
      videoOpacity: 50,
      videoBlur: 0
    },
    audio: {
      src: "/assets/audio.mp3",
      autoplay: true,
      loop: true,
      defaultVolume: 1
    },
    cursor: {
      enabled: true,
      style: "ring",
      emoji: "✨",
      primaryColor: "hsl(190, 100%, 50%)",
      secondaryColor: "hsl(280, 100%, 60%)"
    },
    socialLinks: [
      { platform: "discord", url: "https://discord.gg/banters" },
      { platform: "instagram", url: "https://instagram.com/e4fti_" },
      { platform: "github", url: "https://github.com/e4fti" },
      { platform: "spotify", url: "https://spotify.com" },
      { platform: "twitch", url: "https://twitch.tv" },
      { platform: "twitter", url: "https://twitter.com/e4fti" },
      { platform: "email", url: "mailto:hello@example.com" }
    ],
    customLinks: [
      { 
        title: "Spotify", 
        description: "Check out my playlists", 
        url: "https://open.spotify.com/user/31fex6rwh6jnag72hbtufu2odwfm?si=82b77bb842d946b5",
        icon: "music"
      }
    ],
    badges: [
      { icon: "https://img.icons8.com/ios-filled/50/ffffff/star--v1.png", label: "Special" }
    ],
    theme: {
      glowCyan: "190 100% 50%",
      glowPurple: "280 100% 60%",
      glowPink: "330 100% 60%"
    },
    effects: {
      tiltEnabled: true,
      tiltMaxAngle: 8,
      noiseEnabled: true,
      showViews: true,
      viewCount: 7
    },
    footer: {
      text: "Made with",
      heart: true,
      brandName: "ProfileLink",
      brandUrl: "#"
    }
  });
  
  console.log("Database seeded!");
}
