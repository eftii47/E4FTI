import { useProfile } from "@/hooks/use-profile";
import { BadgeGallery } from "@/components/BadgeGallery";
import { Background } from "@/components/Background";
import { CustomCursor } from "@/components/CustomCursor";
import { AudioPlayer, type AudioPlayerHandle } from "@/components/AudioPlayer";
import { DiscordWidget } from "@/components/DiscordWidget";
import { SocialLinks } from "@/components/SocialLinks";
import { ServerWidget } from "@/components/ServerWidget";
import { ProfileViewOverlay } from "@/components/ProfileViewOverlay";
import { Loader2, Heart, Music, Gamepad2, Globe, Mail, Link as LinkIcon, Code, Video, Camera, Eye, MapPin, Users } from "lucide-react";
import Tilt from "react-parallax-tilt";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useLanyard } from "@/hooks/use-lanyard";
import { useRef } from "react";

export default function Home() {
  const { data: profile, isLoading, error } = useProfile();
  // Fallbacks from VITE_ env vars if profile is missing fields
  const fallbackProfile = {
    username: import.meta.env.VITE_USERNAME || "User",
    bio: import.meta.env.VITE_BIO || "",
    status: import.meta.env.VITE_STATUS || "online",
    pronouns: import.meta.env.VITE_PRONOUNS || "",
    banner: import.meta.env.VITE_BANNER_IMAGE || "/assets/profilebanner.jpg",
    avatar: {
      src: import.meta.env.VITE_AVATAR_IMAGE || "/assets/album-cover.jpg",
      alt: "Profile Avatar",
      useDiscord: true
    },
    viewImage: import.meta.env.VITE_VIEW_IMAGE || "",
    viewMedia: import.meta.env.VITE_VIEW_MEDIA || "",
    discord: {
      userId: import.meta.env.VITE_DC_PROFILE_UID || "",
      showStatus: true,
      showActivity: true,
      showDecoration: true,
      serverId: import.meta.env.VITE_DISCORD_SERVER_ID || "",
      serverIcon: import.meta.env.VITE_DISCORD_SERVER_ICON || "/assets/servericon.jpg",
      serverName: import.meta.env.VITE_DISCORD_SERVER_NAME || "",
      inviteCode: import.meta.env.VITE_DISCORD_INVITE_CODE || ""
    },
    spotify: {
      enabled: true,
      embedUrl: import.meta.env.VITE_SPOTIFY_PLAYLIST || "",
      height: 100,
      compact: true,
      showInDiscordStatus: true
    },
    background: {
      src: import.meta.env.VITE_BACKGROUND_VIDEO || "/assets/background.mp4",
      videoOpacity: 50,
      videoBlur: 0
    },
    audio: {
      src: import.meta.env.VITE_AUDIO_SRC || "/assets/audio.mp3",
      autoplay: true,
      loop: true,
      defaultVolume: 1
    },
    socialLinks: [
      { platform: "facebook", url: import.meta.env.VITE_FACEBOOK_LINK || "" },
      { platform: "twitter", url: import.meta.env.VITE_TWITTER_LINK || "" },
      { platform: "instagram", url: import.meta.env.VITE_INSTAGRAM_LINK || "" },
      { platform: "youtube", url: import.meta.env.VITE_YOUTUBE_LINK || "" },
      { platform: "github", url: import.meta.env.VITE_GITHUB_LINK || "" },
      { platform: "linkedin", url: import.meta.env.VITE_LINKEDIN_LINK || "" },
      { platform: "email", url: import.meta.env.VITE_EMAIL_LINK || "" },
      { platform: "website", url: import.meta.env.VITE_WEBSITE_LINK || "" }
    ],
    customLinks: [],
    badges: (() => { try { return JSON.parse(import.meta.env.VITE_BADGES || "[]"); } catch { return []; } })(),
    theme: {
      glowCyan: import.meta.env.VITE_THEME_GLOW_CYAN || "180 100% 50%",
      glowPurple: import.meta.env.VITE_THEME_GLOW_PURPLE || "270 100% 60%",
      glowPink: import.meta.env.VITE_THEME_GLOW_PINK || "320 100% 60%"
    },
    effects: {
      tiltEnabled: import.meta.env.VITE_EFFECTS_TILT_ENABLED === undefined ? true : import.meta.env.VITE_EFFECTS_TILT_ENABLED === 'true',
      tiltMaxAngle: import.meta.env.VITE_EFFECTS_TILT_MAX_ANGLE !== undefined ? Number(import.meta.env.VITE_EFFECTS_TILT_MAX_ANGLE) : 20,
      noiseEnabled: import.meta.env.VITE_EFFECTS_NOISE_ENABLED === undefined ? false : import.meta.env.VITE_EFFECTS_NOISE_ENABLED === 'true',
      showViews: import.meta.env.VITE_EFFECTS_SHOW_VIEWS === undefined ? true : import.meta.env.VITE_EFFECTS_SHOW_VIEWS === 'true',
      viewCount: Number(import.meta.env.VITE_VIEW_COUNT) || 0
    },
    footer: {
      text: import.meta.env.VITE_FOOTER_TEXT || "Made with ❤️ by Efti",
      heart: import.meta.env.VITE_FOOTER_HEART === undefined ? true : import.meta.env.VITE_FOOTER_HEART === 'true',
      brandName: import.meta.env.VITE_FOOTER_BRAND_NAME || "web-card-guns.lol",
      brandUrl: import.meta.env.VITE_FOOTER_BRAND_URL || "https://web-card-guns.lol"
    }
  };

  // Merge profile (from API or profile.json) with fallbackProfile for missing fields
  const mergedProfile = { ...fallbackProfile, ...profile, avatar: { ...fallbackProfile.avatar, ...(profile?.avatar || {}) }, discord: { ...fallbackProfile.discord, ...(profile?.discord || {}) }, spotify: { ...fallbackProfile.spotify, ...(profile?.spotify || {}) }, background: { ...fallbackProfile.background, ...(profile?.background || {}) }, audio: { ...fallbackProfile.audio, ...(profile?.audio || {}) }, theme: { ...fallbackProfile.theme, ...(profile?.theme || {}) }, effects: { ...fallbackProfile.effects, ...(profile?.effects || {}) }, footer: { ...fallbackProfile.footer, ...(profile?.footer || {}) }, socialLinks: profile?.socialLinks || fallbackProfile.socialLinks, customLinks: profile?.customLinks || fallbackProfile.customLinks, badges: profile?.badges || fallbackProfile.badges, viewImage: profile?.viewImage || fallbackProfile.viewImage, viewMedia: profile?.viewMedia || fallbackProfile.viewMedia };
  const effects = mergedProfile.effects;
  const { data: lanyard } = useLanyard({ userId: mergedProfile.discord.userId });
  const audioRef = useRef<AudioPlayerHandle>(null);

  // Scroll-based tilt state
  const [scrollTilt, setScrollTilt] = useState({ x: 0, y: 0 });
  const [lastScrollY, setLastScrollY] = useState(0);
  const [tapTilt, setTapTilt] = useState(0); // -maxAngle for left, +maxAngle for right
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);

  // Auto-open overlay on page load if image or video is configured
  useEffect(() => {
    if (mergedProfile?.viewImage || mergedProfile?.viewMedia) {
      const timer = setTimeout(() => {
        setIsOverlayOpen(true);
      }, 500); // Small delay for smooth page load
      return () => clearTimeout(timer);
    }
  }, [mergedProfile?.viewImage, mergedProfile?.viewMedia]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      const maxAngle = effects.tiltMaxAngle;
      const tiltMultiplier = 1.2;
      // Determine scroll direction for X tilt
      let x = 0;
      if (scrollY > lastScrollY) {
        x = maxAngle * tiltMultiplier; // Scroll down → tilt right
      } else if (scrollY < lastScrollY) {
        x = -maxAngle * tiltMultiplier; // Scroll up → tilt left
      }
      setLastScrollY(scrollY);
      // Y tilt still based on scroll position
      const y = Math.max(-maxAngle, Math.min(maxAngle, (scrollY / 100) * maxAngle * tiltMultiplier));
      setScrollTilt({ x, y });
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [effects.tiltMaxAngle, lastScrollY]);

            const maxAngle = effects.tiltMaxAngle;
  const handleTiltTap = (e: React.MouseEvent) => {
    const maxAngle = effects.tiltMaxAngle;
    const tiltMultiplier = 2.5;
    const x = e.clientX;
    const width = window.innerWidth;
    // Left half → tilt left, right half → tilt right
    if (x < width / 2) {
      setTapTilt(-maxAngle * tiltMultiplier);
    } else {
      setTapTilt(maxAngle * tiltMultiplier);
    }
    // Reset after short delay for effect
    setTimeout(() => setTapTilt(0), 400);
  };

  // Handle overlay opening with audio
  const handleAvatarClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (mergedProfile?.viewImage || mergedProfile?.viewMedia) {
      setIsOverlayOpen(true);
    }
  };

  // Play music on any click in the profile
  const handleProfileClick = () => {
    if (audioRef.current) {
      audioRef.current.play().catch(() => {
          const maxAngle = effects.tiltMaxAngle;
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#121212] text-white">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // If API fails, use fallback username for minimal display
  if (error || !profile) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#121212] text-white gap-4">
        <h2 className="text-xl font-bold text-red-500">Failed to load profile</h2>
        <h3 className="text-lg font-bold">{fallbackProfile.username}</h3>
      </div>
    );
  }

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  const useDiscordAvatar = mergedProfile?.avatar?.useDiscord && lanyard?.discord_user;
  const avatarSrc = useDiscordAvatar 
    ? `https://cdn.discordapp.com/avatars/${lanyard.discord_user.id}/${lanyard.discord_user.avatar}.webp?size=256`
    : mergedProfile?.avatar?.src;
  const decorationUrl = useDiscordAvatar && mergedProfile?.discord?.showDecoration && lanyard.discord_user.avatar_decoration_data
    ? `https://cdn.discordapp.com/avatar-decoration-presets/${lanyard.discord_user.avatar_decoration_data.asset}.png`
    : null;
  const displayUsername = import.meta.env.VITE_USERNAME || mergedProfile?.username || fallbackProfile.username;
  const bioTags = mergedProfile?.bio?.split(" ") || [];
  
  // Debug cursor image
  console.log('Home - VITE_CUSTOM_CURSOR_IMAGE:', import.meta.env.VITE_CUSTOM_CURSOR_IMAGE);

  return (
    <>
      <CustomCursor 
        config={mergedProfile?.cursor ?? { enabled: false, style: "dot", emoji: "", primaryColor: "#000", secondaryColor: "#fff" }} 
        customImage={import.meta.env.VITE_CUSTOM_CURSOR_IMAGE || "/assets/cursor.gif"}
      />
      <Background config={mergedProfile?.background ?? { src: "", videoOpacity: 1, videoBlur: 0 }} effects={mergedProfile?.effects} theme={mergedProfile?.theme ?? { glowCyan: "#00fff7", glowPurple: "#a259ff", glowPink: "#ff6ec4" }} />
      <AudioPlayer ref={audioRef} config={mergedProfile?.audio ?? { src: "", autoplay: false, loop: false, defaultVolume: 1 }} />

      <main className="min-h-screen py-8 px-4 flex flex-col items-center justify-start relative z-10 overflow-y-auto gap-4" onClick={e => { handleProfileClick(); handleTiltTap(e); }}>
        {/* Profile UI Content */}
        <div className="flex flex-col items-center">
          {/* Main Profile Card */}
          {effects.tiltEnabled ? (
            <Tilt
              tiltMaxAngleX={effects?.tiltMaxAngle ?? 20}
              tiltMaxAngleY={effects?.tiltMaxAngle ?? 20}
              perspective={1000}
              scale={1.03}
              transitionSpeed={2000}
              gyroscope={true}
              tiltAngleXManual={tapTilt !== 0 ? tapTilt : scrollTilt.x}
              tiltAngleYManual={scrollTilt.y}
              className="w-full max-w-[400px] sm:max-w-[420px]"
            >
              <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="glass-card rounded-[2rem] w-full relative overflow-hidden bg-[#f8fafc]/80 backdrop-blur-md border border-white/10 shadow-md"
              >
                {/* Banner */}
                <div className="h-36 w-full relative">
                  <img
                    src={typeof mergedProfile?.banner === "string" ? mergedProfile.banner : undefined}
                    className="w-full h-full object-cover brightness-50"
                    alt="Banner"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#1a1a1a]/80" />
                </div>
                <div className="px-5 pb-5 -mt-10 relative z-10">
                  {/* Avatar */}
                  <div 
                    className="relative inline-block mb-3 cursor-pointer group"
                    onClick={handleAvatarClick}
                  >
                    <div className="relative w-20 h-20">
                      {/* Click to View Indicator */}
                      {mergedProfile?.viewImage && (
                        <motion.div
                          className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 opacity-0 group-hover:opacity-40 transition-opacity duration-300 z-5"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                        />
                      )}
                      <div className="relative w-full h-full">
                        <img
                          src={avatarSrc}
                          alt={displayUsername}
                          className="w-full h-full rounded-full border-[3px] border-[#1a1a1a] shadow-2xl relative z-10 object-cover group-hover:shadow-2xl group-hover:shadow-cyan-500/50 transition-all duration-300"
                        />
                        {decorationUrl && (
                          <img
                            src={decorationUrl}
                            alt="Decoration"
                            className="absolute top-1/3 left-1/3 w-full h-full rounded-full z-20 pointer-events-none transform -translate-x-1/3 -translate-y-1/3 border-[0px] border-transparent"
                            style={{ boxSizing: 'border-box' }}
                          />
                        )}
                      </div>
                      {/* Click to View Label */}
                      {mergedProfile?.viewImage && (
                        <motion.div
                          className="absolute bottom-0 right-0 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full p-1.5 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                          whileHover={{ scale: 1.1 }}
                        >
                          <Camera className="w-3 h-3 text-white" />
                        </motion.div>
                      )}
                    </div>
                  </div>
                  {/* Username */}
                  <motion.div variants={item} className="mb-2">
                    <h1 className="text-3xl font-bold text-white tracking-tighter uppercase text-glow-blue">
                      {displayUsername}
                    </h1>
                  </motion.div>
                    {/* Badge Gallery */}
                    <motion.div variants={item} className="mb-5">
                      <BadgeGallery />
                    </motion.div>
                  {/* Bio Tags */}
                  <motion.div variants={item} className="flex flex-wrap gap-1 mb-4 justify-center">
                    {bioTags.map((tag: string, i: number) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded-full bg-white/10 border border-white/5 text-[13px] font-extrabold text-white bio-white-stroke bio-blue-glow"
                      >
                        {tag}
                      </span>
                    ))}
                  </motion.div>
                  {/* Social Links - After Bio, aligned with bio */}
                  <motion.div variants={item} className="flex flex-wrap gap-2 justify-left mb-5 mt-2">
                    <SocialLinks
                      links={(() => {
                        let links = mergedProfile?.socialLinks?.filter(l => l.platform.toLowerCase() !== 'email') || [];
                        // Add Discord as the first social link if not present
                        const discordId = mergedProfile?.discord?.userId;
                        let discordLink: { platform: string; url: string } | undefined = undefined;
                        if (discordId && !links.some(l => l.platform.toLowerCase() === 'discord')) {
                          discordLink = { platform: 'discord', url: `https://discord.com/users/${discordId}` };
                        } else if (links.length && links[0].platform.toLowerCase() === 'discord') {
                          discordLink = links.shift();
                        }
                        // Remove Instagram and Twitter from the list
                        const instaIdx = links.findIndex(l => l.platform.toLowerCase() === 'instagram');
                        const twitterIdx = links.findIndex(l => l.platform.toLowerCase() === 'twitter');
                        const insta = instaIdx !== -1 ? links.splice(instaIdx, 1)[0] : undefined;
                        // Twitter index may change if Instagram was before it
                        const twitterIdx2 = links.findIndex(l => l.platform.toLowerCase() === 'twitter');
                        const twitter = twitterIdx2 !== -1 ? links.splice(twitterIdx2, 1)[0] : undefined;
                        // Compose the new order
                        const result: { platform: string; url: string }[] = [];
                        if (discordLink) result.push(discordLink);
                        // Fill up to 2 slots with remaining links
                        while (result.length < 2 && links.length) result.push(links.shift()!);
                        if (insta) result.push(insta);
                        if (twitter) result.push(twitter);
                        // Add the rest
                        return [...result, ...links];
                      })() as { platform: string; url: string }[]}
                    />
                  </motion.div>
                  {/* Stats Row */}
                  <motion.div variants={item} className="flex items-center gap-3 pt-3 border-t border-white/5">
                    <div className="flex items-center gap-1 text-white/40">
                      <Eye size={12} />
                      <span className="text-[10px] font-medium">{effects.viewCount ?? 0}</span>
                    </div>
                    <div className="flex items-center gap-1 text-white/40">
                      <MapPin size={12} />
                      <span className="text-[10px] font-medium">Dhaka</span>
                    </div>
                    <div className="flex items-center gap-1 text-white/40">
                      <Users size={12} />
                      <span className="text-[10px] font-medium">98</span>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </Tilt>
          ) : (
            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
              className="glass-card rounded-[2rem] w-full relative overflow-hidden bg-[#f8fafc]/80 backdrop-blur-md border border-white/10 shadow-md"
            >
              {/* Banner */}
              <div className="h-36 w-full relative">
                <img
                  src={typeof mergedProfile?.banner === "string" ? mergedProfile.banner : undefined}
                  className="w-full h-full object-cover brightness-50"
                  alt="Banner"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#1a1a1a]/80" />
              </div>
              <div className="px-5 pb-5 -mt-10 relative z-10">
                {/* Avatar */}
                <div className="relative inline-block mb-3">
                  <div className="relative w-20 h-20">
                    <div className="relative w-full h-full">
                      <img
                        src={avatarSrc}
                        alt={profile.username}
                        className="w-full h-full rounded-full border-[3px] border-[#1a1a1a] shadow-2xl relative z-10 object-cover"
                      />
                      {decorationUrl && (
                        <img
                          src={decorationUrl}
                          alt="Decoration"
                          className="absolute top-1/3 left-1/3 w-full h-full rounded-full z-20 pointer-events-none transform -translate-x-1/3 -translate-y-1/3 border-[0px] border-transparent"
                          style={{ boxSizing: 'border-box' }}
                        />
                      )}
                    </div>
                  </div>
                </div>
                {/* Username */}
                <motion.div variants={item} className="mb-2">
                  <h1 className="text-3xl font-bold text-white tracking-tighter uppercase text-glow-blue">
                    {displayUsername}
                  </h1>
                </motion.div>
                  {/* Badge Gallery */}
                  <motion.div variants={item} className="mb-3">
                    <BadgeGallery />
                  </motion.div>
                {/* Bio Tags */}
                <motion.div variants={item} className="flex flex-wrap gap-1 mb-4 justify-left">
                  {bioTags.map((tag: string, i: number) => (
                    <span
                      key={i}
                      className="px-2.5 py-0.5 rounded-full bg-white/5 border border-white/5 text-[13px] font-extrabold text-white bio-white-stroke bio-blue-glow"
                    >
                      {tag}
                    </span>
                  ))}
                </motion.div>
                {/* Social Links - After Bio, aligned with bio */}
                <motion.div variants={item} className="flex flex-wrap gap-2 justify-left mb-5 mt-2">
                  <SocialLinks links={mergedProfile?.socialLinks?.filter(l => l.platform.toLowerCase() !== 'email') || []} />
                </motion.div>
                {/* Stats Row */}
                <motion.div variants={item} className="flex items-center gap-3 pt-3 border-t border-white/5">
                  <div className="flex items-center gap-1 text-white/40">
                    <Eye size={12} />
                    <span className="text-[10px] font-medium">{effects.viewCount ?? 0}</span>
                  </div>
                  <div className="flex items-center gap-1 text-white/40">
                    <MapPin size={12} />
                    <span className="text-[10px] font-medium">Spotify</span>
                  </div>
                  <div className="flex items-center gap-1 text-white/40">
                    <Users size={12} />
                    <span className="text-[10px] font-medium">0</span>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}
          {/* Stacked Widgets with Tilt */}
          <div className="w-full max-w-[400px] sm:max-w-[420px] space-y-3 mt-4">
            {/* Discord Widget */}
            {effects.tiltEnabled ? (
              <Tilt
                tiltMaxAngleX={effects?.tiltMaxAngle ?? 20}
                tiltMaxAngleY={effects?.tiltMaxAngle ?? 20}
                perspective={1000}
                scale={1.03}
                transitionSpeed={2000}
                gyroscope={true}
                tiltAngleXManual={tapTilt !== 0 ? tapTilt : scrollTilt.x}
                tiltAngleYManual={scrollTilt.y}
                className="w-full"
              >
                <DiscordWidget config={mergedProfile?.discord ?? { userId: "", showStatus: false, showActivity: false, showDecoration: false }} spotifyConfig={mergedProfile?.spotify ?? { enabled: false, embedUrl: "", height: 80, compact: false, showInDiscordStatus: false }} />
              </Tilt>
            ) : (
              <DiscordWidget config={mergedProfile?.discord ?? { userId: "", showStatus: false, showActivity: false, showDecoration: false }} spotifyConfig={mergedProfile?.spotify ?? { enabled: false, embedUrl: "", height: 80, compact: false, showInDiscordStatus: false }} />
            )}
            {/* Discord Server Widget */}
            {effects.tiltEnabled ? (
              <Tilt
                tiltMaxAngleX={effects?.tiltMaxAngle ?? 20}
                tiltMaxAngleY={effects?.tiltMaxAngle ?? 20}
                perspective={1000}
                scale={1.03}
                transitionSpeed={2000}
                gyroscope={true}
                tiltAngleXManual={tapTilt !== 0 ? tapTilt : scrollTilt.x}
                tiltAngleYManual={scrollTilt.y}
                className="w-full"
              >
                <ServerWidget 
                  guildId={mergedProfile?.discord?.serverId}
                  serverLink={mergedProfile?.discord?.inviteCode ? `https://discord.gg/${mergedProfile.discord.inviteCode}` : undefined}
                />
              </Tilt>
            ) : (
              <ServerWidget 
                guildId={mergedProfile?.discord?.serverId}
                serverLink={mergedProfile?.discord?.inviteCode ? `https://discord.gg/${mergedProfile.discord.inviteCode}` : undefined}
              />
            )}
            {/* Spotify Playlist Widget */}
            {effects.tiltEnabled ? (
              <Tilt
                tiltMaxAngleX={effects?.tiltMaxAngle ?? 20}
                tiltMaxAngleY={effects?.tiltMaxAngle ?? 20}
                perspective={1000}
                scale={1.03}
                transitionSpeed={2000}
                tiltAngleYManual={scrollTilt.y}
                className="w-full"
              >
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass-panel rounded-[1.25rem] overflow-hidden bg-white/80 backdrop-blur-sm border border-white/10 shadow-sm flex items-center"
                  style={{ minHeight: 80, height: 80 }}
                >
                  <iframe 
                    src="https://open.spotify.com/embed/playlist/7tiPEUSHxjSiJ2C5H5UFEn?si=d5a0ef5da61343df" 
                    frameBorder="0" 
                    allowFullScreen 
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                    className="w-full h-full border-0 rounded-[1.25rem]"
                    style={{ minHeight: 80, height: 80, maxHeight: 100, width: '100%', borderRadius: '1.25rem' }}
                  />
                </motion.div>
              </Tilt>
            ) : (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-panel rounded-[1.25rem] overflow-hidden bg-white/80 backdrop-blur-sm border border-white/10 shadow-sm flex items-center"
                style={{ minHeight: 80, height: 80 }}
              >
                <iframe 
                  src="https://open.spotify.com/embed/playlist/7tiPEUSHxjSiJ2C5H5UFEn" 
                  frameBorder="0" 
                  allowFullScreen 
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  className="rounded-[1.25rem] border-0 w-full h-full"
                  style={{ minHeight: 80, height: 80, maxHeight: 84, width: '100%', borderRadius: '1.25rem' }}
                />
              </motion.div>
            )}
          </div>
        </div>
      </main>
      
      {/* Profile View Overlay */}
      <ProfileViewOverlay
        isOpen={isOverlayOpen}
        onClose={() => setIsOverlayOpen(false)}
        viewImage={mergedProfile?.viewImage}
        viewMedia={mergedProfile?.viewMedia}
        onOpen={() => {
          // Callback when overlay opens - can be used for additional effects
        }}
        audio={mergedProfile?.audio}
        onPlayAudio={async () => {
          if (audioRef.current) {
            await audioRef.current.play().catch(err => console.error("Failed to play audio:", err));
          }
        }}
      />
    </>
  );
}
