import React, { useState } from 'react';

const SearchTicketPage = ({ onClose }) => {
    const [licensePlate, setLicensePlate] = useState('');
    const [searchResult, setSearchResult] = useState(null);

    const handleSearch = async () => {
        // 模擬 API 請求
        console.log(`正在查詢車牌號碼: ${licensePlate}`);
        // 假設從後端獲取的罰單結果
        const mockResult = {
            ViolationID: '123',
            FineAmount: 500,
            ViolationDate: '2024-01-01',
            ViolationTime: '12:00:00',
            ViolationLocation: '台北市信義路',
        };
        setSearchResult(mockResult); // 將模擬結果設為查詢結果
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
            {searchResult && (
                <div style={{ marginTop: '20px', textAlign: 'left' }}>
                    <h3>罰單詳細資訊</h3>
                    <p>違規 ID: {searchResult.ViolationID}</p>
                    <p>罰款金額: ${searchResult.FineAmount}</p>
                    <p>違規日期: {searchResult.ViolationDate}</p>
                    <p>違規時間: {searchResult.ViolationTime}</p>
                    <p>違規地點: {searchResult.ViolationLocation}</p>
                </div>
            )}
            <button
                onClick={onClose}
                style={{
                    marginTop: '20px',
                    padding: '10px 20px',
                    backgroundColor: '#FF5722',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                }}
            >
                返回罰單頁面
            </button>
        </div>
    );
};

export default SearchTicketPage;
