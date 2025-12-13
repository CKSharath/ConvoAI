import React from 'react'
import MissionCard from '../components/MissionCard'
import StatsWidget from '../components/StatsWidget'
import { useMissions, MissionProvider } from '../context/MissionContext'

function DashboardInner() {
    const { missions } = useMissions()
    return (
        <div className="page dashboard">
            <header className="page-header">
                <h1>Mission Control Center</h1>
                <p>Real-time convoy tracking and mission management system</p>
            </header>

            <section className="cards-row">
                <MissionCard title="Convoy Tracking">
                    <div className="convoy-metrics">
                        <div>Active<br /><strong>12</strong></div>
                        <div>Status<br /><strong>Nominal</strong></div>
                    </div> 
                </MissionCard>

                <MissionCard title="Mission Planner">
                    <div className="convoy-metrics">
                        <div>Planned<br /><strong>{missions.length}</strong></div>
                        <div>Efficiency<br /><strong>94%</strong></div>
                    </div>
                </MissionCard>

                <MissionCard title="Emergency Routing">
                    <div className="convoy-metrics">
                        <div>Ready<br /><strong>5</strong></div>
                        <div>Response<br /><strong>2s</strong></div>
                    </div>
                </MissionCard>
            </section>

            <section className="kpis">
                <StatsWidget label="Total Convoys" value="47" />
                <StatsWidget label="Missions Completed" value="234" />
                <StatsWidget label="System Health" value="99.8%" />
                <StatsWidget label="Avg Response Time" value="1.2s" />
            </section>
        </div>
    )
}

export default function Dashboard() {
    return (
        <MissionProvider>
            <DashboardInner />
        </MissionProvider>
    )
}