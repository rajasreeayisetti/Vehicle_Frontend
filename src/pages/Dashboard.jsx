import React, { useState, useEffect } from 'react'
import api from '../services/api'
import { Car, DollarSign, FileText, CheckCircle2, Clock } from 'lucide-react'
import ReceiptModal from '../components/Booking/ReceiptModal'
const Dashboard = () => {
    const [bookings, setBookings] = useState([])
    const [loading, setLoading] = useState(true)
    const [user, setUser] = useState(null)
    const [selectedReceiptBooking, setSelectedReceiptBooking] = useState(null)
    useEffect(() => {
        const userInfo = localStorage.getItem('userInfo')
        if (userInfo) {
            setUser(JSON.parse(userInfo))
        }
        const fetchMyBookings = async () => {
            try {
                const user = JSON.parse(localStorage.getItem('userInfo'))
                if (user) {
                    const { data } = await api.get(`/customers/${user._id}/bookings`)
                    setBookings(data)
                }
            } catch (error) {
                console.error('Error fetching bookings', error)
            } finally {
                setLoading(false)
            }
        }
        fetchMyBookings()
    }, [])
    const activeCount = bookings.filter(b => b.status === 'Active' || (!b.status && new Date(b.endDate) >= new Date())).length
    const completedCount = bookings.filter(b => b.status === 'Completed' || (!b.status && new Date(b.endDate) < new Date())).length
    const totalSpent = bookings.reduce((acc, b) => acc + (b.totalAmount || 0), 0)
    if (loading) {
        return <div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>Loading your dashboard...</div>
    }
    return (
        <div className="container" style={{ padding: '4rem 0' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '2rem' }}>
                Welcome, {user ? user.name : 'Guest'}! <span style={{ color: '#64748b', fontWeight: 400, fontSize: '1.25rem' }}>Here are your bookings.</span>
            </h2>
            {/* Metrics Row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
                <div style={{ padding: '1.5rem', background: 'white', borderRadius: '12px', boxShadow: 'var(--shadow)', border: '1px solid #e2e8f0' }}>
                    <div style={{ color: '#2563eb', marginBottom: '1rem' }}><Car size={24} /></div>
                    <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Active Bookings</p>
                    <p style={{ fontSize: '1.75rem', fontWeight: 700 }}>{activeCount}</p>
                </div>
                <div style={{ padding: '1.5rem', background: 'white', borderRadius: '12px', boxShadow: 'var(--shadow)', border: '1px solid #e2e8f0' }}>
                    <div style={{ color: '#0284c7', marginBottom: '1rem' }}><CheckCircle2 size={24} /></div>
                    <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Completed Rentals</p>
                    <p style={{ fontSize: '1.75rem', fontWeight: 700 }}>{completedCount}</p>
                </div>
                <div style={{ padding: '1.5rem', background: 'white', borderRadius: '12px', boxShadow: 'var(--shadow)', border: '1px solid #e2e8f0' }}>
                    <div style={{ color: '#10b981', marginBottom: '1rem' }}><DollarSign size={24} /></div>
                    <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Total Spent</p>
                    <p style={{ fontSize: '1.75rem', fontWeight: 700 }}>₹{totalSpent}</p>
                </div>
            </div>
            {/* Bookings Table */}
            <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: 'var(--shadow)' }}>
                <div style={{ padding: '1.25rem 1.5rem', background: '#f8fafc', borderBottom: '1px solid #e2e8f0', fontWeight: 700 }}>
                    My Rental Bookings History
                </div>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                            <tr>
                                <th style={{ padding: '1.25rem' }}>Vehicle</th>
                                <th style={{ padding: '1.25rem' }}>Reg. Number</th>
                                <th style={{ padding: '1.25rem' }}>Start Date</th>
                                <th style={{ padding: '1.25rem' }}>End Date</th>
                                <th style={{ padding: '1.25rem' }}>Amount</th>
                                <th style={{ padding: '1.25rem' }}>Status</th>
                                <th style={{ padding: '1.25rem' }}>Receipt</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bookings.length > 0 ? bookings.map(b => {
                                const isCompleted = b.status === 'Completed' || new Date(b.endDate) < new Date();
                                const statusLabel = isCompleted ? 'Completed' : 'Active';
                                const regNo = b.vehicleId?.regNumber || (`DE-` + String(b._id).slice(-6).toUpperCase());
                                return (
                                    <tr key={b._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                        <td style={{ padding: '1.25rem', fontWeight: 600 }}>
                                            {b.vehicleId?.vehicleName || 'Vehicle'}
                                            <span style={{ display: 'block', fontSize: '0.75rem', color: '#64748b', fontWeight: 400 }}>
                                                {b.vehicleId?.vehicleType}
                                            </span>
                                        </td>
                                        <td style={{ padding: '1.25rem' }}>
                                            <span style={{ background: '#f1f5f9', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.85rem', fontWeight: 600 }}>
                                                {regNo}
                                            </span>
                                        </td>
                                        <td style={{ padding: '1.25rem' }}>{new Date(b.startDate).toLocaleDateString()}</td>
                                        <td style={{ padding: '1.25rem' }}>{new Date(b.endDate).toLocaleDateString()}</td>
                                        <td style={{ padding: '1.25rem', fontWeight: 700, color: '#2563eb' }}>₹{b.totalAmount}</td>
                                        <td style={{ padding: '1.25rem' }}>
                                            <span className={`badge ${isCompleted ? 'badge-success' : 'badge-success'}`} style={{
                                                background: isCompleted ? '#e0f2fe' : '#dcfce7',
                                                color: isCompleted ? '#0369a1' : '#166534'
                                            }}>
                                                {statusLabel}
                                            </span>
                                        </td>
                                        <td style={{ padding: '1.25rem' }}>
                                            <button
                                                onClick={() => setSelectedReceiptBooking(b)}
                                                className="btn-primary"
                                                style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', background: '#2563eb' }}
                                            >
                                                <FileText size={14} /> View Receipt
                                            </button>
                                        </td>
                                    </tr>
                                );
                            }) : (
                                <tr>
                                    <td colSpan="7" style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>No bookings found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            {/* Receipt Modal */}
            {selectedReceiptBooking && (
                <ReceiptModal
                    booking={selectedReceiptBooking}
                    onClose={() => setSelectedReceiptBooking(null)}
                />
            )}
        </div>
    )
}
export default Dashboard;
