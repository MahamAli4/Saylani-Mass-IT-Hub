import React from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AppNavbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <Navbar expand="lg" style={{ backgroundColor: '#0057a8' }} variant="dark" className="mb-4">
            <Container>
                <Navbar.Brand as={Link} to="/" className="fw-bold">
                    <span style={{ color: '#66b032' }}>Saylani</span> Mass IT Hub
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ms-auto align-items-center">
                        {user ? (
                            <>
                                <Nav.Link as={Link} to="/dashboard">Dashboard</Nav.Link>
                                <Nav.Link as={Link} to="/lost-found">Lost & Found</Nav.Link>
                                <Nav.Link as={Link} to="/complaints">Complaints</Nav.Link>
                                <Nav.Link as={Link} to="/volunteer">Volunteer</Nav.Link>
                                {user.role === 'admin' && (
                                    <Nav.Link as={Link} to="/admin" className="fw-bold text-warning">Admin Portal</Nav.Link>
                                )}
                                <Button variant="outline-light" size="sm" className="ms-2" onClick={handleLogout}>
                                    Logout ({user.name})
                                </Button>
                            </>
                        ) : (
                            <>
                                <Nav.Link as={Link} to="/login">Login</Nav.Link>
                                <Nav.Link as={Link} to="/signup">Signup</Nav.Link>
                            </>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default AppNavbar;
