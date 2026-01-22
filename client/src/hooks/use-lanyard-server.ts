import { useState, useEffect } from "react";

interface LanyardServerData {
  id: string;
  name: string;
  icon: string;
  description?: string;
  approximate_member_count?: number;
  approximate_presence_count?: number;
  banner?: string;
}

interface UseLanyardServerOptions {
  guildId?: string;
  enabled?: boolean;
}

export function useLanyardServer({ guildId, enabled = true }: UseLanyardServerOptions) {
  const [data, setData] = useState<LanyardServerData | null>(null);
  const [status, setStatus] = useState<"loading" | "connected" | "error">("loading");

  useEffect(() => {
    if (!guildId || !enabled) {
      setStatus("loading");
      return;
    }

    const fetchServerData = async () => {
      try {
        const response = await fetch(`https://api.lanyard.rest/v1/guilds/${guildId}`);
        const json = await response.json();
        
        if (json.success && json.data) {
          setData(json.data);
          setStatus("connected");
        } else {
          setStatus("error");
        }
      } catch (err) {
        console.error("Error fetching server data from Lanyard:", err);
        setStatus("error");
      }
    };

    fetchServerData();
  }, [guildId, enabled]);

  return { data, status };
}
