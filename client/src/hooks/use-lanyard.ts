import { useState, useEffect } from "react";

// Types based on Lanyard API with profile enhancements
interface LanyardData {
  discord_user: {
    id: string;
    username: string;
    avatar: string;
    discriminator: string;
    global_name: string;
    avatar_decoration_data?: {
      asset: string;
      sku_id: string;
    };
  };
  discord_status: "online" | "idle" | "dnd" | "offline";
  kv?: {
    [key: string]: string;
  };
  activities: Array<{
    name: string;
    type: number;
    state?: string;
    details?: string;
    timestamps?: { start?: number; end?: number };
    assets?: {
      large_image?: string;
      large_text?: string;
      small_image?: string;
      small_text?: string;
    };
    application_id?: string;
  }>;
  spotify?: {
    track_id: string;
    song: string;
    artist: string;
    album: string;
    album_art_url: string;
  };
  listening_to_spotify: boolean;
}

interface UseLanyardOptions {
  userId?: string;
  enabled?: boolean;
}

export function useLanyard({ userId, enabled = true }: UseLanyardOptions) {
  const [data, setData] = useState<LanyardData | null>(null);
  const [status, setStatus] = useState<"loading" | "connected" | "error">("loading");

  useEffect(() => {
    if (!userId || !enabled) {
      setStatus("loading");
      return;
    }

    let socket: WebSocket | null = null;
    let heartbeatInterval: any = null;
    let isComponentMounted = true;

    const connect = () => {
      try {
        // Fetch initial data from our server endpoint
        console.log('[Lanyard] Connecting for userId:', userId);
        fetch(`/api/discord/presence/${userId}`)
          .then((res) => {
            console.log('[Lanyard] Server endpoint response:', res.status);
            if (!res.ok) throw new Error(`Status ${res.status}`);
            return res.json();
          })
          .then((json) => {
            console.log('[Lanyard] Server endpoint data received:', json);
            if (isComponentMounted) {
              setData(json);
              setStatus("connected");
            }
          })
          .catch((err) => {
            console.warn("[Lanyard] Server endpoint failed:", err.message);
            // Try direct Lanyard API as fallback
            console.log('[Lanyard] Trying fallback to direct Lanyard API');
            return fetch(`https://api.lanyard.rest/v1/users/${userId}`)
              .then((res) => {
                console.log('[Lanyard] Direct API response:', res.status);
                if (!res.ok) throw new Error(`Status ${res.status}`);
                return res.json();
              })
              .then((json) => {
                console.log('[Lanyard] Direct API data received:', json);
                if (isComponentMounted && json.success) {
                  setData(json.data);
                  setStatus("connected");
                }
              })
              .catch((fallbackErr) => {
                console.error("[Lanyard] Both endpoints failed:", fallbackErr);
                if (isComponentMounted) {
                  setStatus("error");
                }
              });
          });

        // Try WebSocket connection for real-time updates
        socket = new WebSocket("wss://api.lanyard.rest/socket");

        socket.onopen = () => {
          if (isComponentMounted) {
            socket?.send(
              JSON.stringify({
                op: 2,
                d: { subscribe_to_id: userId },
              })
            );
          }
        };

        socket.onmessage = (event) => {
          if (!isComponentMounted) return;

          const message = JSON.parse(event.data);

          if (message.op === 0) {
            if (message.t === "INIT_STATE" || message.t === "PRESENCE_UPDATE") {
              setData(message.d);
              setStatus("connected");
            }
          } else if (message.op === 1) {
            if (heartbeatInterval) clearInterval(heartbeatInterval);
            heartbeatInterval = setInterval(() => {
              if (socket?.readyState === WebSocket.OPEN) {
                socket.send(JSON.stringify({ op: 3 }));
              }
            }, message.d.heartbeat_interval);
          }
        };

        socket.onclose = () => {
          if (isComponentMounted && heartbeatInterval) {
            clearInterval(heartbeatInterval);
          }
          // Don't set error immediately - REST API already provided data
          if (!data) {
            setStatus("error");
          }
        };

        socket.onerror = () => {
          if (isComponentMounted && !data) {
            setStatus("error");
          }
        };
      } catch (err) {
        console.error("Lanyard connection error:", err);
        if (isComponentMounted) {
          setStatus("error");
        }
      }
    };

    connect();

    return () => {
      isComponentMounted = false;
      if (heartbeatInterval) clearInterval(heartbeatInterval);
      if (socket) socket.close();
    };
  }, [userId, enabled]);

  return { data, status };
}
