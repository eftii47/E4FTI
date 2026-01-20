import { useLanyard } from "@/hooks/use-lanyard";
import type { Profile } from "@shared/schema";
import { motion } from "framer-motion";
import { Music, Gamepad2, Monitor } from "lucide-react";

interface DiscordWidgetProps {
  config: Profile["discord"];
  spotifyConfig: Profile["spotify"];
}

const statusColors = {
  online: "bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.4)]",
  idle: "bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.4)]",
  dnd: "bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.4)]",
  offline: "bg-gray-500",
};

export function DiscordWidget({ config, spotifyConfig }: DiscordWidgetProps) {
  const { data, status } = useLanyard({ userId: config.userId });

  if (status !== "connected" || !data) return null;

  const { discord_user, discord_status, activities, spotify, listening_to_spotify } = data;
  
  const showSpotify = spotifyConfig.showInDiscordStatus && (listening_to_spotify || activities.some(a => a.type === 2));
  const spotifyActivity = activities.find(a => a.type === 2) || (listening_to_spotify ? spotify : null);

  const gameActivity = config.showActivity 
    ? activities.find(a => a.type !== 2 && a.type !== 4)
    : null;

  const decorationUrl = discord_user.avatar_decoration_data 
    ? `https://cdn.discordapp.com/avatar-decoration-presets/${discord_user.avatar_decoration_data.asset}.png`
    : null;

  return (
    <div className="w-full">
      {config.showStatus && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel rounded-[1.25rem] p-3 flex items-center justify-between bg-black/60 backdrop-blur-xl border border-white/10 relative overflow-hidden"
        >
          <div className="flex items-center gap-3 flex-1 min-w-0">
            {/* Avatar & Decoration */}
            <div className="relative shrink-0">
              <div className="relative w-12 h-12">
                <div className="relative w-full h-full">
                  <img 
                    src={`https://cdn.discordapp.com/avatars/${discord_user.id}/${discord_user.avatar}.webp?size=128`} 
                    alt={discord_user.username}
                    className="w-full h-full rounded-full bg-secondary object-cover relative z-10"
                  />
                  {config.showDecoration && decorationUrl && (
                    <img 
                      src={decorationUrl}
                      alt="Decoration"
                      className="absolute top-1/3 left-1/3 w-full h-full rounded-full z-20 pointer-events-none transform -translate-x-1/3 -translate-y-1/3 border-[0px] border-transparent"
                      style={{ boxSizing: 'border-box' }}
                    />
                  )}
                  <div className={`absolute bottom-0.5 right-0.5 w-4 h-4 rounded-full border-2 border-[#121212] z-20 ${statusColors[discord_status]}`} />
                </div>
              </div>
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                <h4 className="font-bold text-lg text-white truncate leading-none tracking-tight">
                  {discord_user.global_name || discord_user.username}
                </h4>
                <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-white/10 text-[9px] font-bold text-white/90 shrink-0">
                  <span className="text-purple-400">💎</span> ACE_
                </div>
                <div className="p-1 rounded bg-white/10 shrink-0">
                   <svg className="w-2.5 h-2.5 text-[#949cf7]" viewBox="0 0 24 24" fill="currentColor">
                     <path d="M19.73 4.87a18.2 18.2 0 0 0-4.48-1.4 12.45 12.45 0 0 0-.62 1.26 16.7 16.7 0 0 0-5.26 0 12.45 12.45 0 0 0-.62-1.26 18.2 18.2 0 0 0-4.48 1.4 18.2 18.2 0 0 0-2.85 14.15 18.15 18.15 0 0 0 5.43 2.76 12.6 12.6 0 0 0 1.13-1.84 12.16 12.16 0 0 1-1.81-.86 1.05 1.05 0 0 1-.22-.17c-.15-.15-.14-.38.02-.53.15-.15.38-.14.53.02l.02.02c.57.43 1.17.81 1.8 1.13.1.05.2.1.3.14a12.1 12.1 0 0 0 10.96 0c.1-.04.2-.09.3-.14a12.3 12.3 0 0 0 1.8-1.13.38.38 0 0 1 .53-.02.38.38 0 0 1-.02.53 12.16 12.16 0 0 1-1.81.86 12.6 12.6 0 0 0 1.13 1.84 18.15 18.15 0 0 0 5.43-2.76 18.2 18.2 0 0 0-2.85-14.15ZM8.02 15.33c-1.18 0-2.15-1.08-2.15-2.42 0-1.33.95-2.42 2.15-2.42 1.21 0 2.17 1.09 2.15 2.42 0 1.34-.94 2.42-2.15 2.42Zm7.97 0c-1.18 0-2.15-1.08-2.15-2.42 0-1.33.95-2.42 2.15-2.42 1.21 0 2.17 1.09 2.15 2.42 0 1.34-.94 2.42-2.15 2.42Z"/>
                   </svg>
                </div>
              </div>

              {/* Spotify Text Section */}
              {showSpotify && spotifyActivity && (
                <div className="flex flex-col">
                  <p className="text-xs font-medium text-white/90 leading-tight">
                    <span className="font-bold">Listening to</span> <span className="text-white/60">{spotifyActivity.song || spotifyActivity.details}</span>
                  </p>
                  <p className="text-[11px] text-white/60 truncate italic leading-tight mt-0.5">
                    {spotifyActivity.artist || spotifyActivity.state}
                  </p>
                </div>
              )}

              {!showSpotify && (
                <p className="text-xs text-white/50 truncate capitalize">
                  {discord_status === "dnd" ? "Do Not Disturb" : discord_status}
                </p>
              )}
            </div>
          </div>

          {/* Album Art on the right */}
          {showSpotify && spotifyActivity && (
            <div className="shrink-0 ml-3 relative">
              <img 
                src={spotifyActivity.album_art_url || (spotifyActivity.assets?.large_image ? (spotifyActivity.assets.large_image.startsWith("spotify:") ? `https://i.scdn.co/image/${spotifyActivity.assets.large_image.split(":")[1]}` : (spotifyActivity.assets.large_image.startsWith("mp:external") ? spotifyActivity.assets.large_image.replace("mp:external/", "https://media.discordapp.net/external/") : `https://cdn.discordapp.com/app-assets/${spotifyActivity.application_id}/${spotifyActivity.assets.large_image}.png`)) : "")} 
                alt="Art"
                className="w-12 h-12 rounded-xl shadow-2xl object-cover border border-white/5"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "https://cdn.discordapp.com/embed/avatars/0.png";
                }}
              />
            </div>
          )}
        </motion.div>
      )}

      {/* Standalone Activity only if not Spotify */}
      {!showSpotify && gameActivity && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-3 glass-panel rounded-2xl p-4 flex items-center gap-3 bg-black/40 backdrop-blur-md border border-white/10"
        >
          <div className="shrink-0 relative">
            {gameActivity.assets?.large_image ? (
              <img 
                src={gameActivity.assets.large_image.startsWith("mp:external") 
                  ? gameActivity.assets.large_image.replace("mp:external/", "https://media.discordapp.net/external/")
                  : `https://cdn.discordapp.com/app-assets/${gameActivity.application_id}/${gameActivity.assets.large_image}.png`}
                alt={gameActivity.name}
                className="w-12 h-12 rounded-lg shadow-lg"
              />
            ) : (
              <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center">
                <Gamepad2 size={20} className="text-blue-400" />
              </div>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 mb-0.5">
              <span className="text-[10px] uppercase font-bold text-blue-400 tracking-wider">
                {gameActivity.type === 0 ? "Playing" : "Activity"}
              </span>
            </div>
            <p className="font-semibold text-sm text-white truncate leading-tight">{gameActivity.name}</p>
            {gameActivity.details && (
              <p className="text-xs text-white/60 truncate">{gameActivity.details}</p>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}
