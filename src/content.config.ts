import { defineCollection, z } from 'astro:content';

const djs = defineCollection({
  type: 'content', // Keystatic uses Markdoc for this
  schema: z.object({
    slug: z.string().optional(),
    name: z.string().optional(), 
    // NEW: Public Profile Active toggle (Defaults to true)
    active: z.boolean().default(true),
    // NEW: Rank field for sorting (defaults to 99 for unranked DJs)
    rank: z.number().optional().default(99), 
    avatar: z.string().optional(),
    genre: z.string().optional(),
    socials: z.object({
      instagram: z.string().optional(),
      soundcloud: z.string().optional(),
    }).optional(),
  }),
});

const shows = defineCollection({
  type: 'data', 
  schema: z.object({
    slug: z.string().optional(),
    title: z.string(),
    active: z.boolean().default(true),
    hosts: z.array(z.string()).optional(), 
    genre: z.string().optional(),
    description: z.string().optional(),
  }),
});

const schedule = defineCollection({
  type: 'data', // Keystatic uses YAML for this
  schema: z.object({
    allSlots: z.array(z.object({
      day: z.string(),
      startTime: z.string(),
      endTime: z.string(),
      show: z.string(),
    })),
  }),
});

const flyers = defineCollection({
  type: 'data', // Keystatic uses YAML for this
  schema: z.object({
    title: z.string().optional().default("Untitled Flyer"),
    image: z.string(),
    featured: z.boolean().default(false),
  }),
});

// Added to prevent crashes if an episode is created in Keystatic
const episodes = defineCollection({
  type: 'content', // Keystatic uses Markdoc for this
  schema: z.object({
    title: z.string().optional(),
    parentShow: z.string().optional(), // Links to show IDs
    airDate: z.coerce.date().optional(), // Coerce ensures strings like "2026-08-24" parse safely
    audioUrl: z.string().optional(),
  })
});

// Final exports - djSortOrder removed as it is now redundant
export const collections = { djs, shows, schedule, flyers, episodes };