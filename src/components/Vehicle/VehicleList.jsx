import React, { useState, useEffect } from 'react'
import api from '../../services/api'
import VehicleCard from './VehicleCard'
import { Filter, Search } from 'lucide-react'
const VehicleList = () => {
    const [vehicles, setVehicles] = useState([])
    const [searchTerm, setSearchTerm] = useState('')
    const [loading, setLoading] = useState(true)
    useEffect(() => {
        const fetchVehicles = async () => {
            try {
                const { data } = await api.get('/vehicles')
                setVehicles(data)
            } catch (error) {
                console.error('Error fetching vehicles', error)
            } finally {
                setLoading(false)
            }
        }
        fetchVehicles()
    }, [])
    const filteredVehicles = vehicles.filter(v => 
        v.vehicleName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.vehicleType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (v.regNumber && v.regNumber.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    if (loading) return <div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>Loading Fleet...</div>
    return (
        <div className="container" style={{ padding: '4rem 0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                    <h2 style={{ fontSize: '2rem', fontWeight: 700 }}>Available Fleet</h2>
                    <p style={{ color: '#64748b' }}>Choose from our diverse collection of premium vehicles.</p>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <div style={{ position: 'relative' }}>
                        <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                        <input
                            type="text"
                            placeholder="Search by model, type or plate..."
                            className="input"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ paddingLeft: '2.5rem', width: '300px' }}
                        />
                    </div>
                </div>
            </div>
            <div className="vehicle-grid">
                {filteredVehicles.length > 0 ? (
                    filteredVehicles.map(v => <VehicleCard key={v._id} vehicle={v} />)
                ) : (
                    <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '4rem', background: 'white', borderRadius: '16px', border: '1px dashed #cbd5e1' }}>
                        <p style={{ color: '#64748b' }}>No vehicles match your search query.</p>
                    </div>
                )}
            </div>
        </div>
    )
}
export default VehicleList
