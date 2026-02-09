import { useState } from 'react';
import { useAuthStore } from '../stores/useAuthStore';
import { Link } from 'react-router-dom';
import { Eye, EyeOff, Sparkles, ArrowRight } from 'lucide-react';

interface LoginForm {
	email: string;
	password: string;
}

export default function Login() {
	const { login, loading } = useAuthStore();
	// const navigate = useNavigate();

	const [form, setForm] = useState<LoginForm>({
		email: '',
		password: '',
	});

	const [showPassword, setShowPassword] = useState(false);

	const handleSubmit = async (e: React.SubmitEvent) => {
		e.preventDefault();
		await login({
			email: form.email,
			password: form.password,
		});
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
				{/* Glow behind card */}
				<div
					className="absolute inset-0 rounded-2xl blur-2xl -z-10
				                bg-linear-to-b from-yellow-600/20 to-amber-600/20"
				/>

				{/* Card */}
				<div
					className="relative overflow-hidden rounded-2xl
				                bg-linear-to-b from-zinc-900 to-black
				                border border-yellow-600/30
				                shadow-[0_0_60px_rgba(234,179,8,0.18)]
				                backdrop-blur-xl">
					{/* Subtle shine */}
					<div
						className="pointer-events-none absolute inset-0
					                bg-linear-to-r from-transparent via-yellow-500/10 to-transparent
					                opacity-40"
					/>

					<div className="relative z-10 p-8">
						{/* Icon */}
						<div className="flex justify-center mb-4">
							<div
								className="p-3 rounded-2xl border border-yellow-500/30
							                bg-linear-to-br from-yellow-500/20 to-amber-600/20">
								<Sparkles className="w-8 h-8 text-yellow-400" />
							</div>
						</div>

						<h1
							className="text-3xl font-bold text-transparent bg-clip-text
						               bg-linear-to-r from-yellow-400 to-amber-500
						               text-center mb-2">
							Welcome Back
						</h1>

						<p className="text-sm text-zinc-400 text-center mb-8">
							Log in and face your attendance reality
						</p>

						<form
							onSubmit={handleSubmit}
							className="space-y-5">
							<input
								type="email"
								placeholder="Email"
								required
								className="w-full px-4 py-3 rounded-lg
								           bg-zinc-950/50 border border-zinc-800
								           text-white placeholder-zinc-500
								           focus:outline-none focus:border-yellow-500
								           focus:ring-2 focus:ring-yellow-500/30 transition"
								value={form.email}
								onChange={(e) => setForm({ ...form, email: e.target.value })}
							/>

							<div className="relative">
								<input
									type={showPassword ? 'text' : 'password'}
									placeholder="Password"
									required
									className="w-full px-4 py-3 pr-12 rounded-lg
									           bg-zinc-950/50 border border-zinc-800
									           text-white placeholder-zinc-500
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

							<button
								type="submit"
								disabled={loading}
								className="group w-full py-3 rounded-lg font-semibold text-black
								           bg-linear-to-r from-yellow-400 to-amber-500
								           hover:from-yellow-500 hover:to-amber-600
								           shadow-lg shadow-yellow-500/30
								           disabled:opacity-60 transition">
								<span className="flex items-center justify-center gap-2">
									{loading ? (
										'Logging in…'
									) : (
										<>
											Login
											<ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
										</>
									)}
								</span>
							</button>
						</form>

						<p className="text-sm text-zinc-400 text-center mt-6">
							New here?{' '}
							<Link
								to="/signup"
								className="text-yellow-400 hover:text-yellow-300 transition">
								Create an account
							</Link>
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}
