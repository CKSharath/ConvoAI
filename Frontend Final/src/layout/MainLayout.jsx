import React from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function MainLayout({ children }) {
    return (
        <div className="app-root dark-theme">
            <Navbar />
            <main className="main-area">{children}</main>
            <Footer />
        </div>
    )
}
