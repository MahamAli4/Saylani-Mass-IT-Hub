import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import { motion, AnimatePresence } from 'framer-motion';

const Layout = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    return (
        <div className="app-layout">
            <Sidebar isOpen={isSidebarOpen} toggle={toggleSidebar} />
            <div className={`main-wrapper ${isSidebarOpen ? 'sidebar-open' : ''}`}>
                <Topbar toggleSidebar={toggleSidebar} />
                <main className="content-area py-4 px-3 px-md-5" style={{ marginLeft: 'var(--sidebar-offset, 260px)' }}>
                    {/* Inline CSS variable for responsive offset */}
                    <style dangerouslySetInnerHTML={{
                        __html: `
                        :root { --sidebar-offset: 260px; }
                        @media (max-width: 991.98px) { :root { --sidebar-offset: 0px; } }
                    `}} />

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={window.location.pathname}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                        >
                            {children}
                        </motion.div>
                    </AnimatePresence>
                </main>
            </div>

            {/* Mobile Overlay */}
            {isSidebarOpen && (
                <div
                    className="sidebar-overlay d-lg-none"
                    onClick={toggleSidebar}
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0,0,0,0.5)',
                        zIndex: 999
                    }}
                />
            )}
        </div>
    );
};

export default Layout;
