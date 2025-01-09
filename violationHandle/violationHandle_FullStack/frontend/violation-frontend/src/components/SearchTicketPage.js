import React, { useState } from 'react';
import axios from 'axios';

const SearchTicketPage = () => {
    const [licensePlate, setLicensePlate] = useState('');
    const [searchResult, setSearchResult] = useState(null);
    const [error, setError] = useState('');

    const handleSearch = async () => {
        try {
            const response = await axios.get(`http://localhost:3000/api/tickets/by-license`, {params: { licensePlate }});

            setSearchResult(response.data);
            setError('');
        } catch (err) {
            console.error('Error fetching ticket:', err);
            setError('查詢失敗，請確認車牌號碼是否正確');
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <h2>罰單查詢系統</h2>
            <input
                type="text"
                value={licensePlate}
                onChange={(e) => setLicensePlate(e.target.value)}
                placeholder="輸入車牌號碼"
                style={{ padding: '5px', marginRight: '10px' }}
            />
            <button
                onClick={handleSearch}
                style={{
                    padding: '5px 10px',
                    backgroundColor: '#2196F3',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                }}
            >
                查詢
            </button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {searchResult && (
                <div style={{ marginTop: '20px', textAlign: 'left' }}>
                    <h3>罰單詳細資訊</h3>
                    {searchResult.map((ticket, index) => (
                        <div key={index}>
                            <p>違規 ID: {ticket.ViolationID}</p>
                            <p>罰款金額: ${ticket.FineAmount}</p>
                            <p>違規地點: {ticket.ViolationLocation}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SearchTicketPage;
