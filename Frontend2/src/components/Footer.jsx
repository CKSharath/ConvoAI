import React from 'react'

export default function Footer() {
    return (
        <footer className="footer">
            <div className="footer-inner">
                <div>© {new Date().getFullYear()} Command Center</div>
                <div className="status">STATUS: <span className="status-on">OPERATIONAL</span></div>
            </div>
        </footer>
    )
}
