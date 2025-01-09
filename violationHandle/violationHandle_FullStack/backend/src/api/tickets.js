const express = require('express');
const router = express.Router();
const db = require('../config/database');





// GET all tickets
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM ticketinfo');
        res.json(rows);
    } catch (error) {
        console.error('Error fetching tickets:', error);
        res.status(500).json({ message: 'Error fetching tickets', error: error.message });
    }
});

// POST a new ticket
router.post('/', async (req, res) => {
    console.log('接收到的請求數據:', req.body);

    const { ViolationID, LicensePlate, FineAmount, NotificationStatus} = req.body;
    // if (!ViolationID) {
    //     return res.status(400).json({ message: 'ViolationID 為必填項' });
    // }
    try {
        const [result] = await db.query(
            'INSERT INTO ticketinfo (ViolationID, LicensePlate, FineAmount, CompletionTime, NotificationStatus) VALUES (? ,?, ?,NOW(), ?)',
            [ViolationID, LicensePlate, FineAmount,NotificationStatus]
        );
        console.log('Query result:', result);
        // if (!result.insertId) {
        //     throw new Error('資料庫未返回 insertId，請檢查資料庫設定');
        // }
        // if (!result || !result.insertId) {
        //     throw new Error('insertId 未定義，請檢查資料庫設定');
        // }

        console.log('POST /api/tickets新增罰單返回數據:', result.insertId);
        res.status(201).json({
             TicketID: result.insertId,
             ViolationID,
             FineAmount,
             CompletionTime: new Date().toISOString(), // 確保格式化
            NotificationStatus,
            message: '新增罰單成功'
            });
    } catch (error) {
        
        console.error('Error adding ticket:', error);
        res.status(500).json({ message: 'Error adding ticket', error: error.message });
    }
});


// GET all tickets or filter by LicensePlate
router.get('/by-license', async (req, res) => {
    const { LicensePlate } = req.query;
    if (!LicensePlate) {
        return res.status(400).json({ message: '車牌號碼為必填項目' });
    }

    try {
        const query = `
            SELECT 
                t.TicketID, 
                t.ViolationID, 
                t.FineAmount, 
                t.CompletionTime, 
                t.NotificationStatus, 
                v.LicensePlate, 
                v.VehicleType, 
                v.VehicleColor 
            FROM 
                ticketinfo t
            JOIN 
                vehicleinfo v 
            ON 
                t.ViolationID = v.ViolationID
            WHERE 
                v.LicensePlate = ?
        `;
        const [rows] = await db.query(query, [LicensePlate]);

        // 如果有 LicensePlate，則添加過濾條件
        if (rows.length===0) {
            return res.status(404).json({ message: '找不到指定的罰單' });
        }

        res.json(rows);
    } catch (error) {
        console.error('查詢API發生錯誤', error);
        res.status(500).json({ message: '伺服器發生錯誤', error: error.message });
    }
});


module.exports = router;