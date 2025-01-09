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
    const { ViolationID, LicensePlate, FineAmount, NotificationStatus} = req.body;
    if (!ViolationID) {
        return res.status(400).json({ message: 'ViolationID 為必填項' });
    }
    try {
        const [result] = await db.query(
            'INSERT INTO ticketinfo (ViolationID, LicensePlate, FineAmount, NotificationStatus) VALUES (? ,?, ?, ?)',
            [ViolationID, LicensePlate, FineAmount,NotificationStatus]
        );
        res.status(201).json({ id: result.insertId, message: 'Ticket added successfully' });
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