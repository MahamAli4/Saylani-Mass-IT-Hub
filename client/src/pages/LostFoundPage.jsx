import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Table, Badge, Alert, Spinner, Modal } from 'react-bootstrap';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, PlusCircle, ShieldCheck, CheckCircle, Package, MapPin, User, Mail, Info, Calendar } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const LostFoundPage = () => {
    const { user } = useAuth();
    const [items, setItems] = useState([]);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        type: 'lost',
        location: 'Main Campus'
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(true);

    // Detail Modal State
    const [showDetail, setShowDetail] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

    const campuses = ['Main Campus', 'Johar Campus', 'Gulshan Campus', 'North Campus', 'Bahadurabad Campus'];

    const fetchItems = async () => {
        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const endpoint = userInfo.role === 'admin' ? '/api/items' : '/api/items/my-items';
            const { data } = await axios.get(endpoint, {
                headers: { Authorization: `Bearer ${userInfo.token}` }
            });
            setItems(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchItems();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            await axios.post('/api/items', formData, {
                headers: { Authorization: `Bearer ${userInfo.token}` }
            });
            setSuccess('Item posted successfully! 🚀');
            fetchItems();
            setFormData({ title: '', description: '', type: 'lost', location: 'Main Campus' });
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError('Failed to post item');
        }
    };

    if (loading) return (
        <div className="text-center py-5">
            <Spinner animation="border" variant="primary" />
            <p className="mt-2 text-muted">Syncing L&F Database...</p>
        </div>
    );

    return (
        <div className="lost-found-portal px-2">
            <div className="mb-4">
                <Badge bg={user?.role === 'admin' ? 'danger' : 'primary'} className="mb-2 px-3 py-2">
                    {user?.role === 'admin' ? 'COORDINATOR OVERRIDE' : 'COMMUNITY HUB'}
                </Badge>
                <h2 className="fw-bold m-0" style={{ color: '#0057a8' }}>Lost & Found System</h2>
                <p className="text-muted small">
                    {user?.role === 'admin' ? 'Global campus property management and resolution console.' : 'Report lost items or help return found belongings.'}
                </p>
            </div>

            {user?.role === 'admin' && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-4">
                    <Alert variant="dark" className="border-0 shadow-sm d-flex align-items-center gap-3 bg-dark text-white p-4">
                        <ShieldCheck size={32} className="text-danger" />
                        <div>
                            <h5 className="fw-bold m-0">Management Protocol Active</h5>
                            <p className="m-0 small text-white-50">Detailed inspection mode enabled. View reporter metadata and campus origination via 'View Detail'.</p>
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
                                    <PlusCircle size={20} className="text-success" /> Post Campus Report
                                </h5>
                            </Card.Header>
                            <Card.Body className="p-4">
                                <AnimatePresence>
                                    {success && <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }}><Alert variant="success">{success}</Alert></motion.div>}
                                    {error && <Alert variant="danger">{error}</Alert>}
                                </AnimatePresence>
                                <Form onSubmit={handleSubmit}>
                                    <Form.Group className="mb-3">
                                        <Form.Label className="small fw-bold text-muted">ITEM TITLE</Form.Label>
                                        <Form.Control
                                            type="text"
                                            className="bg-light border-0 py-2"
                                            value={formData.title}
                                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                            placeholder="What did you lose or find?"
                                            required
                                        />
                                    </Form.Group>
                                    <Row>
                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label className="small fw-bold text-muted">REPORT TYPE</Form.Label>
                                                <Form.Select
                                                    className="bg-light border-0 py-2"
                                                    value={formData.type}
                                                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                                >
                                                    <option value="lost">Lost</option>
                                                    <option value="found">Found</option>
                                                </Form.Select>
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label className="small fw-bold text-muted">CAMPUS</Form.Label>
                                                <Form.Select
                                                    className="bg-light border-0 py-2"
                                                    value={formData.location}
                                                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                                >
                                                    {campuses.map(c => <option key={c} value={c}>{c}</option>)}
                                                </Form.Select>
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                    <Form.Group className="mb-4">
                                        <Form.Label className="small fw-bold text-muted">DESCRIPTION</Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            rows={3}
                                            className="bg-light border-0"
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            placeholder="Provide distinct details..."
                                            required
                                        />
                                    </Form.Group>
                                    <Button type="submit" className="border-0 w-100 py-3 fw-bold shadow-sm" style={{ backgroundColor: '#66b032' }}>
                                        POST REPORT
                                    </Button>
                                </Form>
                            </Card.Body>
                        </Card>
                    </Col>
                )}

                <Col xs={12} sm={12} lg={user?.role === 'admin' ? 12 : 8}>
                    <Card className="border-0 shadow-sm overflow-hidden">
                        <Card.Header className="bg-white py-4 px-3 px-md-4 border-0 border-bottom d-flex justify-content-between align-items-center">
                            <h5 className="fw-bold m-0 d-flex align-items-center gap-2">
                                <Search size={20} className="text-primary" />
                                {user?.role === 'admin' ? 'Campus Oversight Directory' : 'My Active Reports'}
                            </h5>
                            {user?.role === 'admin' && <Badge bg="primary">TOTAL RECORDS: {items.length}</Badge>}
                        </Card.Header>
                        <div className="table-responsive">
                            <Table borderless hover className="m-0 align-middle">
                                <thead className="bg-light text-muted small text-uppercase">
                                    <tr>
                                        {user?.role === 'admin' && <th className="ps-4 py-3">Reporter</th>}
                                        <th className={user?.role === 'admin' ? '' : 'ps-4'}>Title</th>
                                        <th>Campus</th>
                                        <th>Status</th>
                                        <th className="text-end pe-4">Options</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {items.map(item => (
                                        <tr key={item._id} className="border-bottom">
                                            {user?.role === 'admin' && (
                                                <td className="ps-4 py-3 fw-bold small text-muted">
                                                    {item.user_id?.name || 'User'}
                                                </td>
                                            )}
                                            <td className={user?.role === 'admin' ? 'fw-bold' : 'ps-4 fw-bold'}>{item.title}</td>
                                            <td>
                                                <div className="d-flex align-items-center gap-1 small text-muted fw-medium">
                                                    <MapPin size={12} className="text-danger" /> {item.location || 'Main Campus'}
                                                </div>
                                            </td>
                                            <td>
                                                <Badge bg={item.status === 'pending' ? 'warning' : 'success'} pill className="px-3" style={{ fontSize: '10px' }}>
                                                    {item.status.toUpperCase()}
                                                </Badge>
                                            </td>
                                            <td className="text-end pe-4">
                                                <div className="d-flex justify-content-end gap-2">
                                                    <Button
                                                        size="sm"
                                                        variant="light"
                                                        className="border fw-bold px-3 py-1"
                                                        onClick={() => {
                                                            setSelectedItem(item);
                                                            setShowDetail(true);
                                                        }}
                                                    >
                                                        Details
                                                    </Button>
                                                    {item.status === 'pending' && user?.role === 'admin' && (
                                                        <Button
                                                            size="sm"
                                                            variant="success"
                                                            className="fw-bold px-3"
                                                            onClick={async () => {
                                                                const userInfo = JSON.parse(localStorage.getItem('userInfo'));
                                                                await axios.patch(`/api/items/${item._id}`, { status: 'resolved' }, {
                                                                    headers: { Authorization: `Bearer ${userInfo.token}` }
                                                                });
                                                                fetchItems();
                                                            }}
                                                        >
                                                            Resolve
                                                        </Button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {items.length === 0 && (
                                        <tr>
                                            <td colSpan={6} className="text-center py-5 text-muted small">No reports found in this sector.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </Table>
                        </div>
                    </Card>
                </Col>
            </Row>

            {/* Detail Modal */}
            <Modal show={showDetail} onHide={() => setShowDetail(false)} centered size="lg" className="detail-inspection-modal">
                <Modal.Header closeButton className="border-0 pb-0">
                    <Modal.Title className="fw-bold d-flex align-items-center gap-2">
                        <Info className="text-primary" /> Report Inspection
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="p-4">
                    {selectedItem && (
                        <Row className="g-4">
                            <Col md={7}>
                                <div className="p-4 bg-light rounded-4 border h-100 shadow-sm">
                                    <Badge bg={selectedItem.type === 'lost' ? 'danger' : 'success'} className="mb-2">{selectedItem.type.toUpperCase()}</Badge>
                                    <h3 className="fw-bold text-dark mb-3">{selectedItem.title}</h3>
                                    <p className="text-muted" style={{ lineHeight: '1.8' }}>{selectedItem.description}</p>

                                    <div className="mt-4 pt-4 border-top">
                                        <div className="d-flex align-items-center gap-3 mb-3 text-muted">
                                            <MapPin size={20} className="text-danger" />
                                            <div>
                                                <small className="d-block fw-bold text-uppercase" style={{ fontSize: '10px' }}>Incident Location</small>
                                                <span className="fw-bold">{selectedItem.location || 'Main Campus'}</span>
                                            </div>
                                        </div>
                                        <div className="d-flex align-items-center gap-3 text-muted">
                                            <Calendar size={20} className="text-primary" />
                                            <div>
                                                <small className="d-block fw-bold text-uppercase" style={{ fontSize: '10px' }}>Date Reported</small>
                                                <span className="fw-bold">{new Date(selectedItem.createdAt).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Col>
                            <Col md={5}>
                                <div className="p-4 bg-white rounded-4 border h-100 shadow-sm d-flex flex-column">
                                    <h6 className="fw-bold text-muted mb-4 text-uppercase small">Reporter Information</h6>
                                    <div className="text-center mb-4">
                                        <div className="d-inline-flex p-4 rounded-circle bg-light text-primary mb-3">
                                            <User size={40} />
                                        </div>
                                        <h5 className="fw-bold m-0">{selectedItem.user_id?.name || 'Hub Member'}</h5>
                                        <small className="text-muted">{selectedItem.user_id?.role || 'User'}</small>
                                    </div>
                                    <div className="mt-auto p-3 bg-light rounded-3 d-flex align-items-center gap-2">
                                        <Mail size={16} className="text-primary" />
                                        <small className="fw-bold text-truncate">{selectedItem.user_id?.email || 'email@saylani.org'}</small>
                                    </div>
                                    <Button
                                        variant="primary"
                                        className="mt-3 w-100 fw-bold border-0"
                                        style={{ backgroundColor: '#0057a8' }}
                                        onClick={() => {
                                            const email = selectedItem.user_id?.email;
                                            const subject = encodeURIComponent(`Regarding your ${selectedItem.type} item: ${selectedItem.title}`);
                                            const body = encodeURIComponent(`Hello ${selectedItem.user_id?.name},\n\nI am contacting you regarding the ${selectedItem.type} item report you posted: "${selectedItem.title}" at ${selectedItem.location}.\n\n`);
                                            window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
                                        }}
                                    >
                                        Contact via Email
                                    </Button>
                                </div>
                            </Col>
                        </Row>
                    )}
                </Modal.Body>
                <Modal.Footer className="border-0">
                    <Button variant="light border" onClick={() => setShowDetail(false)} className="px-4 fw-bold">Close Inspection</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default LostFoundPage;
