const { z } = require('zod');

const appointmentSchema = z.object({
  animal_id: z.number().int(),
  owner_id: z.number().int(),
  appointment_date: z.string().min(1),
  appointment_time: z.string().min(1).optional(),
  service_type: z.string().min(3),
  assigned_to: z.number().int().optional(),
  status: z.string().optional(),
  priority: z.string().optional(),
  notes: z.string().optional(),
  wait_minutes: z.number().int().optional(),
  follow_up_required: z.boolean().optional()
});

module.exports = {
  appointmentSchema,
};
