import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
	Calendar,
	Bell,
	TrendingUp,
	BarChart3,
	Smartphone,
	Target,
} from 'lucide-react';
import img from '../assets/main.png';

interface SectionProps {
	title: string;
	description: string;
	imagePosition?: 'left' | 'right';
	imageSrc?: string;
	imageAlt: string;
	children?: React.ReactNode;
	darkBg?: boolean;
}

const Section: React.FC<SectionProps> = ({
	title,
	description,
	imagePosition = 'right',
	imageSrc = img,
	imageAlt,
	children,
	darkBg = false,
}) => {
	const ref = useRef<HTMLElement>(null);
	const { scrollYProgress: sectionProgress } = useScroll({
		target: ref,
		offset: ['start end', 'end start'],
	});

	const imageY = useTransform(sectionProgress, [0, 0.5, 1], [100, 0, -100]);
	const imageOpacity = useTransform(
		sectionProgress,
		[0, 0.3, 0.7, 1],
		[0, 1, 1, 0],
	);

	return (
		<section
			ref={ref}
			className={`min-h-screen flex items-center ${darkBg ? 'bg-black' : 'bg-zinc-950'} border-b border-zinc-900`}>
			<div className="max-w-7xl mx-auto px-8 py-20 w-full">
				<div className={`grid grid-cols-1 lg:grid-cols-2 gap-16 items-center`}>
					{/* Text Content */}
					<div className={imagePosition === 'left' ? 'lg:order-2' : ''}>
						<h2 className="text-5xl lg:text-6xl text-white mb-6 leading-tight">
							{title}
						</h2>
						<p className="text-lg text-zinc-400 leading-relaxed mb-8">
							{description}
						</p>
						{children}
					</div>

					{/* Image */}
					<motion.div
						style={{ y: imageY, opacity: imageOpacity }}
						className={`relative ${imagePosition === 'left' ? 'lg:order-1' : ''}`}>
						<div className="relative aspect-4/3 overflow-hidden rounded-2xl border border-amber-500/20 bg-zinc-900">
							<img
								src={imageSrc}
								alt={imageAlt}
								className="w-full h-full object-cover"
							/>
						</div>
						<div className="absolute -inset-1 bg-linear-to-r from-amber-500 to-yellow-600 rounded-2xl opacity-20 blur-xl -z-10" />
					</motion.div>
				</div>
			</div>
		</section>
	);
};

