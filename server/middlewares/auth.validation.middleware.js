import Joi from 'joi';
export const signupvalidation = (req, res, next) => {
	const schema = Joi.object({
		name: Joi.string().min(3).max(30).required(),
		email: Joi.string().email().required(),
		password: Joi.string().min(6).max(20).required(),
		confirmPassword: Joi.string().valid(Joi.ref('password')).required(),
	});
	const { error } = schema.validate(req.body);
	if (error) {
		return res.status(400).json({ message: error.message });
	}
	next();
};
export const loginvalidation = (req, res, next) => {
	const schema = Joi.object({
		email: Joi.string().email().required(),
		password: Joi.string().min(6).max(20).required(),
	});
	const { error } = schema.validate(req.body);
	if (error) {
		return res.status(400).json({ message: error.message });
	}
	next();
};
