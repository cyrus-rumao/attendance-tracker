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


export const AddsubjectSchema = z.object({
  name: z.string().min(1, "Name is required"),
  code: z.string().min(1, "Code is required"),
  type: z.enum(['lecture', 'lab'], "Type must be either 'lecture' or 'lab'"),
});
export type AddSubjectInput = z.infer<typeof AddsubjectSchema>;
export type Subject = z.infer<typeof SubjectSchema>;
