// Loads profile data from .env and returns a profile object
import { config } from "dotenv";
config();

export function getEnvProfile() {
  return {
    username: process.env.VITE_USERNAME || "User",
    bio: process.env.VITE_BIO || "",
    status: process.env.VITE_STATUS || "online",
    pronouns: process.env.VITE_PRONOUNS || "",
    banner: process.env.VITE_BANNER_IMAGE || "/assets/profilebanner.jpg",
    avatar: {
      src: process.env.VITE_AVATAR_IMAGE || "/assets/album-cover.jpg",
      alt: "Profile Avatar",
      useDiscord: true
    },
    viewImage: process.env.VITE_VIEW_IMAGE || "",
    viewMedia: process.env.VITE_VIEW_MEDIA || "",
    discord: {
      userId: process.env.VITE_DC_PROFILE_UID || "",
      showStatus: true,
      showActivity: true,
      showDecoration: true,
      serverId: process.env.VITE_DISCORD_SERVER_ID || "",
      serverIcon: process.env.VITE_DISCORD_SERVER_ICON || "/assets/servericon.jpg",
      serverName: process.env.VITE_DISCORD_SERVER_NAME || ""
    },
    spotify: {
      enabled: true,
      embedUrl: process.env.VITE_SPOTIFY_PLAYLIST || "",
      height: 100,
      compact: true,
      showInDiscordStatus: true
    },
    background: {
      src: process.env.VITE_BACKGROUND_VIDEO || "/assets/background.mp4",
      videoOpacity: 50,
      videoBlur: 0
    },
    audio: {
      src: process.env.VITE_AUDIO_SRC || "/assets/audio.mp3",
      autoplay: true,
      loop: true,
      defaultVolume: 1
    },
    cursor: {
      enabled: true,
      style: "dot",
      emoji: "✨",
      primaryColor: "180 100% 50%",
      secondaryColor: "300 100% 50%"
    },
    socialLinks: [
      { platform: "facebook", url: process.env.VITE_FACEBOOK_LINK || "" },
      { platform: "twitter", url: process.env.VITE_TWITTER_LINK || "" },
      { platform: "instagram", url: process.env.VITE_INSTAGRAM_LINK || "" },
      { platform: "youtube", url: process.env.VITE_YOUTUBE_LINK || "" },
      { platform: "github", url: process.env.VITE_GITHUB_LINK || "" },
      { platform: "linkedin", url: process.env.VITE_LINKEDIN_LINK || "" },
      { platform: "email", url: process.env.VITE_EMAIL_LINK || "" },
      { platform: "website", url: process.env.VITE_WEBSITE_LINK || "" }
    ],
    customLinks: [],
    badges: (() => { try { return JSON.parse(process.env.VITE_BADGES || "[]"); } catch { return []; } })(),
    theme: {
      glowCyan: process.env.VITE_THEME_GLOW_CYAN || "180 100% 50%",
      glowPurple: process.env.VITE_THEME_GLOW_PURPLE || "270 100% 60%",
      glowPink: process.env.VITE_THEME_GLOW_PINK || "320 100% 60%"
    },
    effects: {
      tiltEnabled: process.env.VITE_EFFECTS_TILT_ENABLED === undefined ? true : process.env.VITE_EFFECTS_TILT_ENABLED === 'true',
      tiltMaxAngle: process.env.VITE_EFFECTS_TILT_MAX_ANGLE !== undefined ? Number(process.env.VITE_EFFECTS_TILT_MAX_ANGLE) : 20,
      noiseEnabled: process.env.VITE_EFFECTS_NOISE_ENABLED === undefined ? false : process.env.VITE_EFFECTS_NOISE_ENABLED === 'true',
      showViews: process.env.VITE_EFFECTS_SHOW_VIEWS === undefined ? true : process.env.VITE_EFFECTS_SHOW_VIEWS === 'true',
      viewCount: Number(process.env.VITE_VIEW_COUNT) || 0
    },
    footer: {
      text: process.env.VITE_FOOTER_TEXT || "Made with ❤️ by Efti",
      heart: process.env.VITE_FOOTER_HEART === undefined ? true : process.env.VITE_FOOTER_HEART === 'true',
      brandName: process.env.VITE_FOOTER_BRAND_NAME || "web-card-guns.lol",
      brandUrl: process.env.VITE_FOOTER_BRAND_URL || "https://web-card-guns.lol"
    }
  };
}
