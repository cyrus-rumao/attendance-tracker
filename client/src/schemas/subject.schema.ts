import { z } from 'zod';
export const SubjectSchema = z.object({
	_id: z.string(),
	userId: z.string(),
	name: z.string(),
	code: z.string(),
	type: z.enum(['lecture', 'lab','break'], "Type must be either 'lecture', 'lab' or 'break'"),
	createdAt: z.string(),
	updatedAt: z.string(),
	__v: z.number(),
});

export const AddsubjectSchema = z.object({
	name: z.string().min(1, 'Name is required'),
	code: z.string().min(1, 'Code is required'),
	type: z.enum(['lecture', 'lab','break'], "Type must be either 'lecture', 'lab' or 'break'"),
});

export const SubjectAnalyticsSchema = z.object({
	totalConductedHours: z.number(),
	attendedHours: z.number(),
	absentHours: z.number(),
	bunkedHours: z.number(),
	attendancePercentage: z.number(),
	weeklyScheduledHours: z.number(),
	minimumRequiredFor75Percent: z.number(),
	safeBunkHours: z.number(),
	hoursNeededToReach75Percent: z.number(),
});

export const SubjectDetailSchema = z.object({
	subject: SubjectSchema,
	analytics: SubjectAnalyticsSchema,
});

export type SubjectAnalytics = z.infer<typeof SubjectAnalyticsSchema>;
export type SubjectDetail = z.infer<typeof SubjectDetailSchema>;
export type AddSubjectInput = z.infer<typeof AddsubjectSchema>;
export type Subject = z.infer<typeof SubjectSchema>;
