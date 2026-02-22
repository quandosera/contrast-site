import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * 1. DJs Collection
 * Modern Loader for Astro 5.
 */
const djs = defineCollection({
  loader: glob({ pattern: "**/*{.md,.mdoc}", base: "./src/content/djs" }),
  schema: z.object({
    slug: z.string().optional(),
    name: z.string().optional(), 
    active: z.boolean().default(true),
    rank: z.number().optional().default(99), 
    avatar: z.string().optional(),
    genre: z.string().optional(),
    socials: z.object({
      instagram: z.string().optional(),
      soundcloud: z.string().optional(),
    }).optional(),
  }),
});

/**
 * 2. Shows Collection
 */
const shows = defineCollection({
  loader: glob({ pattern: "**/*.yaml", base: "./src/content/shows" }),
  schema: z.object({
    slug: z.string().optional(),
    title: z.string(),
    active: z.boolean().default(true),
    hosts: z.array(z.string()).optional(), 
    genre: z.string().optional(),
    description: z.string().optional(),
  }),
});

/**
 * 3. Schedule Collection
 */
const schedule = defineCollection({
  loader: glob({ pattern: "**/*.yaml", base: "./src/content/schedule" }),
  schema: z.object({
    allSlots: z.array(z.object({
      day: z.string(),
      startTime: z.string(),
      endTime: z.string(),
      show: z.string(),
    })),
  }),
});

/**
 * 4. Flyers Collection
 */
const flyers = defineCollection({
  loader: glob({ pattern: "**/*.yaml", base: "./src/content/flyers" }),
  schema: z.object({
    title: z.string().optional().default("Untitled Flyer"),
    image: z.string(),
    featured: z.boolean().default(false),
  }),
});

/**
 * 5. DJ Order Collection
 * Explicitly defined to stop "Auto-generating collections" warnings.
 */
const djOrder = defineCollection({
  loader: glob({ pattern: "**/*{.md,.mdoc}", base: "./src/content/dj-order" }),
  schema: z.object({
    name: z.string().optional(),
    rank: z.number().optional().default(99),
  }),
});

// Final exports - 'episodes' removed.
export const collections = { 
  djs, 
  shows, 
  schedule, 
  flyers,
  'dj-order': djOrder 
};