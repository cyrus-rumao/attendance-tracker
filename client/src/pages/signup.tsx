import { useState } from 'react';
import { useAuthStore } from '../stores/useAuthStore';
import { Link } from 'react-router-dom';
import {
	UserPlus,
	ArrowRight,
	Eye,
	EyeOff,
	CheckCircle2,
	XCircle,
} from 'lucide-react';

interface SignupForm {
	name: string;
	email: string;
	password: string;
	confirmPassword: string;
}

export default function Signup() {
	const { signup, loading } = useAuthStore();

	const [form, setForm] = useState<SignupForm>({
		name: '',
		email: '',
		password: '',
		confirmPassword: '',
	});

	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);

	const passwordsMatch =
		form.password &&
		form.confirmPassword &&
		form.password === form.confirmPassword;

	const passwordsDontMatch =
		form.confirmPassword && form.password !== form.confirmPassword;

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		await signup(form);
	};

	return (
		<div className="h-[90vh] flex items-center justify-center bg-black relative overflow-hidden">
			{/* Background blobs */}
			<div
				className="absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl
                      bg-linear-to-br from-yellow-600/20 to-amber-600/20"
			/>
			<div
				className="absolute bottom-0 left-0 w-96 h-96 rounded-full blur-3xl
                      bg-linear-to-tr from-amber-600/20 to-yellow-600/20"
			/>

			{/* Card wrapper */}
			<div className="w-full max-w-md p-8 relative z-10">
				{/* Glow */}
				<div
					className="absolute inset-0 rounded-2xl blur-2xl -z-10
                        bg-linear-to-b from-yellow-600/20 to-amber-600/20"
				/>

				{/* Card */}
				<div
					className="relative overflow-hidden rounded-2xl
                        bg-linear-to-b from-zinc-900 to-black
                        border border-yellow-600/30
                        shadow-[0_0_60px_rgba(234,179,8,0.15)]
                        backdrop-blur-xl">
					{/* Subtle shine */}
					<div
						className="pointer-events-none absolute inset-0
                          bg-linear-to-r from-transparent via-yellow-500/10 to-transparent
                          opacity-40"
					/>

					<div className="relative z-10 p-8">
						{/* Header */}
						<div className="flex justify-center mb-4">
							<div
								className="p-3 rounded-2xl border border-yellow-500/30
                              bg-linear-to-br from-yellow-500/20 to-amber-600/20">
								<UserPlus className="w-8 h-8 text-yellow-400" />
							</div>
						</div>

						<h1
							className="text-3xl font-bold text-transparent bg-clip-text
                           bg-linear-to-r from-yellow-400 to-amber-500
                           text-center mb-2">
							Create Account
						</h1>

						<p className="text-sm text-zinc-400 text-center mb-8">
							Start tracking attendance before it tracks you
						</p>

						<form
							onSubmit={handleSubmit}
							className="space-y-4">
							<input
								type="text"
								placeholder="Name"
								required
								className="w-full px-4 py-3 rounded-lg bg-zinc-950/50
                           border border-zinc-800 text-white placeholder-zinc-500
                           focus:outline-none focus:border-yellow-500 transition"
								value={form.name}
								onChange={(e) => setForm({ ...form, name: e.target.value })}
							/>

							<input
								type="email"
								placeholder="Email"
								required
								className="w-full px-4 py-3 rounded-lg bg-zinc-950/50
                           border border-zinc-800 text-white placeholder-zinc-500
                           focus:outline-none focus:border-yellow-500 transition"
								value={form.email}
								onChange={(e) => setForm({ ...form, email: e.target.value })}
							/>

							<div className="relative">
								<input
									type={showPassword ? 'text' : 'password'}
									placeholder="Password"
									required
									className="w-full px-4 py-3 pr-12 rounded-lg bg-zinc-950/50
                             border border-zinc-800 text-white placeholder-zinc-500
                             focus:outline-none focus:border-yellow-500 transition"
									value={form.password}
									onChange={(e) =>
										setForm({ ...form, password: e.target.value })
									}
								/>
								<button
									type="button"
									onClick={() => setShowPassword(!showPassword)}
									className="absolute right-3 top-1/2 -translate-y-1/2
                             text-zinc-400 hover:text-yellow-400 transition">
									{showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
								</button>
							</div>

							<div className="relative">
								<input
									type={showConfirmPassword ? 'text' : 'password'}
									placeholder="Confirm Password"
									required
									className="w-full px-4 py-3 pr-12 rounded-lg bg-zinc-950/50
                             border border-zinc-800 text-white placeholder-zinc-500
                             focus:outline-none focus:border-yellow-500 transition"
									value={form.confirmPassword}
									onChange={(e) =>
										setForm({ ...form, confirmPassword: e.target.value })
									}
								/>
								<button
									type="button"
									onClick={() => setShowConfirmPassword(!showConfirmPassword)}
									className="absolute right-3 top-1/2 -translate-y-1/2
                             text-zinc-400 hover:text-yellow-400 transition">
									{showConfirmPassword ? (
										<Eye size={20} />
									) : (
										<EyeOff size={20} />
									)}
								</button>
							</div>

							{form.confirmPassword && (
								<div className="flex items-center gap-2 text-sm">
									{passwordsMatch ? (
										<>
											<CheckCircle2 className="w-4 h-4 text-green-500" />
											<span className="text-green-500">Passwords match</span>
										</>
									) : passwordsDontMatch ? (
										<>
											<XCircle className="w-4 h-4 text-red-500" />
											<span className="text-red-500">
												Passwords don’t match
											</span>
										</>
									) : null}
								</div>
							)}

							<button
								type="submit"
								disabled={loading}
								className="group w-full py-3 rounded-lg font-semibold text-black
                           bg-linear-to-r from-yellow-400 to-amber-500
                           hover:from-yellow-500 hover:to-amber-600
                           shadow-lg shadow-yellow-500/20
                           disabled:opacity-60 transition">
								<span className="flex items-center justify-center gap-2">
									{loading ? (
										'Creating account…'
									) : (
										<>
											Sign Up
											<ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
										</>
									)}
								</span>
							</button>
						</form>

						<p className="text-sm text-zinc-400 text-center mt-6">
							Already have an account?{' '}
							<Link
								to="/login"
								className="text-yellow-400 hover:text-yellow-300 transition">
								Login
							</Link>
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}
