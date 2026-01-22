import type { Express } from "express";
import { createServer, type Server } from "http";
import { getEnvProfile } from "./env-profile";
import { api } from "@shared/routes";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  app.get(api.profile.get.path, async (_req, res) => {
    const profile = getEnvProfile();
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }
    res.json(profile);
  });

  // Guild/Server endpoint
  app.get("/api/guild/:guildId", async (req, res) => {
    const { guildId } = req.params;
    const serverName = process.env.VITE_DISCORD_SERVER_NAME;
    const inviteCode = process.env.VITE_DISCORD_INVITE_CODE;
    const serverIcon = process.env.VITE_DISCORD_SERVER_ICON || "/assets/servericon.jpg";

    // Base fallback data
    const fallbackData = {
      id: guildId,
      name: serverName,
      icon: serverIcon,
      instant_invite: `https://discord.gg/${inviteCode}`,
      members: [],
      presence_count: 0,
      fallback: true
    };

    try {
      console.log("Fetching guild data for:", guildId);
      const attempts: Array<{ url: string; status?: number; ok?: boolean; error?: string }> = [];
      const endpoints = [
        `https://discord.com/api/v10/guilds/${guildId}/widget.json`,
        `https://discordapp.com/api/guilds/${guildId}/widget.json`
      ];

      const fetchInviteCounts = async () => {
        const inviteUrl = `https://discord.com/api/v10/invites/${inviteCode}?with_counts=true&with_expiration=true`;
        try {
          const response = await fetch(inviteUrl);
          attempts.push({ url: inviteUrl, status: response.status, ok: response.ok });
          if (!response.ok) {
            console.log("Invite counts endpoint status", response.status, response.statusText);
            return null;
          }
          const inviteData = await response.json();
          const memberCount = typeof inviteData.approximate_member_count === "number" ? inviteData.approximate_member_count : null;
          const presenceCount = typeof inviteData.approximate_presence_count === "number" ? inviteData.approximate_presence_count : null;
          console.log("Invite counts received", { memberCount, presenceCount });
          return { memberCount, presenceCount, source: inviteUrl };
        } catch (err) {
          const message = err instanceof Error ? err.message : "unknown_error";
          attempts.push({ url: inviteUrl, error: message });
          console.log("Invite counts fetch error", message);
          return null;
        }
      };

      for (const url of endpoints) {
        try {
          const response = await fetch(url);
          attempts.push({ url, status: response.status, ok: response.ok });

          if (!response.ok) {
            console.log("Widget endpoint", url, "status", response.status, response.statusText);
            continue;
          }

          const data = await response.json();
          if (data && data.name) {
            console.log("Guild data received:", data.name, "members:", data.members?.length || 0, "presence:", data.presence_count ?? "n/a", "source:", url);
            
            // Always fetch invite counts to get accurate server-wide stats
            const inviteCounts = await fetchInviteCounts();
            
            // Prioritize invite API for accurate counts (widget is limited to ~100 visible members)
            // Active/online members: prefer invite presence count over widget's limited view
            const activeOnline = inviteCounts?.presenceCount
              || (typeof data.presence_count === "number" ? data.presence_count : 0)
              || (Array.isArray(data.members) ? data.members.length : 0);

            // Total members from invite API (accurate total count)
            const totalMembers = inviteCounts?.memberCount 
              || (typeof data.approximate_member_count === "number" ? data.approximate_member_count : 0)
              || 0;
            
            console.log("Counts - Total:", totalMembers, "Active:", activeOnline, "(from invite API)");
            const combinedMemberCount = totalMembers;
            const combinedPresence = activeOnline;

            return res.json({
              id: data.id || guildId,
              name: data.name,
              icon: data.icon || serverIcon,
              instant_invite: data.instant_invite || `https://discord.gg/${inviteCode}`,
              members: data.members || [],
              presence_count: combinedPresence,
              approximate_member_count: combinedMemberCount,
              approximate_presence_count: combinedPresence,
              source: url,
              attempts
            });
          }
        } catch (err) {
          const message = err instanceof Error ? err.message : "unknown_error";
          attempts.push({ url, error: message });
          console.log("Widget fetch error for", url, message);
        }
      }

      console.log("No widget data returned; using fallback", attempts);
      const inviteCounts = await fetchInviteCounts();
      if (inviteCounts) {
        return res.json({
          ...fallbackData,
          approximate_member_count: inviteCounts.memberCount ?? 0,
          approximate_presence_count: inviteCounts.presenceCount ?? 0,
          presence_count: inviteCounts.presenceCount ?? 0,
          error: "widget_unavailable",
          attempts
        });
      }

      return res.json({ ...fallbackData, error: "widget_unavailable", attempts });
    } catch (error) {
      const message = error instanceof Error ? error.message : "unknown_error";
      console.log("Error fetching from Discord API:", message, "- using fallback");
      return res.json({ ...fallbackData, error: "fetch_failed", attempts: [] });
    }
  });

  // Seed data function
  await seedDatabase();

  return httpServer;
}

async function seedDatabase() {
  // const existingProfile = await storage.getProfile();
  //
  // const profileData = {
  //   USERNAME: "E F T ",
  //     // Database logic removed for static site. No database required.
  //   pronouns: "",
  //   banner: "/assets/profilebanner.jpg",
  //   avatar: {
  //     src: "/assets/album-cover.jpg",
  //   }
  // };
}
