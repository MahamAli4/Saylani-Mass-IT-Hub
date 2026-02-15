import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Badge, Form, Spinner, Alert } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { ShieldCheck, Package, AlertCircle, Users, Activity, PieChart as ChartIcon } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import axios from 'axios';

const AdminDashboard = () => {
    const [items, setItems] = useState([]);
    const [complaints, setComplaints] = useState([]);
    const [volunteers, setVolunteers] = useState(0);
    const [stats, setStats] = useState({ totalItems: 0, totalComplaints: 0, pendingItems: 0, activeComplaints: 0 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchData = async () => {
        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };

            const [itemsRes, complaintsRes, volunteerRes] = await Promise.all([
                axios.get('/api/items', config),
                axios.get('/api/complaints', config),
                axios.get('/api/volunteers', config)
            ]);

            setItems(itemsRes.data);
            setComplaints(complaintsRes.data);
            setVolunteers(volunteerRes.data.length);

            setStats({
                totalItems: itemsRes.data.length,
                totalComplaints: complaintsRes.data.length,
                pendingItems: itemsRes.data.filter(i => i.status === 'pending').length,
                activeComplaints: complaintsRes.data.filter(c => c.status !== 'Resolved').length
            });
        } catch (err) {
            setError('System Error: Data link failure.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const chartData = [
        { name: 'Lost Items', value: items.filter(i => i.type === 'lost').length, color: '#dc3545' },
        { name: 'Found Items', value: items.filter(i => i.type === 'found').length, color: '#66b032' },
        { name: 'Complaints', value: complaints.length, color: '#0057a8' }
    ];

    const handleStatusUpdate = async (type, id, newStatus) => {
        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
            const url = type === 'item' ? `/api/items/${id}` : `/api/complaints/${id}`;
            await axios.patch(url, { status: newStatus }, config);
            fetchData();
        } catch (err) {
            setError('Update Failed: Override Error.');
        }
    };

    if (loading) return (
        <div className="text-center py-5">
            <Spinner animation="grow" variant="danger" />
            <p className="mt-3 text-muted fw-bold">Connecting Admin Hub...</p>
        </div>
    );

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="admin-portal px-2">
            <div className="d-flex justify-content-between align-items-center mb-5 mt-2">
                <div>
                    <h2 className="fw-bold mb-1" style={{ color: '#0057a8' }}>Executive Command Center</h2>
                    <p className="text-muted m-0">Global Oversight & Campus Facility Management</p>
                </div>
                <Badge bg="danger" className="px-4 py-2 border-0 shadow-sm">ADMIN SECURE ACCESS</Badge>
            </div>

            {/* Administrative Oversight Active Banner */}
            <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="mb-4 bg-dark text-white p-3 rounded-4 d-flex justify-content-between align-items-center shadow-lg overflow-hidden position-relative"
                style={{ borderLeft: '5px solid #dc3545' }}
            >
                <div>
                    <h5 className="fw-bold m-0"><ShieldCheck size={20} className="me-2 text-danger" /> Management Mode Active</h5>
                    <small className="opacity-75">Global database link established. All campus records are currently editable.</small>
                </div>
                <Badge bg="danger" className="p-2 px-3">PROTECTED OVERRIDE</Badge>
                <div style={{ position: 'absolute', right: '-10px', bottom: '-20px', fontSize: '4rem', opacity: '0.05' }}>🛡️</div>
            </motion.div>

            {error && <Alert variant="danger" className="border-0 shadow-sm mb-4">{error}</Alert>}

            {/* Admin Stats Grid */}
            <Row className="g-4 mb-5">
                {[
                    { title: 'Campus Reports', val: stats.totalItems, icon: <Package />, color: '#0057a8' },
                    { title: 'Pending Items', val: stats.pendingItems, icon: <Activity />, color: '#dc3545' },
                    { title: 'Open Complaints', val: stats.activeComplaints, icon: <AlertCircle />, color: '#f59e0b' },
                    { title: 'Total Volunteers', val: volunteers, icon: <Users />, color: '#10b981' }
                ].map((s, i) => (
                    <Col key={i} md={3}>
                        <Card className="border-0 shadow-sm p-3 h-100">
                            <Card.Body className="d-flex align-items-center gap-3">
                                <div className="p-3 rounded-circle text-white shadow-sm" style={{ backgroundColor: s.color }}>
                                    {s.icon}
                                </div>
                                <div>
                                    <h4 className="fw-bold mb-0">{s.val}</h4>
                                    <small className="text-muted fw-bold small text-uppercase">{s.title}</small>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>

            <Row className="g-4 mb-5">
                <Col lg={8}>
                    <Card className="border-0 shadow-sm h-100 p-4">
                        <h5 className="fw-bold mb-4 d-flex align-items-center gap-2">
                            <ChartIcon size={20} className="text-primary" /> Report Distribution Analytics
                        </h5>
                        <div style={{ width: '100%', height: 300 }}>
                            <ResponsiveContainer>
                                <PieChart>
                                    <Pie
                                        data={chartData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        paddingAngle={5}
                                        dataKey="value"
                                        animationBegin={0}
                                        animationDuration={1500}
                                    >
                                        {chartData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend verticalAlign="bottom" height={36} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>
                </Col>
                <Col lg={4}>
                    <Card className="border-0 shadow-sm h-100 p-4 bg-primary text-white overflow-hidden position-relative">
                        <h5 className="fw-bold mb-3">Quick Analysis</h5>
                        <p className="small opacity-75 mb-4">You have {stats.pendingItems} items pending resolution. Campus safety and efficiency is priority #1.</p>
                        <div className="mt-auto">
                            <div className="d-flex justify-content-between mb-2">
                                <span className="small">Resolution Rate</span>
                                <span className="small fw-bold">{Math.round(((stats.totalItems - stats.pendingItems) / (stats.totalItems || 1)) * 100)}%</span>
                            </div>
                            <div className="bg-white bg-opacity-20 rounded-pill" style={{ height: '8px' }}>
                                <div
                                    className="bg-white rounded-pill h-100"
                                    style={{ width: `${((stats.totalItems - stats.pendingItems) / (stats.totalItems || 1)) * 100}%` }}
                                ></div>
                            </div>
                        </div>
                        <div style={{ position: 'absolute', right: '-20px', top: '20px', fontSize: '6rem', opacity: '0.1' }}>📈</div>
                    </Card>
                </Col>
            </Row>

            <Row className="g-4">
                <Col lg={12}>
                    <Card className="border-0 shadow-sm overflow-hidden mb-4">
                        <Card.Header className="bg-white py-4 px-4 border-0">
                            <h5 className="fw-bold m-0 text-dark">L&F Management Console</h5>
                        </Card.Header>
                        <Table responsive borderless hover className="m-0 align-middle">
                            <thead className="bg-light text-muted small py-3 text-uppercase">
                                <tr>
                                    <th className="px-4 py-3">Reporter</th>
                                    <th className="py-3">Item Name</th>
                                    <th className="py-3">Type</th>
                                    <th className="py-3">Status</th>
                                    <th className="px-4 py-3 text-end">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {items.map(item => (
                                    <tr key={item._id} className="border-bottom">
                                        <td className="px-4 py-3 fw-bold text-muted small">{item.user_id?.name || 'User'}</td>
                                        <td className="py-3">{item.title}</td>
                                        <td className="py-3">
                                            <Badge pill bg={item.type === 'lost' ? 'danger' : 'success'} className="px-3 py-2 text-uppercase">
                                                {item.type}
                                            </Badge>
                                        </td>
                                        <td className="py-3">
                                            <div className="d-flex align-items-center gap-2">
                                                <span className={`p-1 rounded-circle ${item.status === 'resolved' ? 'bg-success' : 'bg-warning'}`}></span>
                                                <span className="small fw-bold text-muted text-capitalize">{item.status}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-end">
                                            <Form.Select
                                                size="sm"
                                                className="border-0 bg-light w-auto d-inline-block fw-bold"
                                                value={item.status}
                                                onChange={(e) => handleStatusUpdate('item', item._id, e.target.value)}
                                            >
                                                <option value="pending">Pending</option>
                                                <option value="resolved">Resolved</option>
                                            </Form.Select>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </Card>

                    <Card className="border-0 shadow-sm overflow-hidden">
                        <Card.Header className="bg-white py-4 px-4 border-0">
                            <h5 className="fw-bold m-0 text-dark">Complaints Registry</h5>
                        </Card.Header>
                        <Table responsive borderless hover className="m-0 align-middle">
                            <thead className="bg-light text-muted small text-uppercase">
                                <tr>
                                    <th className="px-4 py-3">Complainant</th>
                                    <th className="py-3">Category</th>
                                    <th className="py-3">Status</th>
                                    <th className="px-4 py-3 text-end">Update</th>
                                </tr>
                            </thead>
                            <tbody>
                                {complaints.map(c => (
                                    <tr key={c._id} className="border-bottom">
                                        <td className="px-4 py-3 fw-bold text-muted small">{c.user_id?.name || 'User'}</td>
                                        <td className="py-3">{c.category}</td>
                                        <td className="py-3">
                                            <Badge bg={c.status === 'Resolved' ? 'success' : 'secondary'} className="px-3 py-2">
                                                {c.status}
                                            </Badge>
                                        </td>
                                        <td className="px-4 py-3 text-end">
                                            <Form.Select
                                                size="sm"
                                                className="border-0 bg-light w-auto d-inline-block fw-bold text-primary"
                                                value={c.status}
                                                onChange={(e) => handleStatusUpdate('complaint', c._id, e.target.value)}
                                            >
                                                <option value="Submitted">Submitted</option>
                                                <option value="In Progress">In Progress</option>
                                                <option value="Resolved">Resolved</option>
                                            </Form.Select>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </Card>
                </Col>
            </Row>
        </motion.div>
    );
};

export default AdminDashboard;
