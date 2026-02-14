import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
	BookOpen,
	FlaskConical,
	Plus,
	Trash2,
	Edit,
	Search,
	Filter,
} from 'lucide-react';
// import axios from '../lib/axios';
import AddSubjectModal from '../components/add-subject';
import { useNavigate } from 'react-router-dom';
import type { Subject } from '../schemas/subject.schema';
import { useSubjectStore } from '../stores/useSubjectStore';

const Subjects: React.FC = () => {
	// const [subjects, setSubjects] = useState<Subject[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [searchQuery, setSearchQuery] = useState<string>('');
	const [filterType, setFilterType] = useState<'all' | 'lecture' | 'lab'>(
		'all',
	);
	const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
	const { subjects, getSubjects } = useSubjectStore();
	// Fetch subjects from backend
	const fetchSubjects = async () => {
		try {
			setLoading(true);
			await getSubjects();
		} catch (error) {
			console.error('Error fetching subjects:', error);
		} finally {
			setLoading(false);
		}
	};
	const navigate = useNavigate();
	useEffect(() => {
		fetchSubjects();
	}, []);

	// Filter subjects based on search and type
	const filteredSubjects = subjects.filter((subject) => {
		const matchesSearch =
			subject.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			subject.code.toLowerCase().includes(searchQuery.toLowerCase());

		const matchesType = filterType === 'all' || subject.type === filterType;

		return matchesSearch && matchesType;
	});

	// Group subjects by type
	const lectures = filteredSubjects.filter((s) => s.type === 'lecture');
	const labs = filteredSubjects.filter((s) => s.type === 'lab');

	const handleModalSuccess = () => {
		fetchSubjects(); // Refresh the subjects list
	};

	return (
		<div className="min-h-screen bg-black text-white">
			{/* Add Subject Modal */}
			<AddSubjectModal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				onSuccess={handleModalSuccess}
			/>

			{/* Header */}
			<div className="border-b border-zinc-900 bg-zinc-950/50 backdrop-blur-xl sticky top-0 z-40">
				<div className="max-w-7xl mx-auto px-8 py-6">
					<div className="flex items-center justify-between mb-6">
						<div>
							<h1 className="text-4xl font-light text-white mb-2">
								My Subjects
							</h1>
							<p className="text-zinc-400">
								Manage your courses and track attendance
							</p>
						</div>
						<button
							onClick={() => setIsModalOpen(true)}
							className="px-6 py-3 bg-linear-to-r from-amber-500 to-yellow-600 text-black font-medium rounded-lg hover:opacity-90 transition flex items-center gap-2">
							<Plus className="w-5 h-5" />
							Add Subject
						</button>
					</div>

					{/* Search and Filter Bar */}
					<div className="flex flex-col sm:flex-row gap-4">
						{/* Search */}
						<div className="flex-1 relative">
							<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
							<input
								type="text"
								placeholder="Search subjects or codes..."
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								className="w-full pl-10 pr-4 py-3 rounded-lg bg-zinc-900/50 border border-zinc-800 text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500 transition"
							/>
						</div>

						{/* Filter */}
						<div className="flex gap-2">
							<button
								onClick={() => setFilterType('all')}
								className={`px-4 py-3 rounded-lg font-medium transition flex items-center gap-2 ${
									filterType === 'all'
										? 'bg-linear-to-r from-amber-500 to-yellow-600 text-black'
										: 'bg-zinc-900/50 border border-zinc-800 text-zinc-400 hover:border-amber-500/50'
								}`}>
								<Filter className="w-4 h-4" />
								All
							</button>
							<button
								onClick={() => setFilterType('lecture')}
								className={`px-4 py-3 rounded-lg font-medium transition flex items-center gap-2 ${
									filterType === 'lecture'
										? 'bg-linear-to-r from-amber-500 to-yellow-600 text-black'
										: 'bg-zinc-900/50 border border-zinc-800 text-zinc-400 hover:border-amber-500/50'
								}`}>
								<BookOpen className="w-4 h-4" />
								Lectures
							</button>
							<button
								onClick={() => setFilterType('lab')}
								className={`px-4 py-3 rounded-lg font-medium transition flex items-center gap-2 ${
									filterType === 'lab'
										? 'bg-linear-to-r from-amber-500 to-yellow-600 text-black'
										: 'bg-zinc-900/50 border border-zinc-800 text-zinc-400 hover:border-amber-500/50'
								}`}>
								<FlaskConical className="w-4 h-4" />
								Labs
							</button>
						</div>
					</div>
				</div>
			</div>

			{/* Main Content */}
			<div className="max-w-7xl mx-auto px-8 py-12">
				{loading ? (
					// Loading State
					<div className="flex items-center justify-center py-20">
						<div className="text-center">
							<motion.div
								animate={{ rotate: 360 }}
								transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
								className="w-12 h-12 border-4 border-zinc-800 border-t-amber-500 rounded-full mx-auto mb-4"
							/>
							<p className="text-zinc-500">Loading subjects...</p>
						</div>
					</div>
				) : filteredSubjects.length === 0 ? (
					// Empty State
					<div className="text-center py-20">
						<div className="inline-block p-6 bg-zinc-900/50 rounded-2xl border border-zinc-800 mb-6">
							<BookOpen className="w-16 h-16 text-zinc-700" />
						</div>
						<h3 className="text-2xl font-light text-white mb-2">
							No subjects found
						</h3>
						<p className="text-zinc-500 mb-6">
							{searchQuery
								? 'Try adjusting your search or filters'
								: 'Add your first subject to get started'}
						</p>
						<button
							onClick={() => setIsModalOpen(true)}
							className="px-6 py-3 bg-linear-to-r from-amber-500 to-yellow-600 text-black font-medium rounded-lg hover:opacity-90 transition inline-flex items-center gap-2">
							<Plus className="w-5 h-5" />
							Add Subject
						</button>
					</div>
				) : (
					// Subjects Grid
					<div className="space-y-12">
						{/* Stats Overview */}
						<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
							<div className="bg-linear-to-br from-zinc-900 to-black border border-zinc-800 rounded-2xl p-6">
								<div className="flex items-center justify-between mb-4">
									<div className="p-3 bg-amber-500/10 rounded-xl border border-amber-500/20">
										<BookOpen className="w-6 h-6 text-amber-500" />
									</div>
									<div className="text-right">
										<div className="text-3xl font-light text-white">
											{subjects.length}
										</div>
										<div className="text-sm text-zinc-500">Total Subjects</div>
									</div>
								</div>
							</div>

							<div className="bg-linear-to-br from-zinc-900 to-black border border-zinc-800 rounded-2xl p-6">
								<div className="flex items-center justify-between mb-4">
									<div className="p-3 bg-blue-500/10 rounded-xl border border-blue-500/20">
										<BookOpen className="w-6 h-6 text-blue-500" />
									</div>
									<div className="text-right">
										<div className="text-3xl font-light text-white">
											{lectures.length}
										</div>
										<div className="text-sm text-zinc-500">Lectures</div>
									</div>
								</div>
							</div>

							<div className="bg-linear-to-br from-zinc-900 to-black border border-zinc-800 rounded-2xl p-6">
								<div className="flex items-center justify-between mb-4">
									<div className="p-3 bg-purple-500/10 rounded-xl border border-purple-500/20">
										<FlaskConical className="w-6 h-6 text-purple-500" />
									</div>
									<div className="text-right">
										<div className="text-3xl font-light text-white">
											{labs.length}
										</div>
										<div className="text-sm text-zinc-500">Labs</div>
									</div>
								</div>
							</div>
						</div>

						{/* Lectures Section */}
						{lectures.length > 0 && (
							<div>
								<h2 className="text-2xl font-light text-white mb-6 flex items-center gap-2">
									<BookOpen className="w-6 h-6 text-amber-500" />
									Lectures
								</h2>
								<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
									{lectures.map((subject) => (
										<SubjectCard
											key={subject._id}
											subject={subject}
										/>
									))}
								</div>
							</div>
						)}

						{/* Labs Section */}
						{labs.length > 0 && (
							<div>
								<h2 className="text-2xl font-light text-white mb-6 flex items-center gap-2">
									<FlaskConical className="w-6 h-6 text-purple-500" />
									Labs
								</h2>
								<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
									{labs.map((subject) => (
										<SubjectCard
											key={subject._id}
											subject={subject}
										/>
									))}
								</div>
							</div>
						)}
					</div>
				)}
			</div>
		</div>
	);
};

