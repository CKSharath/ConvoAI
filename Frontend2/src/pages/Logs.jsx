import React from 'react'
import Timeline from '../components/Timeline'
import logs from '../data/mockLogs'

export default function Logs() {
    return (
        <div className="page logs">
            <header className="page-header"><h1>Logs</h1></header>
            <div className="panel"><Timeline events={logs} /></div>
        </div>
    )
}