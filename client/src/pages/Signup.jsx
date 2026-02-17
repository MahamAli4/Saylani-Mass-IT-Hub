import React, { useState } from 'react';
import { Form, Button, Card, Alert, Container, Row, Col, Spinner } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const Signup = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { signup } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            return setError('Passwords do not match');
        }
        try {
            setError('');
            setLoading(true);
            await signup({ name, email, password });
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create an account');
        }
        setLoading(false);
    };

    return (
        <div className="signup-page min-vh-100 d-flex align-items-center py-5" style={{ background: 'linear-gradient(135deg, #f4f7f6 0%, #e2e8f0 100%)' }}>
            <Container>
                <Row className="justify-content-center">
                    <Col xs={12} sm={10} md={8} lg={6}>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5 }}
                        >
                            <Card className="shadow-lg border-0 overflow-hidden rounded-4">
                                <Card.Body className="p-4 p-md-5">
                                    <div className="text-center mb-5">
                                        <h2 className="fw-bold m-0" style={{ color: '#0057a8' }}>
                                            <span style={{ color: '#66b032' }}>Saylani</span> HUB
                                        </h2>
                                        <p className="text-muted small fw-bold">Create new community account</p>
                                    </div>

                                    {error && <Alert variant="danger" className="border-0 shadow-sm mb-4">{error}</Alert>}

                                    <Form onSubmit={handleSubmit}>
                                        <Form.Group className="mb-3">
                                            <Form.Label className="small fw-bold text-muted">FULL NAME</Form.Label>
                                            <Form.Control
                                                type="text"
                                                className="bg-light border-0 py-2 px-4 rounded-3"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                required
                                                placeholder="e.g. Ahmed Khan"
                                            />
                                        </Form.Group>
                                        <Form.Group className="mb-3">
                                            <Form.Label className="small fw-bold text-muted">EMAIL ADDRESS</Form.Label>
                                            <Form.Control
                                                type="email"
                                                className="bg-light border-0 py-2 px-4 rounded-3"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                required
                                                placeholder="e.g. name@saylani.com"
                                            />
                                        </Form.Group>
                                        <Row>
                                            <Col md={6}>
                                                <Form.Group className="mb-3">
                                                    <Form.Label className="small fw-bold text-muted">PASSWORD</Form.Label>
                                                    <Form.Control
                                                        type="password"
                                                        className="bg-light border-0 py-2 px-4 rounded-3"
                                                        value={password}
                                                        onChange={(e) => setPassword(e.target.value)}
                                                        required
                                                        placeholder="••••••••"
                                                    />
                                                </Form.Group>
                                            </Col>
                                            <Col md={6}>
                                                <Form.Group className="mb-4">
                                                    <Form.Label className="small fw-bold text-muted">CONFIRM PASSWORD</Form.Label>
                                                    <Form.Control
                                                        type="password"
                                                        className="bg-light border-0 py-2 px-4 rounded-3"
                                                        value={confirmPassword}
                                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                                        required
                                                        placeholder="••••••••"
                                                    />
                                                </Form.Group>
                                            </Col>
                                        </Row>
                                        <Button
                                            disabled={loading}
                                            className="w-100 fw-bold border-0 py-3 shadow-sm transition-hover"
                                            type="submit"
                                            style={{ backgroundColor: '#66b032' }}
                                        >
                                            {loading ? <Spinner animation="border" size="sm" /> : 'Begin Hub Journey'}
                                        </Button>
                                    </Form>

                                    <div className="text-center mt-4">
                                        <span className="text-muted small">Already a member? </span>
                                        <Link to="/login" className="small fw-bold text-decoration-none" style={{ color: '#0057a8' }}>Login Instead</Link>
                                    </div>
                                </Card.Body>
                            </Card>
                        </motion.div>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default Signup;
