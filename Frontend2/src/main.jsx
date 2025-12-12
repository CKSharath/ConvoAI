import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import 'leaflet/dist/leaflet.css';
import './styles/variables.css'
import './styles/variables.css'
import './styles/animation.css'
import './styles/layout.css'
import './styles/pages/dashboard.css'
import './styles/pages/tracking.css'
import './styles/components/navbar.css'
import './styles/components/card.css'
import './styles/components/missionlist.css'
import './styles/hover-upgrade.css';

createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </React.StrictMode>
)
