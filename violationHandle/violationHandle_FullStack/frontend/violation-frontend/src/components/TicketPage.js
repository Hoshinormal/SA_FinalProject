import React from 'react';
import ReactDOM from 'react-dom/client';
import SearchTicketPage from './SearchTicketPage'; 


const TicketPage = ({ ticketData, onClose }) => {
    // 格式化日期的函數
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return 'Invalid Date';
        return date.toLocaleString('zh-TW', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        });
    }
    //const [showSearchPage, setShowSearchPage] = useState(false);

    const handleConfirmNotification =() => {
        const newWindow = window.open('', '_blank');
        if (newWindow) {
            newWindow.document.title = '罰單查詢系統';

            // 在新分頁中加入一個 div 作為 React 的根元素
            const rootDiv = newWindow.document.createElement('div');
            newWindow.document.body.appendChild(rootDiv);

            // 在新分頁中渲染 React 組件
            const root = ReactDOM.createRoot(rootDiv);
            root.render(
                <React.StrictMode>
                    <SearchTicketPage />
                </React.StrictMode>
            );
        } else {
            console.error('無法打開新分頁');
        }
    };


    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000
        }}>
            <div style={{
                backgroundColor: 'white',
                padding: '20px',
                borderRadius: '10px',
                maxWidth: '500px',
                width: '90%'
            }}>
                <h2>罰單簡要資訊</h2>
                {ticketData ? (
                    <div>
                        <p>罰單 ID: {ticketData.TicketID}</p>
                        <p>違規 ID: {ticketData.ViolationID}</p>
                        <p>罰款金額: ${ticketData.FineAmount}</p>
                        <p>開立日期: {formatDate(ticketData.CompletionTime)}</p>
                        <p>處理狀態: {ticketData.NotificationStatus ? '罰單已通知車主' : '罰單尚未通知車主'}</p>
                    </div>
                ) : (
                    <p>無罰單資料</p>
                )}
                <button
                    onClick={onClose}
                    style={{
                        marginTop: '20px',
                        padding: '10px 20px',
                        backgroundColor: 'red',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer'
                    }}>
                    關閉
                </button>
                <button
                    onClick={handleConfirmNotification}
                    style={{
                        marginTop: '20px',
                        marginLeft: '270px',
                        padding: '10px 20px',
                        backgroundColor: 'green',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer'
                    }}>
                    確認無誤，送出通知
                </button>
            </div>
        </div>
    );
};

export default TicketPage;