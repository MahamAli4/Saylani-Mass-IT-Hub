import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Table, Badge, Alert, Spinner, Modal } from 'react-bootstrap';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, ShieldAlert, CheckCircle, AlertCircle, User, MapPin, Mail, Info, Calendar, Clock } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const ComplaintPage = () => {
    const { user } = useAuth();
    const [complaints, setComplaints] = useState([]);
    const [formData, setFormData] = useState({
        category: 'Internet',
        description: '',
        location: 'Main Campus'
    });
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(true);

    // Detail Modal State
    const [showDetail, setShowDetail] = useState(false);
    const [selectedComplaint, setSelectedComplaint] = useState(null);

    const campuses = ['Main Campus', 'Johar Campus', 'Gulshan Campus', 'North Campus', 'Bahadurabad Campus'];

    const fetchComplaints = async () => {
        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const endpoint = userInfo.role === 'admin' ? '/api/complaints' : '/api/complaints/my';
            const { data } = await axios.get(endpoint, {
                headers: { Authorization: `Bearer ${userInfo.token}` }
            });
            setComplaints(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchComplaints();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            await axios.post('/api/complaints', formData, {
                headers: { Authorization: `Bearer ${userInfo.token}` }
            });
            setSuccess('Complaint submitted successfully! Our team is on it. 🛠️');
            fetchComplaints();
            setFormData({ category: 'Internet', description: '', location: 'Main Campus' });
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) return (
        <div className="text-center py-5">
            <Spinner animation="grow" variant="primary" />
            <p className="mt-3 text-muted">Opening Service Registry...</p>
        </div>
    );

    return (
        <div className="complaint-portal px-2">
            <div className="mb-4">
                <Badge bg={user?.role === 'admin' ? 'danger' : 'primary'} className="mb-2 px-3 py-2">
                    {user?.role === 'admin' ? 'SERVICE OVERSIGHT' : 'SUPPORT HUB'}
                </Badge>
                <h2 className="fw-bold m-0" style={{ color: '#0057a8' }}>Complaint Management System</h2>
                <p className="text-muted small">
                    {user?.role === 'admin' ? 'Monitor and resolve campus facility issues globally.' : 'Report issues related to campus facilities or services.'}
                </p>
            </div>

            {user?.role === 'admin' && (
                <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="mb-4">
                    <Alert variant="danger" className="border-0 shadow-sm d-flex align-items-center gap-3 bg-danger text-white p-4">
                        <ShieldAlert size={32} />
                        <div>
                            <h5 className="fw-bold m-0">Administrative Privilege Active</h5>
                            <p className="m-0 small text-white-75">Service oversight mode active. Inspect detailed tickets and campus origination via 'Details'.</p>
                        </div>
                    </Alert>
                </motion.div>
            )}

            <Row className="g-4">
                {user?.role !== 'admin' && (
                    <Col xs={12} lg={4}>
                        <Card className="border-0 shadow-sm overflow-hidden">
                            <Card.Header className="bg-white py-4 px-4 border-0 border-bottom">
                                <h5 className="fw-bold m-0 d-flex align-items-center gap-2">
                                    <MessageSquare size={20} className="text-primary" /> Submit New Query
                                </h5>
                            </Card.Header>
                            <Card.Body className="p-4">
                                <AnimatePresence>
                                    {success && <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }}><Alert variant="success">{success}</Alert></motion.div>}
                                </AnimatePresence>
                                <Form onSubmit={handleSubmit}>
                                    <Form.Group className="mb-3">
                                        <Form.Label className="small fw-bold text-muted">CAMPUS LOCATION</Form.Label>
                                        <Form.Select
                                            className="bg-light border-0 py-2 fw-medium"
                                            value={formData.location}
                                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                        >
                                            {campuses.map(c => <option key={c} value={c}>{c}</option>)}
                                        </Form.Select>
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Label className="small fw-bold text-muted">DEPARTMENT/CATEGORY</Form.Label>
                                        <Form.Select
                                            className="bg-light border-0 py-2 fw-medium"
                                            value={formData.category}
                                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        >
                                            <option>Internet</option>
                                            <option>Electricity</option>
                                            <option>Water</option>
                                            <option>Maintenance</option>
                                        </Form.Select>
                                    </Form.Group>
                                    <Form.Group className="mb-4">
                                        <Form.Label className="small fw-bold text-muted">INCIDENT DETAILS</Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            rows={3}
                                            className="bg-light border-0"
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            placeholder="Describe the issue in detail..."
                                            required
                                        />
                                    </Form.Group>
                                    <Button type="submit" className="border-0 w-100 py-3 fw-bold shadow-sm" style={{ backgroundColor: '#0057a8' }}>
                                        SEND TO SUPPORT
                                    </Button>
                                </Form>
                            </Card.Body>
                        </Card>
                    </Col>
                )}

                <Col xs={12} lg={user?.role === 'admin' ? 12 : 8}>
                    <Card className="border-0 shadow-sm overflow-hidden">
                        <Card.Header className="bg-white py-4 px-4 border-0 border-bottom">
                            <h5 className="fw-bold m-0 d-flex align-items-center gap-2">
                                <AlertCircle size={20} className="text-danger" />
                                {user?.role === 'admin' ? 'Global Complaint Registry' : 'My Support Tickets'}
                            </h5>
                        </Card.Header>
                        <div className="table-responsive">
                            <Table borderless hover className="m-0 align-middle">
                                <thead className="bg-light text-muted small text-uppercase">
                                    <tr>
                                        {user?.role === 'admin' && <th className="ps-4 py-3">Reporter</th>}
                                        <th className={user?.role === 'admin' ? '' : 'ps-4'}>Category</th>
                                        <th>Campus</th>
                                        <th>Status</th>
                                        <th className="text-end pe-4">Options</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {complaints.map(c => (
                                        <tr key={c._id} className="border-bottom text-muted">
                                            {user?.role === 'admin' && (
                                                <td className="ps-4 py-3 fw-bold text-muted small">
                                                    {c.user_id?.name || 'User'}
                                                </td>
                                            )}
                                            <td className={user?.role === 'admin' ? 'fw-bold' : 'ps-4 fw-bold text-dark'}>{c.category}</td>
                                            <td>
                                                <div className="d-flex align-items-center gap-1 small fw-medium">
                                                    <MapPin size={12} className="text-danger" /> {c.location || 'Main Campus'}
                                                </div>
                                            </td>
                                            <td>
                                                <Badge bg={c.status === 'Resolved' ? 'success' : 'secondary'} className="px-3" pill style={{ fontSize: '10px' }}>
                                                    {c.status.toUpperCase()}
                                                </Badge>
                                            </td>
                                            <td className="text-end pe-4">
                                                <div className="d-flex justify-content-end gap-2">
                                                    <Button
                                                        size="sm"
                                                        variant="light"
                                                        className="border fw-bold px-3"
                                                        onClick={() => {
                                                            setSelectedComplaint(c);
                                                            setShowDetail(true);
                                                        }}
                                                    >
                                                        Details
                                                    </Button>
                                                    {c.status !== 'Resolved' && user?.role === 'admin' && (
                                                        <Button
                                                            size="sm"
                                                            variant="success"
                                                            className="fw-bold px-3 shadow-sm border-0"
                                                            onClick={async () => {
                                                                const userInfo = JSON.parse(localStorage.getItem('userInfo'));
                                                                await axios.patch(`/api/complaints/${c._id}`, { status: 'Resolved' }, {
                                                                    headers: { Authorization: `Bearer ${userInfo.token}` }
                                                                });
                                                                fetchComplaints();
                                                            }}
                                                        >
                                                            Fix
                                                        </Button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {complaints.length === 0 && (
                                        <tr>
                                            <td colSpan={5} className="text-center py-5 text-muted small">No active incidents reported.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </Table>
                        </div>
                    </Card>
                </Col>
            </Row>

            {/* Detail Modal */}
            <Modal show={showDetail} onHide={() => setShowDetail(false)} centered size="lg">
                <Modal.Header closeButton className="border-0">
                    <Modal.Title className="fw-bold">Service Ticket #{(selectedComplaint?._id || '').slice(-6).toUpperCase()}</Modal.Title>
                </Modal.Header>
                <Modal.Body className="p-4 pt-0">
                    {selectedComplaint && (
                        <Row className="g-4">
                            <Col md={8}>
                                <div className="p-4 bg-light rounded-4 border h-100">
                                    <div className="d-flex justify-content-between align-items-start mb-4">
                                        <div>
                                            <Badge bg="primary" className="mb-2 px-3 py-2">{selectedComplaint.category}</Badge>
                                            <h4 className="fw-bold text-dark d-flex align-items-center gap-2">
                                                Campus Infrastructure Case
                                            </h4>
                                        </div>
                                        <Badge bg={selectedComplaint.status === 'Resolved' ? 'success' : 'warning'} className="px-3 py-2 border">
                                            {selectedComplaint.status}
                                        </Badge>
                                    </div>
                                    <div className="mb-4">
                                        <h6 className="fw-bold text-muted small text-uppercase">Incident Narrative</h6>
                                        <p className="text-dark bg-white p-3 rounded-3 border" style={{ lineHeight: '1.7' }}>
                                            {selectedComplaint.description}
                                        </p>
                                    </div>
                                    <Row className="g-3 mt-4">
                                        <Col sm={6}>
                                            <div className="d-flex align-items-center gap-3">
                                                <div className="p-2 rounded bg-white border text-danger"><MapPin size={18} /></div>
                                                <div>
                                                    <small className="d-block text-muted fw-bold" style={{ fontSize: '9px' }}>LOCATION</small>
                                                    <span className="fw-bold small">{selectedComplaint.location || 'Main Campus'}</span>
                                                </div>
                                            </div>
                                        </Col>
                                        <Col sm={6}>
                                            <div className="d-flex align-items-center gap-3">
                                                <div className="p-2 rounded bg-white border text-primary"><Clock size={18} /></div>
                                                <div>
                                                    <small className="d-block text-muted fw-bold" style={{ fontSize: '9px' }}>TIME LOGGED</small>
                                                    <span className="fw-bold small">{new Date(selectedComplaint.createdAt).toLocaleString()}</span>
                                                </div>
                                            </div>
                                        </Col>
                                    </Row>
                                </div>
                            </Col>
                            <Col md={4}>
                                <Card className="border shadow-sm h-100 p-4 bg-white text-center">
                                    <div className="p-4 rounded-circle bg-light text-primary mx-auto mb-3 shadow-sm" style={{ width: 'fit-content' }}>
                                        <User size={32} />
                                    </div>
                                    <h6 className="fw-bold m-0">{selectedComplaint.user_id?.name || 'Hub Member'}</h6>
                                    <p className="small text-muted mb-4">{selectedComplaint.user_id?.role || 'Campus User'}</p>
                                    <div className="text-start mt-auto">
                                        <div className="p-3 bg-light rounded-3 d-flex align-items-center gap-2 border mb-3">
                                            <Mail size={14} className="text-secondary" />
                                            <span className="small fw-bold text-truncate">{selectedComplaint.user_id?.email || 'N/A'}</span>
                                        </div>
                                        <Button
                                            variant="dark"
                                            className="w-100 py-2 fw-bold border-0 shadow-sm"
                                            onClick={() => {
                                                const email = selectedComplaint.user_id?.email;
                                                const subject = encodeURIComponent(`Regarding your Support Ticket: #${(selectedComplaint._id || '').slice(-6).toUpperCase()}`);
                                                const body = encodeURIComponent(`Hello ${selectedComplaint.user_id?.name},\n\nI am contacting you regarding your ${selectedComplaint.category} complaint registered at ${selectedComplaint.location}.\n\n`);
                                                window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
                                            }}
                                        >
                                            Send Notice
                                        </Button>
                                    </div>
                                </Card>
                            </Col>
                        </Row>
                    )}
                </Modal.Body>
                <Modal.Footer className="border-0 pb-4">
                    <Button variant="outline-secondary fw-bold px-4" onClick={() => setShowDetail(false)}>Dismiss Detail</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default ComplaintPage;
