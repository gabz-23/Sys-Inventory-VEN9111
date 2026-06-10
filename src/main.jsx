import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App.jsx';

// Fuentes de la aplicación
import '@fontsource/geist-sans/400.css';
import '@fontsource/geist-sans/300.css';

// Estilos de la aplicación
import './global.css';

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <App />
    </StrictMode>
);
