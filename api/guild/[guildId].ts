export default async function handler(
  req: { method?: string; query?: Record<string, string | string[]> },
  res: {
    status: (code: number) => { json: (data: any) => void };
    setHeader: (key: string, value: string) => void;
  }
) {
  const guildId = typeof req.query?.guildId === 'string' ? req.query.guildId : null;
  const inviteCode = process.env.VITE_DISCORD_INVITE_CODE;
  const serverIcon = process.env.VITE_DISCORD_SERVER_ICON || '/assets/servericon.jpg';
  const serverName = process.env.VITE_DISCORD_SERVER_NAME || 'Discord Server';

  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  if (!guildId) {
    return res.status(400).json({ message: 'guildId is required' });
  }

  const fallbackData = {
    id: guildId,
    name: serverName,
    icon: serverIcon,
    instant_invite: inviteCode ? `https://discord.gg/${inviteCode}` : undefined,
    members: [],
    presence_count: 0,
    fallback: true,
  };

  try {
    console.log('[Vercel API][Guild] Fetching widget for:', guildId);
    const url = `https://discord.com/api/v10/guilds/${guildId}/widget.json`;
    const response = await fetch(url);

    if (!response.ok) {
      console.error('[Vercel API][Guild] Widget API returned:', response.status);
      return res.status(response.status).json({ ...fallbackData, error: 'widget_unavailable' });
    }

    const data = await response.json();
    if (!data || !data.name) {
      return res.status(404).json({ ...fallbackData, error: 'invalid_widget_data' });
    }

    res.setHeader('Cache-Control', 'public, s-maxage=20, stale-while-revalidate=60');
    return res.status(200).json({
      id: data.id || guildId,
      name: data.name,
      icon: data.icon || serverIcon,
      instant_invite: data.instant_invite || fallbackData.instant_invite,
      members: data.members || [],
      presence_count: typeof data.presence_count === 'number' ? data.presence_count : data.members?.length || 0,
      approximate_member_count: data.approximate_member_count ?? data.members?.length ?? 0,
      approximate_presence_count: data.approximate_presence_count ?? data.presence_count ?? data.members?.length ?? 0,
      source: url
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'unknown_error';
    console.error('[Vercel API][Guild] Error:', message);
    return res.status(500).json({ ...fallbackData, error: 'fetch_failed' });
  }
}
