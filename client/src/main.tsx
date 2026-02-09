import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import { Toaster } from 'sonner';
import App from './App.tsx';

createRoot(document.getElementById('root')!).render(
	<BrowserRouter>
		<StrictMode>
			<App />
			<Toaster richColors />
		</StrictMode>
	</BrowserRouter>,
);