// Subject Card Component
interface SubjectCardProps {
	subject: Subject;
}

const SubjectCard: React.FC<SubjectCardProps> = ({ subject }) => {
	const isLab = subject.type === 'lab';
const navigate = useNavigate();
	return (
		<motion.div
			whileHover={{ y: -4 }}
			className="group relative bg-linear-to-br from-zinc-900 to-black border border-zinc-800 rounded-2xl p-6 hover:border-amber-500/50 transition-all duration-300">
			{/* Glow effect on hover */}
			<div className="absolute inset-0 bg-linear-to-br from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity duration-300" />
			<button onClick={() => navigate(`/subjects/${subject._id}`)}>
				<div className="relative">
					{/* Header */}
					<div className="flex items-start justify-between mb-4">
						<div
							className={`p-3 rounded-xl border ${
								isLab
									? 'bg-purple-500/10 border-purple-500/20'
									: 'bg-amber-500/10 border-amber-500/20'
							}`}>
							{isLab ? (
								<FlaskConical className="w-6 h-6 text-purple-500" />
							) : (
								<BookOpen className="w-6 h-6 text-amber-500" />
							)}
						</div>
						<span
							className={`px-3 py-1 rounded-full text-xs font-medium ${
								isLab
									? 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
									: 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
							}`}>
							{subject.type.toUpperCase()}
						</span>
					</div>

					{/* Content */}
					<div className="mb-4">
						<h3 className="text-xl font-medium text-white mb-1 group-hover:text-amber-400 transition-colors">
							{subject.name}
						</h3>
						<p className="text-zinc-500 text-sm font-mono">{subject.code}</p>
					</div>

					{/* Placeholder for attendance stats - you can add this later */}
					<div className="mb-4 p-3 bg-zinc-950/50 rounded-lg border border-zinc-800">
						<div className="flex justify-between items-center mb-2">
							<span className="text-xs text-zinc-500">Attendance</span>
							<span className="text-sm font-medium text-amber-400">--</span>
						</div>
						<div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
							<div
								className="h-full bg-linear-to-r from-amber-500 to-yellow-600 rounded-full"
								style={{ width: '0%' }}
							/>
						</div>
					</div>

					{/* Actions */}
					<div className="flex gap-2">
						<button className="flex-1 px-4 py-2 bg-zinc-950/50 border border-zinc-800 rounded-lg text-zinc-400 hover:text-amber-400 hover:border-amber-500/50 transition text-sm font-medium">
							View Details
						</button>
						<button className="p-2 bg-zinc-950/50 border border-zinc-800 rounded-lg text-zinc-400 hover:text-amber-400 hover:border-amber-500/50 transition">
							<Edit className="w-4 h-4" />
						</button>
						<button className="p-2 bg-zinc-950/50 border border-zinc-800 rounded-lg text-zinc-400 hover:text-red-400 hover:border-red-500/50 transition">
							<Trash2 className="w-4 h-4" />
						</button>
					</div>
				</div>
			</button>
		</motion.div>
	);
};

export default Subjects;
