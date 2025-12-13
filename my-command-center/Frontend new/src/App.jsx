import React from 'react'
import { Routes, Route } from 'react-router-dom'
import MainLayout from './layout/MainLayout'
import Dashboard from './pages/Dashboard'
import Tracking from './pages/Tracking'
import RoutePlanner from './pages/RoutePlanner'
import Emergency from './pages/Emergency'
import Missions from './pages/Missions'
import Analytics from './pages/Analytics'
import Logs from './pages/Logs'

export default function App() {
    return (
        <MainLayout>
            <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/tracking" element={<Tracking />} />
                <Route path="/route-planner" element={<RoutePlanner />} />
                <Route path="/emergency" element={<Emergency />} />
                <Route path="/missions" element={<Missions />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/logs" element={<Logs />} />
            </Routes>
        </MainLayout>
    )
}
