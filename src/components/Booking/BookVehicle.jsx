import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../../services/api'
import { Calendar, CreditCard, CheckCircle, Info } from 'lucide-react'
import ReceiptModal from './ReceiptModal'
const BookVehicle = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const [vehicle, setVehicle] = useState(null)
    const [startDate, setStartDate] = useState('')
    const [endDate, setEndDate] = useState('')
    const [totalPrice, setTotalPrice] = useState(0)
    const [createdBooking, setCreatedBooking] = useState(null)
    const [errorMsg, setErrorMsg] = useState('')
    useEffect(() => {
        const fetchVehicle = async () => {
            try {
                const { data } = await api.get('/vehicles')
                const found = data.find(v => v._id === id)
                setVehicle(found)
            } catch (error) {
                console.error('Error fetching vehicle', error)
            }
        }
        fetchVehicle()
    }, [id])
    useEffect(() => {
        if (startDate && endDate && vehicle) {
            const start = new Date(startDate)
            const end = new Date(endDate)
            const diffTime = end - start
            if (diffTime >= 0) {
                const days = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)))
                let price = days * vehicle.pricePerDay
                if (days >= 7) price *= 0.9
                setTotalPrice(Math.round(price))
                setErrorMsg('')
            } else {
                setTotalPrice(0)
                setErrorMsg('Return date cannot be earlier than Pick-up date.')
            }
        }
    }, [startDate, endDate, vehicle])
    const handleBooking = async () => {
        const user = JSON.parse(localStorage.getItem('userInfo'))
        if (!user) {
            alert('Please login to book a vehicle')
            navigate('/login')
            return
        }
        setErrorMsg('')
        try {
            const { data } = await api.post('/bookings', {
                customerId: user._id,
                vehicleId: id,
                startDate,
                endDate,
                totalAmount: totalPrice
            })
            // Set created booking to trigger receipt modal
            setCreatedBooking(data)
        } catch (error) {
            const msg = error.response?.data?.message || 'Booking Failed. Please try again.'
            setErrorMsg(msg)
        }
    }
    if (!vehicle) return <div className="container" style={{ padding: '4rem 0' }}>Loading Vehicle...</div>
    return (
        <div className="container" style={{ padding: '4rem 0' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem' }}>
                {/* Vehicle Preview */}
                <div>
                    <img
                        src={vehicle.imageUrl || `https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&q=80&w=800`}
                        alt={vehicle.vehicleName}
                        style={{ width: '100%', borderRadius: '16px', boxShadow: 'var(--shadow)', marginBottom: '1.5rem', objectFit: 'cover', height: '260px' }}
                    />
                    <h2 style={{ fontSize: '2rem', fontWeight: 700 }}>{vehicle.vehicleName}</h2>
                    <p style={{ color: '#64748b', fontSize: '1.1rem', marginBottom: '1.5rem' }}>{vehicle.vehicleType}</p>
                    <div style={{ padding: '1.5rem', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                        <h4 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Info size={18} color="#2563eb" /> Pricing Details
                        </h4>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                            <span>Base Rate</span>
                            <span style={{ fontWeight: 600 }}>₹{vehicle.pricePerDay}/day</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', color: '#10b981' }}>
                            <span>Weekly Discount (7+ days)</span>
                            <span>10% OFF</span>
                        </div>
                        {vehicle.regNumber && (
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem', paddingTop: '0.5rem', borderTop: '1px solid #e2e8f0' }}>
                                <span>Reg. Number</span>
                                <span style={{ fontWeight: 600, color: '#2563eb' }}>{vehicle.regNumber}</span>
                            </div>
                        )}
                    </div>
                </div>
                {/* Booking Form */}
                <div style={{ background: 'white', padding: '2.5rem', borderRadius: '16px', boxShadow: 'var(--shadow-lg)', border: '1px solid #e2e8f0' }}>
                    <h3 style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <Calendar size={24} color="#2563eb" /> Select Rental Dates
                    </h3>
                    {errorMsg && (
                        <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#991b1b', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                            {errorMsg}
                        </div>
                    )}
                    <div className="form-group">
                        <label className="label">Pick-up Date</label>
                        <input type="date" className="input" value={startDate} onChange={e => setStartDate(e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label className="label">Return Date</label>
                        <input type="date" className="input" value={endDate} onChange={e => setEndDate(e.target.value)} />
                    </div>
                    <div style={{ borderTop: '1px solid #e2e8f0', marginTop: '2rem', paddingTop: '2rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <span style={{ fontSize: '1.25rem', fontWeight: 500 }}>Total Price</span>
                            <span style={{ fontSize: '2rem', fontWeight: 700, color: '#2563eb' }}>₹{totalPrice}</span>
                        </div>
                        <button
                            className="btn-primary"
                            style={{ width: '100%', justifyContent: 'center', padding: '1rem' }}
                            onClick={handleBooking}
                            disabled={!startDate || !endDate || totalPrice <= 0}
                        >
                            <CreditCard size={20} /> Complete Booking
                        </button>
                        <p style={{ textAlign: 'center', color: '#94a3b8', fontSize: '0.75rem', marginTop: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem' }}>
                            <CheckCircle size={12} /> Instant Receipt & Secured Booking
                        </p>
                    </div>
                </div>
            </div>
            {/* Receipt Modal */}
            {createdBooking && (
                <ReceiptModal
                    booking={createdBooking}
                    onClose={() => {
                        setCreatedBooking(null);
                        navigate('/dashboard');
                    }}
                    onNavigateDashboard={() => {
                        setCreatedBooking(null);
                        navigate('/dashboard');
                    }}
                />
            )}
        </div>
    )
}
export default BookVehicle
