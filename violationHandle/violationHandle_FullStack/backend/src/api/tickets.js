const express = require('express');
const router = express.Router();
const db = require('../models/db');

// GET all tickets
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM Ticket');
        res.json(rows);
    } catch (error) {
        console.error('Error fetching tickets:', error);
        res.status(500).json({ message: 'Error fetching tickets', error: error.message });
    }
});

// POST a new ticket
router.post('/', async (req, res) => {
    const { violationID, licensePlate, amount } = req.body;
    try {
        const [result] = await db.query(
            'INSERT INTO Ticket (ViolationID, LicensePlate, Amount) VALUES (?, ?, ?)',
            [violationID, licensePlate, amount]
        );
        res.status(201).json({ id: result.insertId, message: 'Ticket added successfully' });
    } catch (error) {
        console.error('Error adding ticket:', error);
        res.status(500).json({ message: 'Error adding ticket', error: error.message });
    }
});

// GET all tickets or filter by licensePlate
router.get('/by-license', async (req, res) => {
    const { licensePlate } = req.query;
    if (!licensePlate) {
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
                Ticket t
            JOIN 
                vehicleinfo v 
            ON 
                t.ViolationID = v.ViolationID
            WHERE 
                v.LicensePlate = ?
        `;
        const [rows] = await db.query(query, [licensePlate]);

        // 如果有 licensePlate，則添加過濾條件
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