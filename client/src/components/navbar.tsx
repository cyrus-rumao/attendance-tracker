import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/useAuthStore';
import type { JSX } from 'react';

export default function Navbar(): JSX.Element {
	const { user, logout } = useAuthStore();
	const navigate = useNavigate();

  const handleLogout = async (): Promise<void> => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

	return (
		<nav className="fixed top-0 left-0 w-full h-16 px-8 flex items-center justify-between bg-black/40 backdrop-blur-md border-b border-amber-900/30 z-50">
			{/* Brand - Subtle Gold Gradient Text */}
			<Link
				to="/"
				className="text-xl font-bold tracking-tighter bg-linear-to-r from-amber-200 via-amber-500 to-amber-200 bg-clip-text text-transparent hover:opacity-80 transition">
				ATTENDANCE<span className="font-light">TRKR</span>
			</Link>

			{/* Right side */}
			<div className="flex items-center gap-8">
				{!user ? (
					<>
						<Link
							to="/login"
							className="text-sm font-medium text-amber-100/70 hover:text-amber-200 transition tracking-wide">
							Login
						</Link>

						<Link
							to="/signup"
							className="text-sm font-semibold px-5 py-2 rounded-full bg-amber-600 text-black hover:bg-amber-500 hover:shadow-[0_0_15px_rgba(217,119,6,0.4)] transition-all duration-300">
							Join Now
						</Link>
					</>
				) : (
					<>
						<div className="flex flex-col items-end leading-none">
							
							<span className="text-sm font-medium text-amber-100">
								{user.name}
							</span>
						</div>

						<button
							onClick={handleLogout}
							className="text-xs font-bold uppercase tracking-widest px-4 py-2 rounded border border-amber-900/50 text-amber-500 hover:bg-amber-500/10 hover:border-amber-500 transition-all">
							Sign Out
						</button>
					</>
				)}
			</div>
		</nav>
	);
};

