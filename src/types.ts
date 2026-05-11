import { z } from 'zod';

export const tripSchema = z.object({
  id: z.string().optional(),
  destination: z.object({
    name: z.string(),
    lat: z.number(),
    lng: z.number(),
  }),
  startDate: z.date({
    required_error: "Sayohat boshlanish sanasi talab qilinadi.",
  }),
  endDate: z.date({
    required_error: "Sayohat tugash sanasi talab qilinadi.",
  }),
  notes: z.string().optional(),
});

export type Trip = z.infer<typeof tripSchema>;
