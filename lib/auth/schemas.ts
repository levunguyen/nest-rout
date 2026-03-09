import { z } from "zod";

export const registerSchema = z.object({
  fullName: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(255).toLowerCase(),
  password: z.string().min(8).max(128),
  invitationToken: z.string().trim().min(20).max(255).optional(),
});

export const loginSchema = z.object({
  email: z.string().trim().email().max(255).toLowerCase(),
  password: z.string().min(8).max(128),
  rememberMe: z.boolean().optional().default(false),
});

export const familyMemberCreateSchema = z.object({
  fullName: z.string().trim().min(2).max(120),
  gender: z.enum(["MALE", "FEMALE", "OTHER"]).optional(),
  birthYear: z.number().int().min(0).max(3000).optional(),
  deathYear: z.number().int().min(0).max(3000).optional(),
  address: z.string().trim().max(255).optional(),
  city: z.string().trim().max(120).optional(),
  country: z.string().trim().max(120).optional(),
  generation: z.number().int().min(-1).max(20).default(1),
  parentId: z.string().trim().min(1).optional(),
  spouseIds: z.array(z.string().trim().min(1)).max(10).optional().default([]),
  imageUrl: z.string().trim().url().max(2048).optional(),
  relation: z.string().trim().max(80).optional(),
  note: z.string().trim().max(2000).optional(),
});

export const familyMemberUpdateSchema = familyMemberCreateSchema.partial();

export const createTenantSchema = z.object({
  name: z.string().trim().min(2).max(120),
});

export const switchTenantSchema = z.object({
  familyTreeId: z.string().trim().min(1),
});

export const createInvitationSchema = z.object({
  email: z.string().trim().email().max(255).toLowerCase(),
  role: z.enum(["ADMIN", "EDITOR", "VIEWER"]).default("VIEWER"),
  expiresInDays: z.number().int().min(1).max(30).default(7),
});

export const acceptInvitationSchema = z.object({
  token: z.string().trim().min(20).max(255),
});

export const eventCreateSchema = z.object({
  title: z.string().trim().min(2).max(180),
  description: z.string().trim().max(2000).optional(),
  type: z.enum(["BIRTHDAY", "ANNIVERSARY", "GATHERING", "OTHER"]).default("OTHER"),
  startsAt: z.string().datetime(),
  endsAt: z.string().datetime().optional(),
  location: z.string().trim().max(255).optional(),
});

export const eventUpdateSchema = eventCreateSchema.partial();

export const newsPostCreateSchema = z.object({
  title: z.string().trim().min(2).max(180),
  excerpt: z.string().trim().max(500).optional(),
  content: z.array(z.string().trim().min(1).max(4000)).min(1).max(80),
  imageUrl: z.string().trim().url().max(2048).optional(),
  category: z.string().trim().min(1).max(80).default("Tin tức"),
  readTimeMinutes: z.number().int().min(1).max(180).default(5),
  featured: z.boolean().default(false),
  publishedAt: z.string().datetime().optional(),
  authorName: z.string().trim().min(2).max(120).optional(),
});

export const newsPostUpdateSchema = newsPostCreateSchema.partial();

export const newsCommentCreateSchema = z.object({
  content: z.string().trim().min(2).max(2000),
  authorName: z.string().trim().min(2).max(120).optional(),
});

export const newsCommentUpdateSchema = newsCommentCreateSchema.partial();

export const mediaAssetCreateSchema = z.object({
  name: z.string().trim().min(1).max(255),
  kind: z.enum(["image", "video"]),
  category: z.string().trim().min(1).max(120),
  usedBy: z.string().trim().min(1).max(120),
  url: z.string().trim().min(1).max(2048),
  sizeMb: z.number().min(0).max(5000).default(0),
  mimeType: z.string().trim().max(120).optional(),
  originalName: z.string().trim().max(255).optional(),
});
