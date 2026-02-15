import React from 'react';
import { Nav } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    LayoutDashboard,
    Search,
    MessageSquare,
    Users,
    ShieldAlert,
    LogOut,
    ChevronRight,
    X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = ({ isOpen, toggle }) => {
    const location = useLocation();
    const { user, logout } = useAuth();

    const menuItems = [
        { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { path: '/lost-found', label: 'Lost & Found', icon: Search },
        { path: '/complaints', label: 'Complaints', icon: MessageSquare },
        { path: '/volunteer', label: 'Volunteer', icon: Users },
    ];

    return (
        <div className={`sidebar shadow-sm h-100 py-4 px-3 ${isOpen ? 'show' : ''}`} style={{
            width: '260px',
            backgroundColor: '#ffffff',
            position: 'fixed',
            left: 0,
            top: 0,
            zIndex: 1050,
            transition: 'transform 0.3s ease'
        }}>
            <div className="d-flex justify-content-between align-items-center mb-5 px-3">
                <div>
                    <h4 className="fw-bold m-0" style={{ color: '#0057a8' }}>
                        <span style={{ color: '#66b032' }}>Saylani</span> HUB
                    </h4>
                    <small className="text-muted fw-bold small uppercase">Innovation Hub</small>
                </div>
                <button className="btn d-lg-none p-0 text-muted" onClick={toggle}>
                    <X size={24} />
                </button>
            </div>

            <Nav className="flex-column gap-2 mb-auto" onClick={() => { if (window.innerWidth < 992) toggle(); }}>
                {menuItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    const Icon = item.icon;
                    return (
                        <Nav.Link
                            as={Link}
                            to={item.path}
                            key={item.path}
                            className={`d-flex align-items-center justify-content-between p-3 rounded-3 transition-hover ${isActive ? 'bg-primary text-white' : 'text-muted'}`}
                            style={{
                                backgroundColor: isActive ? '#0057a8' : 'transparent',
                                fontWeight: isActive ? '600' : '400'
                            }}
                        >
                            <div className="d-flex align-items-center gap-3">
                                <Icon size={20} />
                                <span>{item.label}</span>
                            </div>
                            {isActive && <motion.div layoutId="arrow"><ChevronRight size={16} /></motion.div>}
                        </Nav.Link>
                    );
                })}
            </Nav>

            <div className="mt-auto px-2">
                <hr className="my-4 opacity-50" />
                <div className="d-flex align-items-center gap-3 mb-4 px-2">
                    <div className="rounded-circle bg-light d-flex align-items-center justify-content-center fw-bold flex-shrink-0" style={{ width: '40px', height: '40px', color: '#0057a8' }}>
                        {user?.name?.charAt(0)}
                    </div>
                    <div className="text-truncate">
                        <p className="m-0 fw-bold small text-dark">{user?.name}</p>
                        <p className="m-0 text-muted" style={{ fontSize: '10px' }}>{user?.email}</p>
                    </div>
                </div>
                <button
                    onClick={logout}
                    className="btn btn-light w-100 d-flex align-items-center justify-content-center gap-2 py-2 border-0"
                    style={{ backgroundColor: '#fff5f5', color: '#dc3545' }}
                >
                    <LogOut size={16} />
                    <span>Logout</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
