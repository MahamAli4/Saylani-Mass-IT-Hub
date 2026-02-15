import { Container, Badge, Button } from 'react-bootstrap';
import { Bell, Info, Search, Menu } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Topbar = ({ toggleSidebar }) => {
    const { user } = useAuth();
    const location = useLocation();
    const path = location.pathname.substring(1).split('/').join(' > ');

    return (
        <div className="topbar bg-white border-bottom py-3 px-3 px-md-4 position-sticky top-0" style={{
            marginLeft: 'var(--sidebar-offset, 260px)',
            zIndex: 1000,
            transition: 'margin-left 0.3s ease'
        }}>
            <div className="d-flex justify-content-between align-items-center px-1">
                <div className="d-flex align-items-center gap-2 gap-md-3">
                    <Button
                        variant="light"
                        className="d-lg-none p-2 border-0"
                        onClick={toggleSidebar}
                    >
                        <Menu size={20} />
                    </Button>
                    <h5 className="m-0 fw-bold text-capitalize d-none d-sm-block" style={{ color: '#0057a8' }}>
                        {path || 'Dashboard'}
                    </h5>
                </div>

                <div className="d-flex align-items-center gap-2 gap-md-4">
                    {user?.role === 'admin' && (
                        <div className="d-none d-xl-flex align-items-center text-danger small fw-bold gap-2 bg-danger bg-opacity-10 px-3 py-1 rounded-pill">
                            <span className="spinner-grow spinner-grow-sm" role="status"></span>
                            ADMIN TERMINAL
                        </div>
                    )}
                    <div className="d-none d-md-flex align-items-center bg-light rounded-pill px-3 py-1 text-muted small border">
                        <Search size={14} className="me-2" />
                        <span>Search...</span>
                    </div>
                    <div className="position-relative cursor-pointer p-1">
                        <Bell size={20} className="text-muted" />
                        <span className="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-light rounded-circle"></span>
                    </div>
                    <Badge bg="primary" pill className="px-3 d-none d-sm-block">LIVE</Badge>
                </div>
            </div>
        </div>
    );
};

export default Topbar;
