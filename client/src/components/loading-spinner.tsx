import type { JSX } from 'react';

export default function LoadingSpinner(): JSX.Element {
	return (
		<div className="fixed inset-0 flex items-center justify-center bg-black z-50">
			<div className="relative">
				{/* Outer glow ring */}
				<div className="w-20 h-20 rounded-full border-4 border-yellow-500/30 animate-pulse" />

				{/* Spinning ring */}
				<div className="absolute top-0 left-0 w-20 h-20 rounded-full border-4 border-t-yellow-400 border-r-yellow-500 border-b-yellow-600 border-l-transparent animate-spin shadow-[0_0_25px_rgba(234,179,8,0.6)]" />

				{/* Center dot */}
				<div className="absolute inset-0 flex items-center justify-center">
					<div className="w-3 h-3 rounded-full bg-yellow-400 shadow-[0_0_15px_rgba(234,179,8,0.9)]" />
				</div>
			</div>
		</div>
	);
}
