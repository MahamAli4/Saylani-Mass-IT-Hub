import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Spinner, Table, Form, Alert } from 'react-bootstrap';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
    Package,
    AlertCircle,
    Users,
    CheckCircle,
    ArrowRight,
    TrendingUp,
    ShieldCheck,
    Activity,
    PieChart as ChartIcon,
    User
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import axios from 'axios';

const Dashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Shared State for Counts/Stats
    const [stats, setStats] = useState({
        lostFound: 0,
        complaints: 0,
        volunteers: 0,
        pendingItems: 0,
        activeComplaints: 0
    });

    // Admin Specific State
    const [adminItems, setAdminItems] = useState([]);
    const [adminComplaints, setAdminComplaints] = useState([]);

    const fetchData = async () => {
        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };

            if (user?.role === 'admin') {
                // Admin Fetch Pattern
                const [itemsRes, complaintsRes, volunteerRes] = await Promise.all([
                    axios.get('/api/items', config),
                    axios.get('/api/complaints', config),
                    axios.get('/api/volunteers', config)
                ]);

                setAdminItems(itemsRes.data);
                setAdminComplaints(complaintsRes.data);

                setStats({
                    lostFound: itemsRes.data.length,
                    complaints: complaintsRes.data.length,
                    volunteers: volunteerRes.data.length,
                    pendingItems: itemsRes.data.filter(i => i.status === 'pending').length,
                    activeComplaints: complaintsRes.data.filter(c => c.status !== 'Resolved').length
                });
            } else {
                // User Fetch Pattern
                const [lf, comp, vol] = await Promise.all([
                    axios.get('/api/items/my-items', config),
                    axios.get('/api/complaints/my', config),
                    axios.get('/api/volunteers', config)
                ]);

                setStats({
                    lostFound: lf.data.length,
                    complaints: comp.data.length,
                    volunteers: vol.data.length
                });
            }
        } catch (err) {
            console.error(err);
            setError('Failed to sync dashboard data.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) fetchData();
    }, [user]);

    const handleAdminStatusUpdate = async (type, id, newStatus) => {
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

    // Chart Data Generation
    const chartData = user?.role === 'admin'
        ? [
            { name: 'Lost Items', value: adminItems.filter(i => i.type === 'lost').length, color: '#dc3545' },
            { name: 'Found Items', value: adminItems.filter(i => i.type === 'found').length, color: '#66b032' },
            { name: 'Complaints', value: adminComplaints.length, color: '#0057a8' }
        ]
        : [
            { name: 'My Items', value: stats.lostFound, color: '#0057a8' },
            { name: 'My Complaints', value: stats.complaints, color: '#dc3545' },
            { name: 'Volunteerings', value: stats.volunteers > 0 ? stats.volunteers : 1, color: '#66b032' }
        ];

    if (loading) return (
        <div className="text-center py-5">
            <Spinner animation="grow" variant={user?.role === 'admin' ? 'danger' : 'primary'} />
            <p className="mt-3 text-muted fw-bold">Linking {user?.role === 'admin' ? 'Command Center' : 'User Hub'}...</p>
        </div>
    );

    const StatCard = ({ title, count, icon, color, sub, onClick }) => (
        <Col xs={12} sm={6} md={user?.role === 'admin' ? 3 : 4}>
            <motion.div whileHover={{ scale: 1.02 }} transition={{ type: 'spring' }} onClick={onClick} className={onClick ? 'cursor-pointer' : ''}>
                <Card className="border-0 shadow-sm p-3 h-100">
                    <Card.Body className="d-flex align-items-center gap-3">
                        <div className="p-3 rounded-4 shadow-sm" style={{ backgroundColor: `${color}15`, color: color }}>
                            {icon}
                        </div>
                        <div>
                            <h3 className="fw-bold mb-0">{count}</h3>
                            <small className="text-muted fw-bold d-block text-uppercase small" style={{ fontSize: '10px' }}>{title}</small>
                            {sub && <small className="text-muted small">{sub}</small>}
                        </div>
                    </Card.Body>
                </Card>
            </motion.div>
        </Col>
    );

    return (
        <div className="dashboard-content px-1">
            {/* Unified Role Header */}
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 mb-md-5 p-3 p-md-4 rounded-4 bg-white border shadow-sm d-flex flex-column flex-sm-row justify-content-between align-items-center gap-3"
                style={{ borderLeft: `6px solid ${user?.role === 'admin' ? '#dc3545' : '#66b032'}` }}
            >
                <div className="d-flex align-items-center gap-3">
                    <div className={`p-3 rounded-circle bg-light shadow-sm ${user?.role === 'admin' ? 'text-danger' : 'text-success'}`}>
                        {user?.role === 'admin' ? <ShieldCheck size={24} /> : <CheckCircle size={24} />}
                    </div>
                    <div>
                        <h4 className="fw-bold m-0">{user?.role === 'admin' ? 'Executive Command Center' : 'User Hub Portal'}</h4>
                        <p className="text-muted m-0 small">
                            Welcome, <strong>{user?.name}</strong>. {user?.role === 'admin' ? 'Global Oversight & Master Management Active.' : 'Here is your campus activity overview.'}
                        </p>
                    </div>
                </div>
                <Badge bg={user?.role === 'admin' ? 'danger' : 'success'} pill className="px-4 py-2">
                    {user?.role === 'admin' ? 'ADMIN MASTER' : 'HUB MEMBER'}
                </Badge>
            </motion.div>

            {error && <Alert variant="danger" className="border-0 shadow-sm mb-4">{error}</Alert>}

            {user?.role === 'admin' ? (
                // --- ADMIN VIEW ---
                <>
                    <Row className="g-4 mb-5">
                        <StatCard title="Campus Reports" count={stats.lostFound} icon={<Package />} color="#0057a8" />
                        <StatCard title="Pending Review" count={stats.pendingItems} icon={<Activity />} color="#dc3545" />
                        <StatCard title="Open Issues" count={stats.activeComplaints} icon={<AlertCircle />} color="#f59e0b" />
                        <StatCard title="Active Heroes" count={stats.volunteers} icon={<Users />} color="#10b981" />
                    </Row>

                    <Row className="g-4 mb-5">
                        <Col lg={8}>
                            <Card className="border-0 shadow-sm h-100 p-4">
                                <h5 className="fw-bold mb-4 d-flex align-items-center gap-2">
                                    <ChartIcon size={20} className="text-primary" /> Global Report Distribution
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
                                <h5 className="fw-bold mb-3">System Health</h5>
                                <p className="small opacity-75 mb-4">Master management mode enabled. All campus facilities are operating within normal parameters.</p>
                                <div className="mt-auto">
                                    <div className="d-flex justify-content-between mb-2">
                                        <span className="small">Resolution Speed</span>
                                        <span className="small fw-bold">{Math.round(((stats.lostFound - stats.pendingItems) / (stats.lostFound || 1)) * 100)}%</span>
                                    </div>
                                    <div className="bg-white bg-opacity-20 rounded-pill" style={{ height: '8px' }}>
                                        <div
                                            className="bg-white rounded-pill h-100"
                                            style={{ width: `${((stats.lostFound - stats.pendingItems) / (stats.lostFound || 1)) * 100}%` }}
                                        ></div>
                                    </div>
                                </div>
                                <div style={{ position: 'absolute', right: '-20px', top: '20px', fontSize: '6rem', opacity: '0.1' }}>⚙️</div>
                            </Card>
                        </Col>
                    </Row>

                    <Row className="g-4">
                        <Col lg={12}>
                            <Card className="border-0 shadow-sm overflow-hidden mb-4">
                                <Card.Header className="bg-white py-4 px-4 border-0">
                                    <h5 className="fw-bold m-0 text-dark">L&F Management Queue</h5>
                                </Card.Header>
                                <Table responsive borderless hover className="m-0 align-middle">
                                    <thead className="bg-light text-muted small py-3 text-uppercase">
                                        <tr>
                                            <th className="px-4 py-3">Reporter</th>
                                            <th className="py-3">Item</th>
                                            <th className="py-3">Status</th>
                                            <th className="px-4 py-3 text-end">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {adminItems.slice(0, 5).map(item => (
                                            <tr key={item._id} className="border-bottom text-muted">
                                                <td className="px-4 py-3 fw-bold small">{item.user_id?.name || 'User'}</td>
                                                <td className="py-3">{item.title}</td>
                                                <td className="py-3">
                                                    <Badge bg={item.status === 'resolved' ? 'success' : 'warning'} className="px-3 py-2 text-uppercase">
                                                        {item.status}
                                                    </Badge>
                                                </td>
                                                <td className="px-4 py-3 text-end">
                                                    <Form.Select
                                                        size="sm"
                                                        className="border-0 bg-light w-auto d-inline-block fw-bold"
                                                        value={item.status}
                                                        onChange={(e) => handleAdminStatusUpdate('item', item._id, e.target.value)}
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
                        </Col>
                    </Row>
                </>
            ) : (
                // --- USER VIEW ---
                <>
                    <Row className="g-4 mb-5">
                        <StatCard
                            title="My Reports" count={stats.lostFound} icon={<Package size={24} />} color="#0057a8" sub="Items reported"
                            onClick={() => navigate('/lost-found')}
                        />
                        <StatCard
                            title="Active Issues" count={stats.complaints} icon={<AlertCircle size={24} />} color="#dc3545" sub="Tracking now"
                            onClick={() => navigate('/complaints')}
                        />
                        <StatCard
                            title="Volunteer Hub" count={stats.volunteers} icon={<Users size={24} />} color="#66b032" sub="Community status"
                            onClick={() => navigate('/volunteer')}
                        />
                    </Row>

                    <Row className="g-4 mb-5">
                        <Col lg={7}>
                            <Card className="border-0 shadow-sm p-4 h-100">
                                <h5 className="fw-bold mb-4 d-flex align-items-center gap-2">
                                    <TrendingUp size={20} className="text-primary" /> Personal Activity Breakdown
                                </h5>
                                <div style={{ width: '100%', height: 250 }}>
                                    <ResponsiveContainer>
                                        <PieChart>
                                            <Pie
                                                data={chartData}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={50}
                                                outerRadius={70}
                                                paddingAngle={5}
                                                dataKey="value"
                                            >
                                                {chartData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                                ))}
                                            </Pie>
                                            <Tooltip />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                                <div className="d-flex justify-content-center gap-4 mt-3 small fw-bold text-muted" style={{ fontSize: '10px' }}>
                                    <div className="d-flex align-items-center gap-1"><span className="p-1 rounded-circle" style={{ backgroundColor: '#0057a8' }}></span> Items</div>
                                    <div className="d-flex align-items-center gap-1"><span className="p-1 rounded-circle" style={{ backgroundColor: '#dc3545' }}></span> Issues</div>
                                    <div className="d-flex align-items-center gap-1"><span className="p-1 rounded-circle" style={{ backgroundColor: '#66b032' }}></span> Heroism</div>
                                </div>
                            </Card>
                        </Col>
                        <Col lg={5}>
                            <Row className="g-4 h-100">
                                <Col xs={12}>
                                    <Card className="border-0 shadow-sm p-4 bg-primary text-white transition-hover h-100 cursor-pointer" onClick={() => navigate('/lost-found')}>
                                        <div className="d-flex justify-content-between align-items-start">
                                            <div><h5 className="fw-bold">Report Found Item</h5><p className="mb-0 small opacity-75">Help the community.</p></div>
                                            <ArrowRight size={20} />
                                        </div>
                                    </Card>
                                </Col>
                                <Col xs={12}>
                                    <Card className="border-0 shadow-sm p-4 bg-success text-white transition-hover h-100 cursor-pointer" onClick={() => navigate('/volunteer')}>
                                        <div className="d-flex justify-content-between align-items-start">
                                            <div><h5 className="fw-bold">Join Volunteers</h5><p className="mb-0 small opacity-75">Sign up for events.</p></div>
                                            <ArrowRight size={20} />
                                        </div>
                                    </Card>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </>
            )}

            <Card className="border-0 shadow-sm p-5 text-center bg-light">
                <h5 className="fw-bold text-muted mb-2">Notice Board</h5>
                <p className="text-muted small m-0">No new announcements from the administration today. Keep checking for updates!</p>
            </Card>
        </div>
    );
};

export default Dashboard;
