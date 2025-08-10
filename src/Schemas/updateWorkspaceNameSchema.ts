import { z } from 'zod'

export const updateWorkspaceSchema = z.object({
  name: z.string().min(3, "Workspace name is required"),
  slug: z.string().min(3, "Slug is required").regex(/^[a-z0-9-]+$/, {
    message: "Slug must contain only lowercase letters, numbers, and hyphens",
  }),
})
