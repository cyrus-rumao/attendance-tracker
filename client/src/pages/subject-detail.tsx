import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import {
	ArrowLeft,
	BookOpen,
	FlaskConical,
	Calendar,
	TrendingUp,
	TrendingDown,
	AlertCircle,
	CheckCircle,
	Clock,
	Target,
	BarChart3,
} from 'lucide-react';
import axios from '../lib/axios';

interface Subject {
	_id: string;
	userId: string;
	name: string;
	code: string;
	type: 'lecture' | 'lab';
	createdAt: string;
	updatedAt: string;
	__v: number;
}

interface Analytics {
	totalConductedHours: number;
	attendedHours: number;
	absentHours: number;
	bunkedHours: number;
	attendancePercentage: number;
	weeklyScheduledHours: number;
	minimumRequiredFor75Percent: number;
	safeBunkHours: number;
	hoursNeededToReach75Percent: number;
}

interface SubjectData {
	subject: Subject;
	analytics: Analytics;
}

const SubjectDetail: React.FC = () => {
	const { subjectId } = useParams<{ subjectId: string }>();
	const navigate = useNavigate();

	const [data, setData] = useState<SubjectData | null>(null);
	const [loading, setLoading] = useState<boolean>(true);

	useEffect(() => {
		const fetchData = async () => {
			try {
				setLoading(true);
				const response = await axios.get(`/subjects/${subjectId}/analytics`);
				setData(response.data);
			} catch (error) {
				console.error('Error fetching subject details:', error);
			} finally {
				setLoading(false);
			}
		};

		if (subjectId) {
			fetchData();
		}
	}, [subjectId]);

	const getAttendanceColor = (percentage: number): string => {
		if (percentage >= 75) return 'text-green-400';
		if (percentage >= 70) return 'text-yellow-400';
		return 'text-red-400';
	};

	const getAttendanceStatus = (percentage: number): string => {
		if (percentage >= 75) return 'Safe';
		if (percentage >= 70) return 'Warning';
		return 'Critical';
	};

	const getProgressBarColor = (percentage: number): string => {
		if (percentage >= 75)
			return 'bg-gradient-to-r from-green-500 to-emerald-500';
		if (percentage >= 70)
			return 'bg-gradient-to-r from-yellow-500 to-amber-500';
		return 'bg-gradient-to-r from-red-500 to-rose-500';
	};

	if (loading) {
		return (
			<div className="min-h-screen bg-black text-white flex items-center justify-center">
				<div className="text-center">
					<motion.div
						animate={{ rotate: 360 }}
						transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
						className="w-12 h-12 border-4 border-zinc-800 border-t-amber-500 rounded-full mx-auto mb-4"
					/>
					<p className="text-zinc-500">Loading subject details...</p>
				</div>
			</div>
		);
	}

	if (!data) {
		return (
			<div className="min-h-screen bg-black text-white flex items-center justify-center">
				<div className="text-center">
					<AlertCircle className="w-16 h-16 text-zinc-700 mx-auto mb-4" />
					<h3 className="text-2xl font-light text-white mb-2">
						Subject not found
					</h3>
					<button
						onClick={() => navigate('/timetable')}
						className="text-amber-400 hover:text-amber-300 transition"
					>
						Go back to timetable
					</button>
				</div>
			</div>
		);
	}

	const { subject, analytics } = data;
	const isLab = subject.type === 'lab';

	return (
		<div className="min-h-screen bg-black text-white">
			{/* Header */}
			<div className="border-b border-zinc-900 bg-zinc-950/50 backdrop-blur-xl">
				<div className="max-w-7xl mx-auto px-8 py-6">
					<button
						onClick={() => navigate('/timetable')}
						className="flex items-center gap-2 text-zinc-400 hover:text-amber-400 transition mb-4"
					>
						<ArrowLeft className="w-5 h-5" />
						Back to Timetable
					</button>

					<div className="flex items-start gap-4">
						<div
							className={`p-4 rounded-2xl border ${
								isLab
									? 'bg-purple-500/10 border-purple-500/20'
									: 'bg-amber-500/10 border-amber-500/20'
							}`}
						>
							{isLab ? (
								<FlaskConical className="w-8 h-8 text-purple-400" />
							) : (
								<BookOpen className="w-8 h-8 text-amber-400" />
							)}
						</div>
						<div className="flex-1">
							<div className="flex items-center gap-3 mb-2">
								<h1 className="text-4xl font-light text-white">
									{subject.name}
								</h1>
								<span
									className={`px-3 py-1 rounded-full text-xs font-medium ${
										isLab
											? 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
											: 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
									}`}
								>
									{subject.type.toUpperCase()}
								</span>
							</div>
							<p className="text-zinc-400 font-mono text-lg">{subject.code}</p>
						</div>
					</div>
				</div>
			</div>

			{/* Main Content */}
			<div className="max-w-7xl mx-auto px-8 py-12">
				{/* Stats Overview Grid */}
				<div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
					<div className="bg-gradient-to-br from-zinc-900 to-black border border-zinc-800 rounded-xl p-4">
						<div className="flex items-center gap-2 text-zinc-400 text-sm mb-2">
							<BarChart3 className="w-4 h-4" />
							<span>Total Conducted</span>
						</div>
						<div className="text-3xl font-light text-white">
							{analytics.totalConductedHours}
						</div>
						<div className="text-xs text-zinc-500 mt-1">hours</div>
					</div>

					<div className="bg-gradient-to-br from-zinc-900 to-black border border-zinc-800 rounded-xl p-4">
						<div className="flex items-center gap-2 text-zinc-400 text-sm mb-2">
							<CheckCircle className="w-4 h-4 text-green-400" />
							<span>Attended</span>
						</div>
						<div className="text-3xl font-light text-green-400">
							{analytics.attendedHours}
						</div>
						<div className="text-xs text-zinc-500 mt-1">hours</div>
					</div>

					<div className="bg-gradient-to-br from-zinc-900 to-black border border-zinc-800 rounded-xl p-4">
						<div className="flex items-center gap-2 text-zinc-400 text-sm mb-2">
							<AlertCircle className="w-4 h-4 text-red-400" />
							<span>Absent</span>
						</div>
						<div className="text-3xl font-light text-red-400">
							{analytics.absentHours}
						</div>
						<div className="text-xs text-zinc-500 mt-1">hours</div>
					</div>

					<div className="bg-gradient-to-br from-zinc-900 to-black border border-zinc-800 rounded-xl p-4">
						<div className="flex items-center gap-2 text-zinc-400 text-sm mb-2">
							<Target className="w-4 h-4 text-orange-400" />
							<span>Bunked</span>
						</div>
						<div className="text-3xl font-light text-orange-400">
							{analytics.bunkedHours}
						</div>
						<div className="text-xs text-zinc-500 mt-1">hours</div>
					</div>
				</div>

				{/* Attendance Overview */}
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
					{/* Main Stats Card */}
					<div className="lg:col-span-2 bg-gradient-to-br from-zinc-900 to-black border border-zinc-800 rounded-2xl p-8">
						<h2 className="text-2xl font-light text-white mb-6">
							Attendance Overview
						</h2>

						{/* Percentage Circle */}
						<div className="flex items-center gap-8 mb-8">
							<div className="relative w-40 h-40">
								<svg className="w-full h-full transform -rotate-90">
									<circle
										cx="80"
										cy="80"
										r="70"
										stroke="currentColor"
										strokeWidth="12"
										fill="none"
										className="text-zinc-800"
									/>
									<circle
										cx="80"
										cy="80"
										r="70"
										stroke="currentColor"
										strokeWidth="12"
										fill="none"
										strokeDasharray={`${2 * Math.PI * 70}`}
										strokeDashoffset={`${
											2 * Math.PI * 70 * (1 - analytics.attendancePercentage / 100)
										}`}
										className={
											analytics.attendancePercentage >= 75
												? 'text-green-500'
												: analytics.attendancePercentage >= 70
													? 'text-yellow-500'
													: 'text-red-500'
										}
										strokeLinecap="round"
									/>
								</svg>
								<div className="absolute inset-0 flex flex-col items-center justify-center">
									<div
										className={`text-4xl font-light ${getAttendanceColor(analytics.attendancePercentage)}`}
									>
										{analytics.attendancePercentage.toFixed(1)}%
									</div>
									<div className="text-xs text-zinc-500 mt-1">
										{getAttendanceStatus(analytics.attendancePercentage)}
									</div>
								</div>
							</div>

							<div className="flex-1 space-y-4">
								<div className="flex items-center justify-between">
									<span className="text-zinc-400">Weekly Schedule</span>
									<span className="text-white font-medium">
										{analytics.weeklyScheduledHours} hrs/week
									</span>
								</div>
								<div className="flex items-center justify-between">
									<span className="text-zinc-400">Total Conducted</span>
									<span className="text-white font-medium">
										{analytics.totalConductedHours} hrs
									</span>
								</div>
								<div className="flex items-center justify-between">
									<span className="text-zinc-400">Attended</span>
									<span className="text-green-400 font-medium">
										{analytics.attendedHours} hrs
									</span>
								</div>
								<div className="flex items-center justify-between">
									<span className="text-zinc-400">Missed</span>
									<span className="text-red-400 font-medium">
										{analytics.absentHours + analytics.bunkedHours} hrs
									</span>
								</div>
							</div>
						</div>

						{/* Progress Bar */}
						<div className="space-y-2">
							<div className="flex justify-between text-sm">
								<span className="text-zinc-400">Progress to 75%</span>
								<span className="text-zinc-400">
									{analytics.attendancePercentage >= 75
										? 'Target Achieved! 🎉'
										: `${analytics.hoursNeededToReach75Percent} hours needed`}
								</span>
							</div>
							<div className="w-full h-3 bg-zinc-800 rounded-full overflow-hidden">
								<motion.div
									initial={{ width: 0 }}
									animate={{
										width: `${Math.min(analytics.attendancePercentage, 100)}%`,
									}}
									transition={{ duration: 1, ease: 'easeOut' }}
									className={getProgressBarColor(analytics.attendancePercentage)}
								/>
							</div>
							<div className="flex justify-between text-xs text-zinc-500">
								<span>0%</span>
								<span className="text-amber-400">75% (Required)</span>
								<span>100%</span>
							</div>
						</div>
					</div>

					{/* Insights Card */}
					<div className="space-y-6">
						{analytics.attendancePercentage >= 75 ? (
							<div className="bg-gradient-to-br from-green-900/20 to-black border border-green-500/30 rounded-2xl p-6">
								<div className="flex items-center gap-3 mb-4">
									<CheckCircle className="w-6 h-6 text-green-400" />
									<h3 className="text-lg font-medium text-white">
										You're Safe!
									</h3>
								</div>
								<p className="text-zinc-400 text-sm mb-4">
									Your attendance is above the required threshold. Great job!
								</p>
								{analytics.safeBunkHours > 0 && (
									<div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
										<div className="text-xs text-zinc-500 mb-1">Can Bunk</div>
										<div className="text-2xl font-light text-green-400">
											{analytics.safeBunkHours}{' '}
											{analytics.safeBunkHours === 1 ? 'hour' : 'hours'}
										</div>
										<p className="text-xs text-zinc-500 mt-2">
											While staying above 75%
										</p>
									</div>
								)}
							</div>
						) : analytics.totalConductedHours === 0 ? (
							<div className="bg-gradient-to-br from-blue-900/20 to-black border border-blue-500/30 rounded-2xl p-6">
								<div className="flex items-center gap-3 mb-4">
									<Calendar className="w-6 h-6 text-blue-400" />
									<h3 className="text-lg font-medium text-white">
										Fresh Start
									</h3>
								</div>
								<p className="text-zinc-400 text-sm mb-4">
									No classes conducted yet. Your attendance journey begins soon!
								</p>
								<div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
									<div className="text-xs text-zinc-500 mb-1">Weekly Schedule</div>
									<div className="text-2xl font-light text-blue-400">
										{analytics.weeklyScheduledHours} hrs
									</div>
									<p className="text-xs text-zinc-500 mt-2">per week</p>
								</div>
							</div>
						) : (
							<div className="bg-gradient-to-br from-red-900/20 to-black border border-red-500/30 rounded-2xl p-6">
								<div className="flex items-center gap-3 mb-4">
									<AlertCircle className="w-6 h-6 text-red-400" />
									<h3 className="text-lg font-medium text-white">
										Action Needed
									</h3>
								</div>
								<p className="text-zinc-400 text-sm mb-4">
									Your attendance is below 75%. Attend more classes!
								</p>
								<div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
									<div className="text-xs text-zinc-500 mb-1">Hours Required</div>
									<div className="text-2xl font-light text-red-400">
										{analytics.hoursNeededToReach75Percent}
									</div>
									<p className="text-xs text-zinc-500 mt-2">
										To reach 75% attendance
									</p>
								</div>
							</div>
						)}

						<div className="bg-gradient-to-br from-zinc-900 to-black border border-zinc-800 rounded-2xl p-6">
							<div className="flex items-center gap-3 mb-4">
								<Target className="w-6 h-6 text-amber-400" />
								<h3 className="text-lg font-medium text-white">Quick Stats</h3>
							</div>
							<div className="space-y-3">
								<div className="flex items-center justify-between">
									<span className="text-zinc-400 text-sm">Bunked Hours</span>
									<span className="text-orange-400 font-medium">
										{analytics.bunkedHours}
									</span>
								</div>
								<div className="flex items-center justify-between">
									<span className="text-zinc-400 text-sm">Min. Required (75%)</span>
									<span className="text-amber-400 font-medium">
										{analytics.minimumRequiredFor75Percent} hrs
									</span>
								</div>
								<div className="flex items-center justify-between">
									<span className="text-zinc-400 text-sm">Attendance Rate</span>
									<span className={getAttendanceColor(analytics.attendancePercentage)}>
										{analytics.attendancePercentage >= 75 ? (
											<TrendingUp className="w-4 h-4" />
										) : (
											<TrendingDown className="w-4 h-4" />
										)}
									</span>
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* Additional Info */}
				{analytics.totalConductedHours > 0 && (
					<div className="bg-gradient-to-br from-zinc-900 to-black border border-zinc-800 rounded-2xl p-8">
						<h2 className="text-2xl font-light text-white mb-6">
							Detailed Breakdown
						</h2>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							<div className="space-y-4">
								<h3 className="text-sm font-medium text-zinc-400 uppercase tracking-wider">
									Attendance Stats
								</h3>
								<div className="space-y-3">
									<div className="flex justify-between items-center p-3 bg-zinc-950/50 rounded-lg">
										<span className="text-zinc-300">Attendance Rate</span>
										<span
											className={`font-medium ${getAttendanceColor(analytics.attendancePercentage)}`}
										>
											{analytics.attendancePercentage.toFixed(2)}%
										</span>
									</div>
									<div className="flex justify-between items-center p-3 bg-zinc-950/50 rounded-lg">
										<span className="text-zinc-300">Absent Rate</span>
										<span className="font-medium text-red-400">
											{analytics.totalConductedHours > 0
												? (
														((analytics.absentHours + analytics.bunkedHours) /
															analytics.totalConductedHours) *
														100
													).toFixed(2)
												: 0}
											%
										</span>
									</div>
								</div>
							</div>

							<div className="space-y-4">
								<h3 className="text-sm font-medium text-zinc-400 uppercase tracking-wider">
									Hour Distribution
								</h3>
								<div className="space-y-2">
									<div className="flex items-center gap-3">
										<div className="flex-1 h-2 bg-zinc-800 rounded-full overflow-hidden">
											<div
												className="h-full bg-green-500 rounded-full"
												style={{
													width: `${analytics.totalConductedHours > 0 ? (analytics.attendedHours / analytics.totalConductedHours) * 100 : 0}%`,
												}}
											/>
										</div>
										<span className="text-xs text-zinc-500 w-16 text-right">
											{analytics.attendedHours}/{analytics.totalConductedHours}
										</span>
									</div>
									<div className="text-xs text-zinc-500">
										Present: {analytics.attendedHours} hours
									</div>
								</div>
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default SubjectDetail;