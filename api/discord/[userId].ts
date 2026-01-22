export default async function handler(
  req: { method?: string; query?: Record<string, string | string[]> },
  res: {
    status: (code: number) => { json: (data: any) => void };
    setHeader: (key: string, value: string) => void;
  }
) {
  const userId = typeof req.query?.userId === 'string' ? req.query.userId : null;

  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  if (!userId) {
    return res.status(400).json({ message: 'userId is required' });
  }

  try {
    console.log('[Vercel API] Fetching Discord presence for:', userId);

    // Fetch from Lanyard API
    const response = await fetch(`https://api.lanyard.rest/v1/users/${userId}`);

    if (!response.ok) {
      console.error('[Vercel API] Lanyard API returned:', response.status);
      return res.status(response.status).json({
        message: 'Unable to fetch Discord presence from Lanyard API'
      });
    }

    const data = await response.json();

    if (!data.success) {
      console.error('[Vercel API] Lanyard API returned success: false');
      return res.status(404).json({
        message: 'Discord user not found or Lanyard API error'
      });
    }

    console.log('[Vercel API] Discord presence fetched successfully');
    res.setHeader('Cache-Control', 'public, s-maxage=10, stale-while-revalidate=30');
    return res.status(200).json(data.data);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'unknown_error';
    console.error('[Vercel API] Error fetching Discord presence:', message);
    return res.status(500).json({
      message: 'Internal server error while fetching Discord presence'
    });
  }
}
