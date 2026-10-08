import React from 'react';
import { Download, X, CheckCircle, Car, Calendar, CreditCard, User, ShieldCheck } from 'lucide-react';
const ReceiptModal = ({ booking, onClose, onNavigateDashboard }) => {
    if (!booking) return null;
    const customerName = booking.customerId?.name || booking.customerName || 'Customer';
    const customerEmail = booking.customerId?.email || '';
    const customerPhone = booking.customerId?.phone || '';
    const vehicle = booking.vehicleId || {};
    const vehicleName = vehicle.vehicleName || booking.vehicleName || 'Vehicle';
    const vehicleType = vehicle.vehicleType || booking.vehicleType || '';
    const regNumber = vehicle.regNumber || (`DE-` + String(vehicle._id || booking._id || '').slice(-6).toUpperCase());
    const pricePerDay = vehicle.pricePerDay || 0;
    const startDate = new Date(booking.startDate);
    const endDate = new Date(booking.endDate);
    const diffTime = Math.abs(endDate - startDate);
    const days = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
    const bookingDateStr = booking.createdAt 
        ? new Date(booking.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
        : new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    const startDateStr = startDate.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    const endDateStr = endDate.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    const rawPdfUrl = booking.invoiceUrl || `/invoices/invoice_${booking._id}.pdf`;
    const backendOrigin = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace(/\/api\/?$/, '') : '';
    const pdfUrl = rawPdfUrl.startsWith('http') ? rawPdfUrl : `${backendOrigin}${rawPdfUrl}`;
    const handleDownload = () => {
        const link = document.createElement('a');
        link.href = pdfUrl;
        link.download = `DriveEase_Invoice_${booking._id}.pdf`;
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 3000,
            padding: '1.5rem',
            animation: 'fadeIn 0.2s ease-out'
        }}>
            <div style={{
                background: '#ffffff',
                borderRadius: '20px',
                maxWidth: '650px',
                width: '100%',
                maxHeight: '90vh',
                overflowY: 'auto',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                border: '1px solid #e2e8f0',
                position: 'relative'
            }}>
                {/* Modal Header */}
                <div style={{
                    background: 'linear-gradient(135deg, #1e40af 0%, #2563eb 100%)',
                    padding: '2rem',
                    color: 'white',
                    borderTopLeftRadius: '20px',
                    borderTopRightRadius: '20px',
                    position: 'relative'
                }}>
                    <button 
                        onClick={onClose}
                        style={{
                            position: 'absolute',
                            top: '1.25rem',
                            right: '1.25rem',
                            background: 'rgba(255, 255, 255, 0.15)',
                            border: 'none',
                            color: 'white',
                            width: '36px',
                            height: '36px',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer'
                        }}
                    >
                        <X size={20} />
                    </button>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                        <Car size={32} />
                        <span style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.02em' }}>DriveEase</span>
                    </div>
                    <p style={{ opacity: 0.9, fontSize: '0.95rem', fontWeight: 500 }}>Rental Booking Receipt & Payment Invoice</p>
                </div>
                {/* Modal Content */}
                <div style={{ padding: '2rem' }}>
                    {/* Status Banner */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        background: '#f0fdf4',
                        border: '1px solid #bbf7d0',
                        borderRadius: '12px',
                        padding: '1rem 1.25rem',
                        marginBottom: '1.5rem'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#166534' }}>
                            <CheckCircle size={24} />
                            <div>
                                <p style={{ fontWeight: 700, fontSize: '0.95rem' }}>Payment Status: {booking.paymentStatus || 'Paid'}</p>
                                <p style={{ fontSize: '0.8rem', color: '#15803d' }}>Confirmed on {bookingDateStr}</p>
                            </div>
                        </div>
                        <span className="badge badge-success" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}>
                            {booking.status || 'Active'}
                        </span>
                    </div>
                    {/* Customer & Booking ID Grid */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '1rem',
                        background: '#f8fafc',
                        padding: '1.25rem',
                        borderRadius: '12px',
                        border: '1px solid #e2e8f0',
                        marginBottom: '1.5rem'
                    }}>
                        <div>
                            <p style={{ color: '#64748b', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.25rem' }}>Customer Details</p>
                            <p style={{ fontWeight: 700, color: '#0f172a', fontSize: '1rem' }}>{customerName}</p>
                            {customerEmail && <p style={{ color: '#475569', fontSize: '0.85rem' }}>{customerEmail}</p>}
                            {customerPhone && <p style={{ color: '#475569', fontSize: '0.85rem' }}>{customerPhone}</p>}
                        </div>
                        <div>
                            <p style={{ color: '#64748b', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.25rem' }}>Booking Metadata</p>
                            <p style={{ fontSize: '0.85rem', color: '#475569' }}><strong style={{ color: '#0f172a' }}>Booking ID:</strong> {booking._id}</p>
                            <p style={{ fontSize: '0.85rem', color: '#475569' }}><strong style={{ color: '#0f172a' }}>Invoice No:</strong> INV-{String(booking._id).slice(-8).toUpperCase()}</p>
                            <p style={{ fontSize: '0.85rem', color: '#475569' }}><strong style={{ color: '#0f172a' }}>Booking Date:</strong> {bookingDateStr}</p>
                        </div>
                    </div>
                    {/* Vehicle & Duration Breakdown */}
                    <div style={{
                        border: '1px solid #e2e8f0',
                        borderRadius: '12px',
                        overflow: 'hidden',
                        marginBottom: '1.5rem'
                    }}>
                        <div style={{ background: '#f1f5f9', padding: '0.75rem 1.25rem', fontWeight: 700, fontSize: '0.9rem', color: '#334155' }}>
                            Rental Specifications
                        </div>
                        <div style={{ padding: '1.25rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', paddingBottom: '0.75rem', borderBottom: '1px solid #f1f5f9' }}>
                                <span style={{ color: '#64748b', fontSize: '0.9rem' }}>Vehicle Model</span>
                                <span style={{ fontWeight: 700, color: '#0f172a' }}>{vehicleName} {vehicleType ? `(${vehicleType})` : ''}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', paddingBottom: '0.75rem', borderBottom: '1px solid #f1f5f9' }}>
                                <span style={{ color: '#64748b', fontSize: '0.9rem' }}>Vehicle Registration No.</span>
                                <span style={{ fontWeight: 600, color: '#2563eb', background: '#eff6ff', padding: '0.2rem 0.6rem', borderRadius: '6px' }}>{regNumber}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', paddingBottom: '0.75rem', borderBottom: '1px solid #f1f5f9' }}>
                                <span style={{ color: '#64748b', fontSize: '0.9rem' }}>Pickup (Start) Date</span>
                                <span style={{ fontWeight: 600, color: '#0f172a' }}>{startDateStr}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', paddingBottom: '0.75rem', borderBottom: '1px solid #f1f5f9' }}>
                                <span style={{ color: '#64748b', fontSize: '0.9rem' }}>Return (End) Date</span>
                                <span style={{ fontWeight: 600, color: '#0f172a' }}>{endDateStr}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: '#64748b', fontSize: '0.9rem' }}>Rental Duration</span>
                                <span style={{ fontWeight: 600, color: '#0f172a' }}>{days} Day(s)</span>
                            </div>
                        </div>
                    </div>
                    {/* Price Breakdown */}
                    <div style={{
                        background: '#fafafa',
                        borderRadius: '12px',
                        padding: '1.25rem',
                        border: '1px dashed #cbd5e1',
                        marginBottom: '2rem'
                    }}>
                        {pricePerDay > 0 && (
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', color: '#475569', fontSize: '0.9rem' }}>
                                <span>Daily Rate (₹{pricePerDay} × {days} days)</span>
                                <span>₹{pricePerDay * days}</span>
                            </div>
                        )}
                        {days >= 7 && (
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', color: '#16a34a', fontSize: '0.9rem', fontWeight: 600 }}>
                                <span>Weekly Special Discount (10% OFF)</span>
                                <span>-₹{Math.round(pricePerDay * days * 0.1)}</span>
                            </div>
                        )}
                        <div style={{
                            display: 'flex',
                            justify: 'space-between',
                            alignItems: 'center',
                            marginTop: '0.75rem',
                            paddingTop: '0.75rem',
                            borderTop: '2px solid #e2e8f0'
                        }}>
                            <span style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a' }}>Total Amount Paid</span>
                            <span style={{ fontSize: '1.5rem', fontWeight: 800, color: '#2563eb' }}>₹{booking.totalAmount}</span>
                        </div>
                    </div>
                    {/* Actions */}
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button
                            onClick={handleDownload}
                            className="btn-primary"
                            style={{ flex: 1, justifyContent: 'center', padding: '0.85rem' }}
                        >
                            <Download size={18} /> Download Receipt (PDF)
                        </button>
                        {onNavigateDashboard ? (
                            <button
                                onClick={onNavigateDashboard}
                                style={{
                                    padding: '0.85rem 1.5rem',
                                    borderRadius: 'var(--radius)',
                                    fontWeight: 600,
                                    background: '#f1f5f9',
                                    color: '#1e293b'
                                }}
                            >
                                Go to My Bookings
                            </button>
                        ) : (
                            <button
                                onClick={onClose}
                                style={{
                                    padding: '0.85rem 1.5rem',
                                    borderRadius: 'var(--radius)',
                                    fontWeight: 600,
                                    background: '#f1f5f9',
                                    color: '#1e293b'
                                }}
                            >
                                Close
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
export default ReceiptModal;
