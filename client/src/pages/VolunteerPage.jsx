import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Table, Badge, Alert, Spinner, Modal } from 'react-bootstrap';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, UserPlus, ShieldCheck, History, User, Mail, Calendar, Activity, ExternalLink } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const VolunteerPage = () => {
    const { user } = useAuth();
    const [volunteers, setVolunteers] = useState([]);
    const [formData, setFormData] = useState({ name: '', event_name: '', availability: '' });
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(true);

    // Profile Modal State
    const [showProfile, setShowProfile] = useState(false);
    const [selectedVolunteer, setSelectedVolunteer] = useState(null);
    const [volunteerHistory, setVolunteerHistory] = useState([]);

    const fetchVolunteers = async () => {
        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
            const endpoint = user?.role === 'admin' ? '/api/volunteers' : '/api/volunteers/my';
            const { data } = await axios.get(endpoint, config);
            setVolunteers(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) fetchVolunteers();
    }, [user]);

    const handleViewProfile = (v) => {
        // Find all records for this specific user
        const history = volunteers.filter(rec => rec.user_id?._id === v.user_id?._id);
        setSelectedVolunteer(v);
        setVolunteerHistory(history);
        setShowProfile(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            await axios.post('/api/volunteers', formData, {
                headers: { Authorization: `Bearer ${userInfo.token}` }
            });
            setSuccess('Heroic application submitted! 🌟');
            fetchVolunteers();
            setFormData({ name: '', event_name: '', availability: '' });
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) return (
        <div className="text-center py-5">
            <Spinner animation="grow" variant="success" />
            <p className="mt-3 text-muted">Loading Volunteer Hub...</p>
        </div>
    );

    return (
        <div className="volunteer-hub px-2">
            {/* Header */}
            <div className="mb-4">
                <Badge bg={user?.role === 'admin' ? 'danger' : 'success'} className="mb-2 px-3 py-2">
                    {user?.role === 'admin' ? 'COORDINATOR ACCESS' : 'USER HUB'}
                </Badge>
                <h2 className="fw-bold m-0" style={{ color: '#0057a8' }}>
                    {user?.role === 'admin' ? 'Volunteer Management Console' : 'My Volunteer Portal'}
                </h2>
                <p className="text-muted small">
                    {user?.role === 'admin' ? 'Global oversight of campus heroes.' : 'Manage your applications and track your contributions.'}
                </p>
            </div>

            {user?.role === 'admin' && (
                <Alert variant="dark" className="border-0 shadow-sm mb-4 d-flex align-items-center gap-3">
                    <ShieldCheck className="text-danger" />
                    <div>
                        <strong className="d-block">Administrative Access Active</strong>
                        <span className="small opacity-75">You are viewing the global directory of all volunteers.</span>
                    </div>
                </Alert>
            )}

            <Row className="g-4">
                {user?.role !== 'admin' && (
                    <Col xs={12} lg={5}>
                        <Card className="border-0 shadow-sm h-100 overflow-hidden">
                            <Card.Header className="bg-white py-4 px-4 border-0 border-bottom">
                                <h5 className="fw-bold m-0 d-flex align-items-center gap-2">
                                    <UserPlus size={20} className="text-success" /> New Registration
                                </h5>
                            </Card.Header>
                            <Card.Body className="p-4">
                                <Form onSubmit={handleSubmit}>
                                    <AnimatePresence>
                                        {success && (
                                            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
                                                <Alert variant="success">{success}</Alert>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                    <Form.Group className="mb-3">
                                        <Form.Label className="small fw-bold text-muted uppercase">Full Name</Form.Label>
                                        <Form.Control
                                            type="text"
                                            className="bg-light border-0 py-2 fw-medium"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            placeholder="Your display name"
                                            required
                                        />
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Label className="small fw-bold text-muted uppercase">Event Interest</Form.Label>
                                        <Form.Control
                                            type="text"
                                            className="bg-light border-0 py-2 fw-medium"
                                            value={formData.event_name}
                                            onChange={(e) => setFormData({ ...formData, event_name: e.target.value })}
                                            placeholder="e.g. IT Seminar, Food Drive"
                                            required
                                        />
                                    </Form.Group>
                                    <Form.Group className="mb-4">
                                        <Form.Label className="small fw-bold text-muted uppercase">Your Availability</Form.Label>
                                        <Form.Control
                                            type="text"
                                            className="bg-light border-0 py-2 fw-medium"
                                            placeholder="e.g. Sat-Sun, 9am-5pm"
                                            value={formData.availability}
                                            onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
                                            required
                                        />
                                    </Form.Group>
                                    <Button type="submit" className="border-0 w-100 py-3 shadow-sm fw-bold" style={{ backgroundColor: '#66b032' }}>
                                        SUBMIT APPLICATION
                                    </Button>
                                </Form>
                            </Card.Body>
                        </Card>
                    </Col>
                )}

                <Col xs={12} lg={user?.role === 'admin' ? 12 : 7}>
                    <Card className="border-0 shadow-sm h-100 overflow-hidden">
                        <Card.Header className="bg-white py-4 px-4 border-b d-flex justify-content-between align-items-center">
                            <h5 className="fw-bold m-0 d-flex align-items-center gap-2">
                                {user?.role === 'admin' ? <Users size={20} className="text-primary" /> : <History size={20} className="text-primary" />}
                                {user?.role === 'admin' ? 'Volunteer Registry' : 'My Hero History'}
                            </h5>
                            {user?.role === 'admin' && <Badge bg="primary">TOTAL REORDS: {volunteers.length}</Badge>}
                        </Card.Header>
                        <Card.Body className="p-0">
                            <div className="table-responsive">
                                <Table borderless hover className="m-0 align-middle">
                                    <thead className="bg-light text-muted small text-uppercase">
                                        <tr>
                                            {user?.role === 'admin' && <th className="ps-4 py-3">Volunteer</th>}
                                            <th className={user?.role === 'admin' ? '' : 'ps-4 py-3'}>Interested Event</th>
                                            <th>Availability</th>
                                            {user?.role === 'admin' && <th className="text-end pe-4">Action</th>}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {volunteers.map((v, idx) => (
                                            <tr key={v._id || idx} className="border-bottom">
                                                {user?.role === 'admin' && (
                                                    <td className="ps-4 py-3 fw-bold text-dark">
                                                        <div className="d-flex align-items-center gap-2">
                                                            <div className="p-2 rounded-circle bg-light text-primary"><User size={14} /></div>
                                                            {v.name}
                                                        </div>
                                                    </td>
                                                )}
                                                <td className={user?.role === 'admin' ? '' : 'ps-4 py-3'}>
                                                    <Badge bg="primary" pill className="px-3" style={{ fontSize: '10px' }}>{v.event_name}</Badge>
                                                </td>
                                                <td><span className="text-muted small fw-medium">{v.availability}</span></td>
                                                {user?.role === 'admin' && (
                                                    <td className="text-end pe-4">
                                                        <Button
                                                            size="sm"
                                                            variant="outline-primary"
                                                            className="border-2 fw-bold px-3 transition-hover"
                                                            onClick={() => handleViewProfile(v)}
                                                        >
                                                            View Profile
                                                        </Button>
                                                    </td>
                                                )}
                                            </tr>
                                        ))}
                                        {volunteers.length === 0 && (
                                            <tr>
                                                <td colSpan={user?.role === 'admin' ? 4 : 2} className="text-center py-5 text-muted">
                                                    {user?.role === 'admin' ? 'No volunteers registered yet.' : 'You haven\'t applied for any events yet.'}
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </Table>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Profile & History Modal */}
            <Modal show={showProfile} onHide={() => setShowProfile(false)} size="lg" centered className="volunteer-profile-modal">
                <Modal.Header closeButton className="border-0 pb-0">
                    <Modal.Title className="fw-bold d-flex align-items-center gap-2">
                        <ShieldCheck className="text-primary" /> Volunteer Activity Profile
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="p-4">
                    {selectedVolunteer && (
                        <>
                            <div className="d-flex align-items-center gap-4 mb-5 p-4 bg-light rounded-4 shadow-sm border">
                                <div className="p-4 rounded-circle bg-white text-primary shadow-sm border">
                                    <User size={48} />
                                </div>
                                <div>
                                    <h3 className="fw-bold mb-1">{selectedVolunteer.user_id?.name || selectedVolunteer.name}</h3>
                                    <p className="text-muted d-flex align-items-center gap-2 mb-1">
                                        <Mail size={16} /> {selectedVolunteer.user_id?.email || 'N/A'}
                                    </p>
                                    <div className="d-flex gap-2 mt-2">
                                        <Badge bg="info" className="text-dark">ID: {selectedVolunteer.user_id?._id?.slice(-6) || 'N/A'}</Badge>
                                        <Badge bg="dark" className="text-uppercase">{selectedVolunteer.user_id?.role || 'User'}</Badge>
                                        <Button
                                            size="sm"
                                            variant="outline-primary"
                                            className="ms-2 py-0 px-2 fw-bold"
                                            onClick={() => {
                                                const email = selectedVolunteer.user_id?.email;
                                                const name = selectedVolunteer.user_id?.name || selectedVolunteer.name;
                                                const subject = encodeURIComponent(`Saylani Hub: Discussion regarding Volunteer Application`);
                                                const body = encodeURIComponent(`Hello ${name},\n\nWe are reaching out to you regarding your interest in volunteering for campus events.\n\n`);
                                                window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
                                            }}
                                        >
                                            <Mail size={12} className="me-1" /> Contact
                                        </Button>
                                    </div>
                                </div>
                                <div className="ms-auto text-end">
                                    <h1 className="fw-bold text-primary m-0">{volunteerHistory.length}</h1>
                                    <small className="fw-bold text-muted uppercase" style={{ fontSize: '10px' }}>Total Contributions</small>
                                </div>
                            </div>

                            <div className="mb-4">
                                <h5 className="fw-bold mb-4 d-flex align-items-center gap-2">
                                    <History size={20} className="text-primary" /> Heroism Timeline
                                </h5>
                                <div className="table-responsive">
                                    <Table borderless hover className="m-0 align-middle">
                                        <thead className="bg-light text-muted small uppercase">
                                            <tr>
                                                <th className="py-3 ps-3">Function/Event</th>
                                                <th>Availability Provided</th>
                                                <th className="text-end pe-3">Registration Date</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {volunteerHistory.map((rec, i) => (
                                                <tr key={rec._id || i} className="border-bottom">
                                                    <td className="py-3 ps-3">
                                                        <div className="d-flex align-items-center gap-2">
                                                            <div className="p-2 rounded-circle bg-light text-success"><Activity size={14} /></div>
                                                            <span className="fw-bold">{rec.event_name}</span>
                                                        </div>
                                                    </td>
                                                    <td><span className="small text-muted">{rec.availability}</span></td>
                                                    <td className="text-end pe-3 small text-muted">
                                                        <Calendar size={12} className="me-1" /> {new Date(rec.createdAt).toLocaleDateString()}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </Table>
                                </div>
                            </div>
                        </>
                    )}
                </Modal.Body>
                <Modal.Footer className="border-0 pt-0 pb-4 justify-content-center">
                    <Button variant="light" onClick={() => setShowProfile(false)} className="px-5 fw-bold border">
                        Close Profile
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default VolunteerPage;
