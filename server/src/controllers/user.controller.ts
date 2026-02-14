import { Request, Response } from 'express';
export const markPresent = async (
	req: Request,
	res: Response,
): Promise<Response> => {
	return res.json({ message: 'Marked present' });
};
export const markAbsent = async (
	req: Request,
	res: Response,
): Promise<Response> => {
	return res.json({ message: 'Marked absent' });
};
export const markLate  = async (
	req: Request,
	res: Response,
): Promise<Response> => {
	return res.json({ message: 'Marked late' });
};