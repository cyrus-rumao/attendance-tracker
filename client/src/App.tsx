import { Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useRef } from 'react';

import Navbar from './components/navbar';
import LoadingSpinner from './components/loading-spinner';
import Home from './pages/home';
import Login from './pages/login';
import Signup from './pages/signup';
import DashboardPage from './pages/dashboard';

import { useAuthStore } from './stores/useAuthStore';
// import type { User } from './schemas/user.schema';
// import type { User } from './schemas/user.schema';

// ---- types ----

const App: React.FC = () => {
	const { user, checkAuth, checkingAuth } = useAuthStore();

	useEffect(() => {

		checkAuth();
	}, [checkAuth]);

	if (checkingAuth && !user) {
		return <LoadingSpinner />;
	}

	return (
		<div className="min-h-screen bg-[radial-gradient(circle_at_center,#241d0b_0%,black_70%)] text-white">
			<div className="relative pt-16">
				<Navbar />

				<Routes>
					<Route
						path="/"
						element={<Home />}
					/>

					<Route
						path="/login"
						element={!user ? <Login /> : <Navigate to="/dashboard" />}
					/>

					<Route
						path="/signup"
						element={!user ? <Signup /> : <Navigate to="/dashboard" />}
					/>

					<Route
						path="/dashboard"
						element={user ? <DashboardPage /> : <Navigate to="/" />}
					/>

					<Route
						path="*"
						element={<Navigate to="/" />}
					/>
				</Routes>
			</div>
		</div>
	);
};

export default App;
