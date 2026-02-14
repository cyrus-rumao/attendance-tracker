import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, BookOpen, FlaskConical, Coffee } from 'lucide-react';
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

interface TimeSlot {
	subjectId: Subject;
	startTime: string;
	endTime: string;
}

interface TimetableData {
	_id: string;
	userId: string;
	monday: TimeSlot[];
	tuesday: TimeSlot[];
	wednesday: TimeSlot[];
	thursday: TimeSlot[];
	friday: TimeSlot[];
	saturday?: TimeSlot[];
	sunday?: TimeSlot[];
	createdAt: string;
	updatedAt: string;
	__v: number;
}

const Timetable: React.FC = () => {
	const navigate = useNavigate();
	const [timetable, setTimetable] = useState<TimetableData | null>(null);
	const [loading, setLoading] = useState<boolean>(true);

	// Define time slots based on the college timetable
	const timeSlots = [
		{ start: '08:00', end: '09:00', label: '8:00 - 9:00 AM' },
		{ start: '09:00', end: '10:00', label: '9:00 - 10:00 AM' },
		{ start: '10:00', end: '11:00', label: '10:00 - 11:00 AM' },
		{ start: '11:00', end: '12:00', label: '11:00 - 12:00 PM' },
		{ start: '12:00', end: '13:00', label: '12:00 - 1:00 PM' },
		{ start: '13:00', end: '14:00', label: '1:00 - 2:00 PM' },
		{ start: '14:00', end: '15:00', label: '2:00 - 3:00 PM' },
		{ start: '15:00', end: '16:00', label: '3:00 - 4:00 PM' },
		{ start: '16:00', end: '17:00', label: '4:00 - 5:00 PM' },
		{ start: '17:00', end: '18:00', label: '5:00 - 6:00 PM' },
	];

	const days: Array<keyof TimetableData> = [
		'monday',
		'tuesday',
		'wednesday',
		'thursday',
		'friday',
		'saturday',
	];
	const dayLabels = [
		'Monday',
		'Tuesday',
		'Wednesday',
		'Thursday',
		'Friday',
		'Saturday',
	];

	useEffect(() => {
		const fetchTimetable = async () => {
			try {
				setLoading(true);
				const response = await axios.get('/timetable');
				setTimetable(response.data);
			} catch (error) {
				console.error('Error fetching timetable:', error);
			} finally {
				setLoading(false);
			}
		};

		fetchTimetable();
	}, []);

	// Find subject for a specific day and time slot
	const getSubjectForSlot = (
		day: keyof TimetableData,
		slotStart: string,
	): TimeSlot | null => {
		if (!timetable) return null;

		const daySchedule = timetable[day] as TimeSlot[] | undefined;
		if (!daySchedule || !Array.isArray(daySchedule)) return null;

		// Find a class that starts at or before this time and ends after this time
		return (
			daySchedule.find((slot) => {
				const classStart = slot.startTime;
				const classEnd = slot.endTime;
				return classStart <= slotStart && classEnd > slotStart;
			}) || null
		);
	};

	// Check if this is the first hour of a multi-hour class
	const isFirstHourOfClass = (
		day: keyof TimetableData,
		slotStart: string,
		subject: TimeSlot,
	): boolean => {
		return subject.startTime === slotStart;
	};

	// Calculate how many hours a class spans
	const calculateRowSpan = (startTime: string, endTime: string): number => {
		const [startHour] = startTime.split(':').map(Number);
		const [endHour] = endTime.split(':').map(Number);
		return endHour - startHour;
	};

	// Check if cell should be hidden (part of a multi-hour class)
	const shouldHideCell = (
		day: keyof TimetableData,
		slotStart: string,
	): boolean => {
		const subject = getSubjectForSlot(day, slotStart);
		if (!subject) return false;
		return !isFirstHourOfClass(day, slotStart, subject);
	};

	const handleSubjectClick = (subjectId: string) => {
		navigate(`/subjects/${subjectId}`);
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
					<p className="text-zinc-500">Loading timetable...</p>
				</div>
			</div>
		);
	}

	if (!timetable) {
		return (
			<div className="min-h-screen bg-black text-white flex items-center justify-center">
				<div className="text-center">
					<Calendar className="w-16 h-16 text-zinc-700 mx-auto mb-4" />
					<h3 className="text-2xl font-light text-white mb-2">
						No timetable found
					</h3>
					<p className="text-zinc-500">Create your timetable to get started</p>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-black text-white pb-12">
			{/* Header */}
			<div className="border-b border-zinc-900 bg-zinc-950/50 backdrop-blur-xl sticky top-0 z-40">
				<div className="max-w-[1600px] mx-auto px-8 py-6">
					<div className="flex items-center justify-between">
						<div>
							<h1 className="text-4xl font-light text-white mb-2">
								My Timetable
							</h1>
							<p className="text-zinc-400">
								Academic Year 2025-26 • Semester VI
							</p>
						</div>
						<div className="flex items-center gap-2 text-zinc-400">
							<Clock className="w-5 h-5 text-amber-500" />
							<span className="text-sm">Week View</span>
						</div>
					</div>
				</div>
			</div>

			{/* Timetable Grid */}
			<div className="max-w-[1600px] mx-auto px-8 py-8">
				<div className="overflow-x-auto">
					<table className="w-full border-collapse">
						<thead>
							<tr>
								<th className="sticky left-0 z-30 bg-gradient-to-br from-zinc-900 to-black border-2 border-zinc-800 p-4 min-w-[140px]">
									<div className="text-center">
										<Clock className="w-5 h-5 text-amber-500 mx-auto mb-1" />
										<span className="text-xs text-zinc-500 font-medium">
											TIME
										</span>
									</div>
								</th>
								{dayLabels.map((day, index) => (
									<th
										key={day}
										className="bg-gradient-to-br from-zinc-900 to-black border-2 border-zinc-800 p-4 min-w-[180px]">
										<div className="text-center">
											<div className="text-base font-medium text-amber-400">
												{day}
											</div>
											<div className="text-xs text-zinc-500 mt-1">
												{days[index].slice(0, 3).toUpperCase()}
											</div>
										</div>
									</th>
								))}
							</tr>
						</thead>
						<tbody>
							{timeSlots.map((timeSlot, rowIndex) => (
								<tr key={timeSlot.start}>
									{/* Time Label */}
									<td className="sticky left-0 z-20 bg-zinc-950 border-2 border-zinc-800 p-3 text-center">
										<div className="text-sm font-medium text-white whitespace-nowrap">
											{timeSlot.label}
										</div>
									</td>

									{/* Day Cells */}
									{days.map((day) => {
										// Check if this cell should be hidden (part of merged cell above)
										if (shouldHideCell(day, timeSlot.start)) {
											return null;
										}

										const subject = getSubjectForSlot(day, timeSlot.start);

										if (!subject) {
											// Empty cell or break
											return (
												<td
													key={`${day}-${timeSlot.start}`}
													className="border-2 border-zinc-800 p-3 bg-zinc-950/30">
													<div className="h-20 flex items-center justify-center">
														<span className="text-xs text-zinc-700">—</span>
													</div>
												</td>
											);
										}

										const rowSpan = calculateRowSpan(
											subject.startTime,
											subject.endTime,
										);
										const isLab = subject.subjectId.type === 'lab';
										const isBreak = subject.subjectId.name
											.toLowerCase()
											.includes('break');

										// Break styling
										if (isBreak) {
											return (
												<td
													key={`${day}-${timeSlot.start}`}
													rowSpan={rowSpan}
													className="border-2 border-zinc-800 p-3 bg-zinc-900/50">
													<div className="h-full flex flex-col items-center justify-center gap-2">
														<Coffee className="w-6 h-6 text-zinc-600" />
														<span className="text-sm font-medium text-zinc-500">
															BREAK
														</span>
													</div>
												</td>
											);
										}

										return (
											<td
												key={`${day}-${timeSlot.start}`}
												rowSpan={rowSpan}
												className="border-2 border-zinc-800 p-0">
												<motion.button
													whileHover={{ scale: 1.01 }}
													whileTap={{ scale: 0.99 }}
													onClick={() =>
														handleSubjectClick(subject.subjectId._id)
													}
													className={`w-full h-full p-4 text-left transition-all group relative ${
														isLab
															? 'bg-purple-500/10 hover:bg-purple-500/20 border-l-4 border-purple-500'
															: 'bg-amber-500/10 hover:bg-amber-500/20 border-l-4 border-amber-500'
													}`}>
													{/* Subtle glow effect on hover */}
													<div
														className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity ${
															isLab ? 'bg-purple-500/5' : 'bg-amber-500/5'
														}`}
													/>

													<div className="relative z-10 min-h-[80px] flex flex-col justify-center">
														{/* Subject Name */}
														<div className="flex items-start gap-2 mb-2">
															{isLab ? (
																<FlaskConical className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" />
															) : (
																<BookOpen className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
															)}
															<h3 className="font-medium text-white text-sm leading-tight line-clamp-2">
																{subject.subjectId.name}
															</h3>
														</div>

														{/* Subject Code */}
														<p className="text-xs font-mono text-zinc-400 mb-2">
															{subject.subjectId.code}
														</p>

														{/* Time and Type Badge */}
														<div className="flex items-center justify-between gap-2">
															<div className="flex items-center gap-1 text-xs text-zinc-500">
																<Clock className="w-3 h-3" />
																<span>
																	{subject.startTime} - {subject.endTime}
																</span>
															</div>
															<span
																className={`px-2 py-0.5 rounded-full text-xs font-medium ${
																	isLab
																		? 'bg-purple-500/20 text-purple-400'
																		: 'bg-amber-500/20 text-amber-400'
																}`}>
																{subject.subjectId.type.toUpperCase()}
															</span>
														</div>
													</div>
												</motion.button>
											</td>
										);
									})}
								</tr>
							))}
						</tbody>
					</table>
				</div>

				{/* Legend */}
				<div className="mt-8 flex items-center justify-center gap-8 flex-wrap">
					<div className="flex items-center gap-2">
						<div className="w-4 h-4 rounded bg-amber-500/20 border-l-4 border-amber-500" />
						<span className="text-sm text-zinc-400">Lecture</span>
					</div>
					<div className="flex items-center gap-2">
						<div className="w-4 h-4 rounded bg-purple-500/20 border-l-4 border-purple-500" />
						<span className="text-sm text-zinc-400">Lab</span>
					</div>
					<div className="flex items-center gap-2">
						<Coffee className="w-4 h-4 text-zinc-600" />
						<span className="text-sm text-zinc-400">Break</span>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Timetable;
