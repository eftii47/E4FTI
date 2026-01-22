import { z } from 'zod';
import { insertProfileSchema, profiles } from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const discordPresenceSchema = z.object({
  discord_user: z.object({
    id: z.string(),
    username: z.string(),
    avatar: z.string(),
    discriminator: z.string(),
    global_name: z.string().optional(),
    avatar_decoration_data: z.object({
      asset: z.string(),
      sku_id: z.string(),
    }).optional(),
  }).optional(),
  discord_status: z.enum(['online', 'idle', 'dnd', 'offline']).optional(),
  activities: z.array(z.object({
    name: z.string(),
    type: z.number(),
    state: z.string().optional(),
    details: z.string().optional(),
    timestamps: z.object({
      start: z.number().optional(),
      end: z.number().optional(),
    }).optional(),
    assets: z.object({
      large_image: z.string().optional(),
      large_text: z.string().optional(),
      small_image: z.string().optional(),
      small_text: z.string().optional(),
    }).optional(),
    application_id: z.string().optional(),
  })).optional(),
  spotify: z.object({
    track_id: z.string(),
    song: z.string(),
    artist: z.string(),
    album: z.string(),
    album_art_url: z.string(),
  }).optional(),
  listening_to_spotify: z.boolean().optional(),
});

export const api = {
  profile: {
    get: {
      method: 'GET' as const,
      path: '/api/profile',
      responses: {
        200: z.custom<typeof profiles.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
  },
  discord: {
    presence: {
      method: 'GET' as const,
      path: '/api/discord/presence/:userId',
      responses: {
        200: discordPresenceSchema,
        404: errorSchemas.notFound,
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}

export type ProfileResponse = z.infer<typeof api.profile.get.responses[200]>;
export type DiscordPresence = z.infer<typeof discordPresenceSchema>;