const Home: React.FC = () => {
	return (
		<div className="bg-black text-white">
			{/* Hero Section */}
			<section className="min-h-screen flex items-center bg-black">
				<div className="max-w-7xl mx-auto px-8 py-12 w-full">
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
						{/* Left: Text */}
						<div>
							<div className="inline-block mb-4">
								<span className="text-amber-500 text-sm font-medium tracking-wider uppercase">
									Smart Attendance Management
								</span>
							</div>

							<h1 className="text-6xl lg:text-7xl text-white mb-6 leading-tight">
								Never Miss
								<br />
								<span className="text-transparent bg-clip-text bg-linear-to-r from-amber-500 to-yellow-600">
									Attendance
								</span>
								<br />
								Again
							</h1>

							<p className="text-xl text-zinc-400 leading-relaxed mb-8 max-w-lg">
								Track your attendance in real-time. Get smart notifications.
								Know exactly where you stand and what you need to maintain 75%.
							</p>

							<div className="flex gap-4">
								<Link to="/dashboard">
									<button className="px-8 py-4 bg-linear-to-r from-amber-500 to-yellow-600 text-black font-medium rounded-lg hover:opacity-90 transition cursor-pointer">
										Start Tracking Free
									</button>
								</Link>
								<button className="px-8 py-4 border border-zinc-800 text-white font-medium rounded-lg hover:border-amber-500/50 transition">
									Watch Demo
								</button>
							</div>

							{/* Stats */}
							<div className="grid grid-cols-3 gap-8 mt-16">
								<div>
									<div className="text-3xl text-white mb-1">50K+</div>
									<div className="text-sm text-zinc-500">Active Students</div>
								</div>
								<div>
									<div className="text-3xl text-white mb-1">500+</div>
									<div className="text-sm text-zinc-500">Institutions</div>
								</div>
								<div>
									<div className="text-3xl text-white mb-1">98%</div>
									<div className="text-sm text-zinc-500">Success Rate</div>
								</div>
							</div>
						</div>

						{/* Right: Hero Image */}
						<div className="relative">
							<div className="relative aspect-4/3 overflow-hidden rounded-2xl border border-amber-500/20 bg-zinc-900">
								<img
									src={img}
									alt="AttendX Dashboard"
									className="w-full h-full object-cover"
								/>
							</div>
							<div className="absolute -inset-1 bg-linear-to-r from-amber-500 to-yellow-600 rounded-2xl opacity-20 blur-2xl -z-10" />
						</div>
					</div>
				</div>
			</section>

			{/* Section 2: Smart Notifications */}
			<Section
				title="Hourly Reminders That Actually Work"
				description="Get notified every hour to mark your attendance. Never forget a lecture again. One tap to mark present, bunk, or absent. It's that simple."
				imagePosition="right"
				imageSrc="/images/notifications.png"
				imageAlt="Notification Interface"
				darkBg={true}>
				<div className="flex gap-4 mt-6">
					<div className="flex items-center gap-2 text-zinc-400">
						<Bell className="w-5 h-5 text-amber-500" />
						<span>Hourly Alerts</span>
					</div>
					<div className="flex items-center gap-2 text-zinc-400">
						<Smartphone className="w-5 h-5 text-amber-500" />
						<span>One-Tap Marking</span>
					</div>
				</div>
			</Section>

			{/* Section 3: Real-time Analytics */}
			<Section
				title="Know Exactly Where You Stand"
				description="Real-time attendance tracking across all subjects. See your percentage live. Get instant calculations on how many lectures you need to attend to hit 75%."
				imagePosition="left"
				imageSrc="/images/analytics.png"
				imageAlt="Analytics Dashboard">
				<div className="flex gap-4 mt-6">
					<div className="flex items-center gap-2 text-zinc-400">
						<TrendingUp className="w-5 h-5 text-amber-500" />
						<span>Live Tracking</span>
					</div>
					<div className="flex items-center gap-2 text-zinc-400">
						<BarChart3 className="w-5 h-5 text-amber-500" />
						<span>Smart Predictions</span>
					</div>
				</div>
			</Section>

			{/* Section 4: Subject Breakdown */}
			<Section
				title="Master Every Subject"
				description="Get detailed insights for each subject and lab. Identify which courses need more attention instantly. Color-coded system shows you critical subjects at a glance."
				imagePosition="right"
				imageSrc="/images/subjects.png"
				imageAlt="Subject Management"
				darkBg={true}>
				<div className="space-y-3 mt-6">
					<div className="flex items-center gap-3">
						<div className="w-2 h-2 rounded-full bg-green-500" />
						<span className="text-zinc-400">Above 75% - Safe</span>
					</div>
					<div className="flex items-center gap-3">
						<div className="w-2 h-2 rounded-full bg-amber-500" />
						<span className="text-zinc-400">70-75% - Watch Closely</span>
					</div>
					<div className="flex items-center gap-3">
						<div className="w-2 h-2 rounded-full bg-red-500" />
						<span className="text-zinc-400">Below 70% - Critical</span>
					</div>
				</div>
			</Section>

			{/* Section 5: Calendar View */}
			<Section
				title="Visual Calendar That Makes Sense"
				description="Color-coded calendar showing your entire attendance history. See patterns, bunks, and lecture days at a glance. Plan ahead and make informed decisions."
				imagePosition="left"
				imageSrc="/images/calendar.png"
				imageAlt="Calendar View">
				<div className="flex gap-4 mt-6">
					<div className="flex items-center gap-2 text-zinc-400">
						<Calendar className="w-5 h-5 text-amber-500" />
						<span>Color-Coded Days</span>
					</div>
					<div className="flex items-center gap-2 text-zinc-400">
						<Target className="w-5 h-5 text-amber-500" />
						<span>Pattern Analysis</span>
					</div>
				</div>
			</Section>

			{/* Section 6: Mobile Experience */}
			<Section
				title="Works Everywhere You Do"
				description="Mark attendance from your phone during class. View analytics on your laptop. Everything syncs seamlessly across all your devices in real-time."
				imagePosition="right"
				imageSrc="/images/mobile.png"
				imageAlt="Mobile App"
				darkBg={true}>
				<div className="grid grid-cols-2 gap-4 mt-6">
					<div className="p-4 border border-zinc-800 rounded-lg">
						<div className="text-amber-500 font-medium mb-1">iOS & Android</div>
						<div className="text-sm text-zinc-500">Native apps</div>
					</div>
					<div className="p-4 border border-zinc-800 rounded-lg">
						<div className="text-amber-500 font-medium mb-1">Web Dashboard</div>
						<div className="text-sm text-zinc-500">Desktop access</div>
					</div>
				</div>
			</Section>

			{/* Final CTA Section */}
			<section className="min-h-screen flex items-center bg-zinc-950">
				<div className="max-w-4xl mx-auto px-8 py-20 text-center">
					<div>
						<h2 className="text-5xl lg:text-6xl text-white mb-6 leading-tight">
							Ready to take control of your
							<br />
							<span className="text-transparent bg-clip-text bg-linear-to-r from-amber-500 to-yellow-600">
								attendance?
							</span>
						</h2>
						<p className="text-xl text-zinc-400 leading-relaxed mb-12 max-w-2xl mx-auto">
							Join 50,000+ students who never worry about attendance shortage
							anymore.
						</p>
						<div className="flex flex-col sm:flex-row gap-4 justify-center">
							<Link to="/signup">
								<button className="px-10 py-5 bg-linear-to-r from-amber-500 to-yellow-600 text-black font-medium rounded-lg text-lg hover:opacity-90 transition cursor-pointer">
									Start Tracking Free
								</button>
							</Link>
							<button className="px-10 py-5 border border-zinc-800 text-white font-medium rounded-lg text-lg hover:border-amber-500/50 transition">
								Schedule Demo
							</button>
						</div>
						<p className="text-zinc-500 mt-8 text-sm">
							No credit card required • Free forever for students
						</p>
					</div>
				</div>
			</section>
		</div>
	);
};

export default Home;
