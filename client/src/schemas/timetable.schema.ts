import { z } from 'zod';

export const SubjectSchema = z.object({
	_id: z.string(),
	userId: z.string(),
	name: z.string(),
	code: z.string(),
	type: z.enum(['lecture', 'lab']),
	createdAt: z.string(),
	updatedAt: z.string(),
	__v: z.number(),
});

export const TimetableSlotSchema = z.object({
	subjectId: SubjectSchema, // populated subject
	startTime: z.string(), // HH:mm
	endTime: z.string(),
});

export const DaySchema = z.array(TimetableSlotSchema);

export const TimetableSchema = z.object({
	_id: z.string(),
	userId: z.string(),
	createdAt: z.string(),
	updatedAt: z.string(),
	__v: z.number(),

	monday: DaySchema.optional(),
	tuesday: DaySchema.optional(),
	wednesday: DaySchema.optional(),
	thursday: DaySchema.optional(),
	friday: DaySchema.optional(),
	saturday: DaySchema.optional(),
	sunday: DaySchema.optional(),
});

export type Subject = z.infer<typeof SubjectSchema>;
export type TimetableSlot = z.infer<typeof TimetableSlotSchema>;
export type Timetable = z.infer<typeof TimetableSchema>;
