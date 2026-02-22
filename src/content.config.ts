// src/content/config.ts
import { defineCollection, z } from 'astro:content';

const djs = defineCollection({
  type: 'content',
  schema: z.object({
    name: z.string(),
    avatar: z.string(),
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
    title: z.string(),
    active: z.boolean().default(true),
    hosts: z.array(z.string()).optional(), // This links to DJ IDs
    genre: z.string().optional(),
    description: z.string().optional(),
  }),
});

const schedule = defineCollection({
  type: 'data',
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
  type: 'data',
  schema: z.object({
    // ✨ THE FIX: Added .optional() or .default() so missing titles don't crash the site
    title: z.string().optional().default("Untitled Flyer"),
    image: z.string(),
    featured: z.boolean().default(false),
  }),
});

export const collections = { djs, shows, schedule, flyers };