import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, FlaskConical, X, Check, AlertCircle } from 'lucide-react';
import { useSubjectStore } from '../stores/useSubjectStore';

interface SubjectFormData {
	name: string;
	code: string;
	type: 'lecture' | 'lab';
}

interface AddSubjectModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSuccess: () => void;
}

const AddSubjectModal: React.FC<AddSubjectModalProps> = ({
	isOpen,
	onClose,
	onSuccess,
}) => {
	// const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<string>('');
	const [success, setSuccess] = useState<boolean>(false);

	const [formData, setFormData] = useState<SubjectFormData>({
		name: '',
		code: '',
		type: 'lecture',
	});

	const { addSubject, loading } = useSubjectStore();
	const [focusedField, setFocusedField] = useState<string | null>(null);

	const handleSubmit = async (e: React.SubmitEvent) => {
		e.preventDefault();
		setError('');
		setSuccess(false);

		if (!formData.name.trim() || !formData.code.trim()) {
			setError('Please fill in all fields');
			return;
		}

		try {
			await addSubject(formData);

			setSuccess(true);

			// Reset form
			setFormData({
				name: '',
				code: '',
				type: 'lecture',
			});

			// Close modal and refresh subjects after 1 second
			setTimeout(() => {
				onSuccess();
				onClose();
				setSuccess(false);
			}, 1000);
		} catch (err: any) {
			console.error('Error creating subject:', err);
			setError(
				err.response?.data?.message ||
					'Failed to create subject. Please try again.',
			);
		} finally {
			// setLoading(false);
		}
	};

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
	) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
		setError('');
	};

	const handleClose = () => {
		if (!loading) {
			setFormData({
				name: '',
				code: '',
				type: 'lecture',
			});
			setError('');
			setSuccess(false);
			onClose();
		}
	};

	return (
		<AnimatePresence>
			{isOpen && (
				<>
					{/* Backdrop */}
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						onClick={handleClose}
						className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
					/>

					{/* Modal */}
					<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
						<motion.div
							initial={{ opacity: 0, scale: 0.95, y: 20 }}
							animate={{ opacity: 1, scale: 1, y: 0 }}
							exit={{ opacity: 0, scale: 0.95, y: 20 }}
							transition={{ type: 'spring', stiffness: 300, damping: 30 }}
							className="w-full max-w-2xl bg-linear-to-br from-zinc-900 to-black border border-zinc-800 rounded-2xl shadow-2xl relative overflow-hidden">
							{/* Shine effect */}
							<motion.div
								className="absolute inset-0 bg-linear-to-r from-transparent via-amber-500/10 to-transparent"
								animate={{
									x: ['-100%', '100%'],
								}}
								transition={{
									duration: 3,
									repeat: Infinity,
									ease: 'linear',
									repeatDelay: 2,
								}}
							/>

							<div className="relative z-10">
								{/* Header */}
								<div className="flex items-center justify-between p-6 border-b border-zinc-800">
									<div>
										<h2 className="text-2xl font-light text-white mb-1">
											Add New Subject
										</h2>
										<p className="text-sm text-zinc-400">
											Create a subject to track attendance
										</p>
									</div>
									<button
										onClick={handleClose}
										disabled={loading}
										className="p-2 hover:bg-zinc-800 rounded-lg transition disabled:opacity-50">
										<X className="w-5 h-5 text-zinc-400" />
									</button>
								</div>

								{/* Content */}
								<div className="p-6 max-h-[70vh] overflow-y-auto">
									{/* Success Message */}
									<AnimatePresence>
										{success && (
											<motion.div
												initial={{ opacity: 0, y: -20 }}
												animate={{ opacity: 1, y: 0 }}
												exit={{ opacity: 0, y: -20 }}
												className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg flex items-center gap-3">
												<Check className="w-5 h-5 text-green-500" />
												<div>
													<p className="text-green-400 font-medium">
														Subject created successfully!
													</p>
												</div>
											</motion.div>
										)}
									</AnimatePresence>

									{/* Error Message */}
									<AnimatePresence>
										{error && (
											<motion.div
												initial={{ opacity: 0, y: -20 }}
												animate={{ opacity: 1, y: 0 }}
												exit={{ opacity: 0, y: -20 }}
												className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-3">
												<AlertCircle className="w-5 h-5 text-red-500" />
												<p className="text-red-400">{error}</p>
											</motion.div>
										)}
									</AnimatePresence>

									<form
										onSubmit={handleSubmit}
										className="space-y-6">
										{/* Subject Type Selection */}
										<div>
											<label className="block text-sm font-medium text-zinc-400 mb-3">
												Subject Type
											</label>
											<div className="grid grid-cols-2 gap-4">
												<motion.button
													type="button"
													onClick={() =>
														setFormData((prev) => ({
															...prev,
															type: 'lecture',
														}))
													}
													whileHover={{ scale: 1.02 }}
													whileTap={{ scale: 0.98 }}
													className={`p-6 rounded-xl border-2 transition-all ${
														formData.type === 'lecture'
															? 'bg-amber-500/10 border-amber-500 text-amber-400'
															: 'bg-zinc-950/50 border-zinc-800 text-zinc-400 hover:border-amber-500/50'
													}`}>
													<BookOpen
														className={`w-8 h-8 mx-auto mb-3 ${
															formData.type === 'lecture'
																? 'text-amber-500'
																: 'text-zinc-500'
														}`}
													/>
													<div className="font-medium">Lecture</div>
													<div className="text-xs text-zinc-500 mt-1">
														Theory class
													</div>
												</motion.button>

												<motion.button
													type="button"
													onClick={() =>
														setFormData((prev) => ({ ...prev, type: 'lab' }))
													}
													whileHover={{ scale: 1.02 }}
													whileTap={{ scale: 0.98 }}
													className={`p-6 rounded-xl border-2 transition-all ${
														formData.type === 'lab'
															? 'bg-purple-500/10 border-purple-500 text-purple-400'
															: 'bg-zinc-950/50 border-zinc-800 text-zinc-400 hover:border-purple-500/50'
													}`}>
													<FlaskConical
														className={`w-8 h-8 mx-auto mb-3 ${
															formData.type === 'lab'
																? 'text-purple-500'
																: 'text-zinc-500'
														}`}
													/>
													<div className="font-medium">Lab</div>
													<div className="text-xs text-zinc-500 mt-1">
														Practical class
													</div>
												</motion.button>
											</div>
										</div>

										{/* Subject Name */}
										<div className="relative">
											<label
												htmlFor="name"
												className="block text-sm font-medium text-zinc-400 mb-2">
												Subject Name
											</label>
											<input
												type="text"
												id="name"
												name="name"
												value={formData.name}
												onChange={handleChange}
												onFocus={() => setFocusedField('name')}
												onBlur={() => setFocusedField(null)}
												placeholder="e.g., Data Structures and Algorithms"
												required
												className="w-full px-4 py-3 rounded-lg bg-zinc-950/50 border border-zinc-800 text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500 transition-all duration-300"
											/>
											{focusedField === 'name' && (
												<motion.div
													layoutId="modal-focus-glow"
													className="absolute inset-0 rounded-lg bg-linear-to-r from-amber-500/20 to-yellow-500/20 -z-10 blur-md"
													transition={{
														type: 'spring',
														stiffness: 300,
														damping: 30,
													}}
												/>
											)}
										</div>

										{/* Subject Code */}
										<div className="relative">
											<label
												htmlFor="code"
												className="block text-sm font-medium text-zinc-400 mb-2">
												Subject Code
											</label>
											<input
												type="text"
												id="code"
												name="code"
												value={formData.code}
												onChange={handleChange}
												onFocus={() => setFocusedField('code')}
												onBlur={() => setFocusedField(null)}
												placeholder="e.g., DSA, CS201"
												required
												className="w-full px-4 py-3 rounded-lg bg-zinc-950/50 border border-zinc-800 text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500 transition-all duration-300 uppercase"
												style={{ textTransform: 'uppercase' }}
											/>
											{focusedField === 'code' && (
												<motion.div
													layoutId="modal-focus-glow"
													className="absolute inset-0 rounded-lg bg-linear-to-r from-amber-500/20 to-yellow-500/20 -z-10 blur-md"
													transition={{
														type: 'spring',
														stiffness: 300,
														damping: 30,
													}}
												/>
											)}
											<p className="mt-2 text-xs text-zinc-500">
												Short code for easy identification
											</p>
										</div>

										{/* Preview Card */}
										<div className="mt-8 p-6 bg-zinc-950/50 border border-zinc-800 rounded-xl">
											<p className="text-xs text-zinc-500 mb-3 uppercase tracking-wide">
												Preview
											</p>
											<div className="flex items-center gap-4">
												<div
													className={`p-3 rounded-xl border ${
														formData.type === 'lab'
															? 'bg-purple-500/10 border-purple-500/20'
															: 'bg-amber-500/10 border-amber-500/20'
													}`}>
													{formData.type === 'lab' ? (
														<FlaskConical className="w-6 h-6 text-purple-500" />
													) : (
														<BookOpen className="w-6 h-6 text-amber-500" />
													)}
												</div>
												<div className="flex-1">
													<h3 className="text-lg font-medium text-white">
														{formData.name || 'Subject Name'}
													</h3>
													<p className="text-sm text-zinc-500 font-mono">
														{formData.code.toUpperCase() || 'CODE'}
													</p>
												</div>
												<span
													className={`px-3 py-1 rounded-full text-xs font-medium ${
														formData.type === 'lab'
															? 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
															: 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
													}`}>
													{formData.type.toUpperCase()}
												</span>
											</div>
										</div>

										{/* Submit Buttons */}
										<div className="flex gap-4 pt-4">
											<button
												type="button"
												onClick={handleClose}
												disabled={loading}
												className="flex-1 px-6 py-3 bg-zinc-950/50 border border-zinc-800 text-white rounded-lg hover:border-amber-500/50 transition disabled:opacity-50">
												Cancel
											</button>
											<motion.button
												type="submit"
												disabled={loading || success}
												whileHover={{ scale: loading || success ? 1 : 1.02 }}
												whileTap={{ scale: loading || success ? 1 : 0.98 }}
												className="flex-1 px-6 py-3 bg-linear-to-r from-amber-500 to-yellow-600 text-black font-medium rounded-lg hover:opacity-90 transition disabled:opacity-50 relative overflow-hidden">
												{/* Button shine effect */}
												<motion.div
													className="absolute inset-0 bg-linear-to-r from-transparent via-white/30 to-transparent"
													animate={{
														x: loading ? ['-100%', '100%'] : '-100%',
													}}
													transition={{
														duration: 1.5,
														repeat: loading ? Infinity : 0,
														ease: 'linear',
													}}
												/>

												<span className="relative flex items-center justify-center gap-2">
													{loading ? (
														<>
															<motion.div
																animate={{ rotate: 360 }}
																transition={{
																	duration: 1,
																	repeat: Infinity,
																	ease: 'linear',
																}}
																className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full"
															/>
															<span>Creating...</span>
														</>
													) : success ? (
														<>
															<Check className="w-5 h-5" />
															<span>Created!</span>
														</>
													) : (
														'Create Subject'
													)}
												</span>
											</motion.button>
										</div>
									</form>
								</div>
							</div>
						</motion.div>
					</div>
				</>
			)}
		</AnimatePresence>
	);
};

export default AddSubjectModal;
