import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import { NotificationProvider } from './contexts/NotificationProvider';
import { AuthProvider } from './contexts/AuthProvider.jsx';
import { projectName } from './utils/constants.js';



document.title = projectName;
createRoot(document.getElementById('root')).render(
     <NotificationProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </NotificationProvider>
);
