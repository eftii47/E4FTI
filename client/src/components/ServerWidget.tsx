import { motion } from "framer-motion";
import { MessageSquare } from "lucide-react";
import { useState, useEffect } from "react";

interface ServerWidgetProps {
  guildId?: string;
  serverLink?: string;
}

interface AttemptLog {
  url: string;
  status?: number;
  ok?: boolean;
  error?: string;
}

interface DiscordServer {
  id: string;
  name: string;
  icon?: string | null;
  approximate_member_count?: number;
  approximate_presence_count?: number;
  members?: Array<any>;
  presence_count?: number;
  instant_invite?: string;
  source?: string;
  error?: string;
  fallback?: boolean;
  attempts?: AttemptLog[];
}

export function ServerWidget({ guildId, serverLink }: ServerWidgetProps) {
  const [serverData, setServerData] = useState<DiscordServer | null>(null);
  const [loading, setLoading] = useState(true);

  // Fallback to env values if props are missing
  const envGuildId = import.meta.env.VITE_DISCORD_SERVER_ID as string | undefined;
  const envInvite = import.meta.env.VITE_DISCORD_INVITE_CODE as string | undefined;
  const effectiveGuildId = guildId || envGuildId;
  const effectiveInviteLink = serverLink || (envInvite ? `https://discord.gg/${envInvite}` : undefined);

  useEffect(() => {
    if (!effectiveGuildId) {
      console.error("ServerWidget: guildId is missing or undefined", effectiveGuildId, {
        envGuildId,
        envInvite,
        envAll: import.meta.env
      });
      setLoading(false);
      return;
    }

    const fetchServerData = async () => {
      try {
        const response = await fetch(`/api/guild/${effectiveGuildId}`);
        const data = await response.json();

        console.log("=== Discord Widget Data ===");
        console.log("Full response:", data);
        console.log("Member count:", data.approximate_member_count);
        console.log("Presence count:", data.approximate_presence_count);
        console.log("Members array length:", data.members?.length);
        console.log("Error:", data.error);
        console.log("Fallback mode:", data.fallback);
        console.log("Attempts:", data.attempts);
        console.log("==========================");

        if (data && data.id && data.name) {
          setServerData({
            id: data.id,
            name: data.name,
            icon: data.icon,
            approximate_member_count: data.approximate_member_count ?? data.members?.length ?? 0,
            approximate_presence_count: data.approximate_presence_count ?? data.presence_count ?? 0,
            members: data.members,
            presence_count: data.presence_count,
            instant_invite: data.instant_invite,
            source: data.source,
            error: data.error,
            fallback: data.fallback,
            attempts: data.attempts,
          });
        } else {
          console.error("Invalid data structure:", data);
        }
      } catch (error) {
        console.error("Error fetching server data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchServerData();
  }, [effectiveGuildId]);

  if (loading || !serverData) {
    return null;
  }

  const serverName = serverData.name || "Discord Server";
  const memberCount = typeof serverData.approximate_member_count === "number"
    ? serverData.approximate_member_count
    : serverData.members?.length || 0;
  const onlineCount = typeof serverData.approximate_presence_count === "number"
    ? serverData.approximate_presence_count
    : typeof serverData.presence_count === "number"
      ? serverData.presence_count
      : 0;
  const resolvedInvite = effectiveInviteLink || serverData.instant_invite;

  const resolveIconUrl = (icon: string | null | undefined, id: string) => {
    if (!icon) return null;
    if (icon.startsWith("http")) return icon;
    if (icon.startsWith("/")) return icon;
    const hashLike = /^[a-f0-9]{10,}$/i.test(icon);
    if (hashLike) {
      return `https://cdn.discordapp.com/icons/${id}/${icon}.png?size=256`;
    }
    return icon;
  };

  const serverIcon = resolveIconUrl(serverData.icon || null, serverData.id);
  const errorMessage = serverData.error === "widget_unavailable"
    ? "Discord widget looks disabled; showing fallback info."
    : serverData.error
      ? "Unable to fetch live Discord data; using fallback."
      : null;

  // Format member count (e.g., 16400 -> 16.4K)
  const formatCount = (count: number) => {
    if (count >= 1000) {
      return (count / 1000).toFixed(1) + "K";
    }
    return count.toString();
  };

  const handleClick = () => {
    if (resolvedInvite) {
      window.open(resolvedInvite, "_blank");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="w-full"
    >
      <div
        className="w-full glass-panel rounded-[1.25rem] p-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-xl border border-blue-400/30 hover:border-blue-400/50 transition-all hover:bg-gradient-to-r hover:from-blue-500/20 hover:to-purple-500/20 disabled:opacity-50 disabled:cursor-default"
      >
        <div className="flex items-center gap-4">
                    {/* Left Section: Icon + Info */}
                    <div className="flex items-center gap-4 flex-1 min-w-0">
          {/* Server Icon */}
          {serverIcon && (
            <div className="flex-shrink-0">
              <img
                src={serverIcon}
                alt={serverName}
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-blue-400/50 shadow-lg"
              />
            </div>
          )}

          {/* Server Info */}
          <div className="flex-1 min-w-0 text-left">
            <h3 className="font-bold text-lg text-white truncate mb-1">
              {serverName}
            </h3>
              
              {/* Status and Members */}
              <div className="mt-2 flex items-center gap-3 text-[9px] text-white/85 leading-none whitespace-nowrap">
                <span className="flex items-center gap-1 text-white/80">
                  <span className="w-2 h-2 rounded-full bg-green-400 -translate-y-[0.5px]" />
                  {onlineCount > 0 ? onlineCount.toLocaleString() : "0"} Online
                </span>
                <span className="flex items-center gap-1 text-white/80">
                  <span className="w-2 h-2 rounded-full bg-white/70 -translate-y-[0.5px]" />
                  {formatCount(memberCount)} Members
                </span>
              </div>
            </div>
          </div>

          {/* Right Section: Join Button */}
          {resolvedInvite && (
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleClick}
              className="mt--4 flex-shrink-0 px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition-colors flex items-center gap-2 whitespace-nowrap cursor-pointer"
            >
              <MessageSquare size={16} />
              Join Server
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
