import { z } from "zod"

export const eventSchema = z
  .object({
    // Basic info
    name: z.string().min(3, "Event title must be at least 3 characters long"),
   
description: z
      .string()
      .min(3, "Event description must be at least 10 characters long")
      .max(5000, "Event description must not exceed 5000 characters"),
       location: z.string().min(3, "Location is required"),
    // Dates
    startDate: z.string().nonempty("Event start date is required"),
    endDate: z.string().nonempty("Event end date is required"),
    registrationStartDate: z.string().nonempty("Registration start date is required"),
    registrationEndDate: z.string().nonempty("Registration end date is required"),

    // Optional fields
   
    bannerUrl: z.string().nullable().optional(),
    // Participation
    eventType: z.enum(["SOLO", "TEAM", "SOLO_AND_TEAM"]),
    minTeamSize: z.number().optional(),
    maxTeamSize: z.number().optional(),
  linkTitle: z.string().optional().or(z.literal("")),
  linkUrl: z
    .string()
    .url("Invalid URL format")
    .optional()
    .or(z.literal("")), 
  })

  // ✅ 1. Event start/end validation
  .refine((data) => new Date(data.startDate) <= new Date(data.endDate), {
    message: "Event start date cannot be after event end date",
    path: ["startDate"],
  })

  // ✅ 2. Registration period validation
  .refine(
    (data) =>
      new Date(data.registrationStartDate) <= new Date(data.registrationEndDate),
    {
      message: "Registration start cannot be after registration end",
      path: ["registrationStartDate"],
    }
  )

  // ✅ 3. Registration ends before event starts
  .refine(
    (data) => new Date(data.registrationEndDate) < new Date(data.startDate),
    {
      message: "Registration must end before the event starts",
      path: ["registrationEndDate"],
    }
  )

  // ✅ 4. Team size logic (if eventType is TEAM or SOLO_AND_TEAM)
  .superRefine((data, ctx) => {
    if (data.eventType === "TEAM" || data.eventType === "SOLO_AND_TEAM") {
      if (data.minTeamSize && data.minTeamSize < 2) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["minTeamSize"],
          message: "Minimum team size must be at least 2",
        })
      }
      if (
        data.maxTeamSize &&
        data.minTeamSize &&
        data.maxTeamSize < data.minTeamSize
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["maxTeamSize"],
          message: "Maximum team size must be greater than or equal to minimum",
        })
      }
    }
  })
