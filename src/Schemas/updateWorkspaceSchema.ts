import { z } from 'zod'

export const updateWorkspaceSchema = z.object({
  name: z.string().min(3),
})
