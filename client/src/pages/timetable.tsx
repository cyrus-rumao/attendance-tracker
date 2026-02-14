import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, BookOpen, FlaskConical, Coffee } from 'lucide-react';
import { useTimetableStore } from '../stores/useTimetableStore';
import type { TimetableSlot } from '../schemas/timetable.schema';

const Timetable: React.FC = () => {
	const navigate = useNavigate();
	const { timetable, loading, getTimetable } = useTimetableStore();

	// Generate time slots in 30-minute increments from 8:00 AM to 6:00 PM
	const generateTimeSlots = () => {
		const slots = [];
		for (let hour = 8; hour < 18; hour++) {
			slots.push(`${hour.toString().padStart(2, '0')}:00`);
			slots.push(`${hour.toString().padStart(2, '0')}:30`);
		}
		slots.push('18:00'); // Add final slot
		return slots;
	};

	const timeSlots = generateTimeSlots();

	const days: Array<
		'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday'
	> = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

	const dayLabels = [
		'Monday',
		'Tuesday',
		'Wednesday',
		'Thursday',
		'Friday',
		'Saturday',
	];

	useEffect(() => {
		getTimetable();
	}, [getTimetable]);

	// Convert time string to minutes since midnight
	const timeToMinutes = (time: string): number => {
		const [hours, minutes] = time.split(':').map(Number);
		return hours * 60 + minutes;
	};

	// Convert minutes to grid row number (each 30 min = 1 row, starting from 8:00 AM)
	const timeToGridRow = (time: string): number => {
		const minutes = timeToMinutes(time);
		const startMinutes = timeToMinutes('08:00');
		return Math.floor((minutes - startMinutes) / 30) + 2; // +2 because row 1 is header
	};

	// Calculate how many 30-minute slots a class spans
	const calculateGridRowSpan = (startTime: string, endTime: string): number => {
		const startMinutes = timeToMinutes(startTime);
		const endMinutes = timeToMinutes(endTime);
		return (endMinutes - startMinutes) / 30;
	};

	// Get classes for a specific day
	const getClassesForDay = (day: (typeof days)[number]): TimetableSlot[] => {
		if (!timetable || !timetable[day]) return [];
		return timetable[day] || [];
	};

	const handleSubjectClick = (subjectId: string) => {
		navigate(`/subjects/${subjectId}`);
	};

	// Format time for display (e.g., "09:00" -> "9:00 AM")
	const formatTime = (time: string): string => {
		const [hours, minutes] = time.split(':').map(Number);
		const period = hours >= 12 ? 'PM' : 'AM';
		const displayHours = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours;
		return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
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
					{/* Grid Container */}
					<div
						className="inline-grid min-w-full"
						style={{
							gridTemplateColumns: '140px repeat(6, minmax(180px, 1fr))',
							gridTemplateRows: `60px repeat(${timeSlots.length}, 60px)`,
						}}>
						{/* Header Row */}
						<div className="sticky left-0 z-30 bg-linear-to-br from-zinc-900 to-black border-2 border-zinc-800 rounded-lg flex items-center justify-center">
							<div className="text-center">
								<Clock className="w-5 h-5 text-amber-500 mx-auto mb-1" />
								<span className="text-xs text-zinc-500 font-medium">TIME</span>
							</div>
						</div>

						{dayLabels.map((day, index) => (
							<div
								key={day}
								className="bg-linear-to-br from-zinc-900 to-black border-2 border-zinc-800 rounded-lg flex flex-col items-center justify-center">
								<div className="text-base font-medium text-amber-400">
									{day}
								</div>
								<div className="text-xs text-zinc-500 mt-1">
									{days[index].slice(0, 3).toUpperCase()}
								</div>
							</div>
						))}

						{/* Time Labels Column */}
						{timeSlots.map((time, index) => {
							// Only show labels for hour marks (00 minutes)
							const showLabel = time.endsWith(':00');

							return (
								<div
									key={`time-${time}`}
									className="sticky left-0 z-20 bg-zinc-950 border border-zinc-800 flex items-center justify-center"
									style={{ gridRow: index + 2 }}>
									{showLabel && (
										<div className="text-center">
											<div className="text-sm font-medium text-white whitespace-nowrap">
												{formatTime(time)}
											</div>
										</div>
									)}
								</div>
							);
						})}

						{/* Day Columns - Each day gets its own grid column */}
						{days.map((day, dayIndex) => {
							const classes = getClassesForDay(day);

							return (
								<React.Fragment key={day}>
									{/* Background cells for this day */}
									{timeSlots.map((time, timeIndex) => (
										<div
											key={`bg-${day}-${time}`}
											className="border border-zinc-800 bg-zinc-950/30"
											style={{
												gridColumn: dayIndex + 2,
												gridRow: timeIndex + 2,
											}}
										/>
									))}

									{/* Class cells overlaid on top */}
									{classes.map((classSlot, classIndex) => {
										const startRow = timeToGridRow(classSlot.startTime);
										const rowSpan = calculateGridRowSpan(
											classSlot.startTime,
											classSlot.endTime,
										);

										const isLab = classSlot.subjectId.type === 'lab';
										const isBreak = classSlot.subjectId.name
											.toLowerCase()
											.includes('break');

										// Break styling
										if (isBreak) {
											return (
												<div
													key={`class-${day}-${classIndex}`}
													className="border-2 border-zinc-800 bg-zinc-900/50 flex flex-col items-center justify-center gap-2"
													style={{
														gridColumn: dayIndex + 2,
														gridRow: `${startRow} / span ${rowSpan}`,
													}}>
													<Coffee className="w-6 h-6 text-zinc-600" />
													<span className="text-sm font-medium text-zinc-500">
														BREAK
													</span>
												</div>
											);
										}

										return (
											<motion.button
												key={`class-${day}-${classIndex}`}
												whileHover={{ scale: 1.01 }}
												whileTap={{ scale: 0.99 }}
												onClick={() =>
													handleSubjectClick(classSlot.subjectId._id)
												}
												className={` p-4 text-left transition-all duration-200 group relative
                           shadow-lg backdrop-blur-md border border-zinc-800 
                          ${
														isLab
															? 'bg-purple-600/25 hover:bg-purple-600/35 '
															: 'bg-amber-500/25 hover:bg-amber-500/35 '
													}`}
												style={{
													gridColumn: dayIndex + 2,
													gridRow: `${startRow} / span ${rowSpan}`,
												}}>
												{/* Subtle glow effect on hover */}
												<div
													className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity ${
														isLab ? 'bg-purple-500/5' : 'bg-amber-500/5'
													}`}
												/>

												<div className="relative z-10 flex flex-col justify-center h-full">
													{/* Subject Name */}
													<div className="flex items-start gap-2 mb-2">
														{isLab ? (
															<FlaskConical className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" />
														) : (
															<BookOpen className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
														)}
														<h3 className="font-medium text-white text-sm leading-tight line-clamp-2">
															{classSlot.subjectId.name}
														</h3>
													</div>

													{/* Subject Code */}
													<p className="text-xs font-mono text-zinc-400 mb-2">
														{classSlot.subjectId.code}
													</p>

													{/* Time and Type Badge */}
													<div className="flex items-center justify-between gap-2">
														<div className="flex items-center gap-1 text-xs text-zinc-500">
															<Clock className="w-3 h-3" />
															<span>
																{classSlot.startTime} - {classSlot.endTime}
															</span>
														</div>
														<span
															className={`px-2 py-0.5 rounded-full text-xs font-medium ${
																isLab
																	? 'bg-purple-500/20 text-purple-400'
																	: 'bg-amber-500/20 text-amber-400'
															}`}>
															{classSlot.subjectId.type.toUpperCase()}
														</span>
													</div>
												</div>
											</motion.button>
										);
									})}
								</React.Fragment>
							);
						})}
					</div>
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
