const express = require("express");
const cors = require("cors");
require("dotenv").config();
const db = require("./config/db");

const app = express();

app.use(cors());
app.use(express.json());

// ============ PATIENT ROUTES ============

// GET all patients
app.get('/api/patients', (req, res) => {
    db.query('SELECT * FROM patients ORDER BY id DESC', (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

// CREATE patient
app.post('/api/patients', (req, res) => {
    const { name, age, gender, phone, email, bloodGroup, address,disease } = req.body;
    
    const sql = `INSERT INTO patients 
                 (name, age, gender, phone, email, blood_group, address,disease) 
                 VALUES (?, ?, ?, ?, ?, ?, ?,?)`;
    
    db.query(sql, [name, age, gender, phone, email, bloodGroup, address,disease], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: err.message });
        }
        res.json({ id: result.insertId, message: 'Created' });
    });
});

// UPDATE patient
app.put('/api/patients/:id', (req, res) => {
    const { id } = req.params;
    const { name, age, gender, phone, email, bloodGroup, address,disease } = req.body;
    
    const sql = `UPDATE patients 
                 SET name=?, age=?, gender=?, phone=?, email=?, blood_group=?, address=? ,disease=? 
                 WHERE id=?`;
    
    db.query(sql, [name, age, gender, phone, email, bloodGroup, address,disease, id], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'Updated' });
    });
});

// DELETE patient
app.delete('/api/patients/:id', (req, res) => {
    const { id } = req.params;
    
    db.query('DELETE FROM patients WHERE id=?', [id], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'Deleted' });
    });
});

// ============ AMBULANCE ROUTES ============

// GET all ambulances
app.get('/api/ambulances', (req, res) => {
    db.query('SELECT * FROM ambulances ORDER BY id DESC', (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

// CREATE ambulance
app.post('/api/ambulances', (req, res) => {
    const { ambulanceNumber, ambulanceType, driverName, driverPhone, status, currentLocation } = req.body;
    const sql = 'INSERT INTO ambulances (ambulance_number, ambulance_type, driver_name, driver_phone, status, current_location) VALUES (?, ?, ?, ?, ?, ?)';
    db.query(sql, [ambulanceNumber, ambulanceType, driverName, driverPhone, status, currentLocation], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: err.message });
        }
        res.json({ id: result.insertId, message: 'Created' });
    });
});

// UPDATE ambulance
app.put('/api/ambulances/:id', (req, res) => {
    const { id } = req.params;
    const { ambulanceNumber, ambulanceType, driverName, driverPhone, status, currentLocation } = req.body;
    const sql = 'UPDATE ambulances SET ambulance_number=?, ambulance_type=?, driver_name=?, driver_phone=?, status=?, current_location=? WHERE id=?';
    db.query(sql, [ambulanceNumber, ambulanceType, driverName, driverPhone, status, currentLocation, id], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'Updated' });
    });
});

// DELETE ambulance
app.delete('/api/ambulances/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM ambulances WHERE id=?', [id], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'Deleted' });
    });
});
// ============ DOCTOR ROUTES ============

// GET all doctors
app.get('/api/doctors', (req, res) => {
    db.query('SELECT * FROM doctors ORDER BY id DESC', (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

// CREATE doctor
app.post('/api/doctors', (req, res) => {
    const { name, specialization, phone, email, experience, department, availability } = req.body;
    
    const sql = `INSERT INTO doctors 
                 (name, specialization, phone, email, experience, department, availability) 
                 VALUES (?, ?, ?, ?, ?, ?, ?)`;
    
    db.query(sql, [name, specialization, phone, email, experience, department, availability], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: err.message });
        }
        res.json({ id: result.insertId, message: 'Created' });
    });
});

// UPDATE doctor
app.put('/api/doctors/:id', (req, res) => {
    const { id } = req.params;
    const { name, specialization, phone, email, experience, department, availability } = req.body;
    
    const sql = `UPDATE doctors 
                 SET name=?, specialization=?, phone=?, email=?, experience=?, department=?, availability=? 
                 WHERE id=?`;
    
    db.query(sql, [name, specialization, phone, email, experience, department, availability, id], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'Updated' });
    });
});

// DELETE doctor
app.delete('/api/doctors/:id', (req, res) => {
    const { id } = req.params;
    
    db.query('DELETE FROM doctors WHERE id=?', [id], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'Deleted' });
    });
});

// ============ APPOINTMENT ROUTES ============

// GET all appointments
app.get('/api/appointments', (req, res) => {
    db.query('SELECT * FROM appointments ORDER BY id DESC', (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

// CREATE appointment
app.post('/api/appointments', (req, res) => {
    const { patientName, doctorName, appointmentDate, appointmentTime, status, notes } = req.body;
    
    // Check for duplicate (same doctor, same date, same time)
    const checkSql = `SELECT * FROM appointments 
                      WHERE doctor_name=? AND appointment_date=? AND appointment_time=? 
                      AND status != 'Cancelled'`;
    
    db.query(checkSql, [doctorName, appointmentDate, appointmentTime], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: err.message });
        }
        
        if (results.length > 0) {
            return res.status(400).json({ error: 'Doctor already has appointment at this time!' });
        }
        
        const sql = `INSERT INTO appointments 
                     (patient_name, doctor_name, appointment_date, appointment_time, status, notes) 
                     VALUES (?, ?, ?, ?, ?, ?)`;
        
        db.query(sql, [patientName, doctorName, appointmentDate, appointmentTime, status, notes], (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: err.message });
            }
            res.json({ id: result.insertId, message: 'Created' });
        });
    });
});

// UPDATE appointment
app.put('/api/appointments/:id', (req, res) => {
    const { id } = req.params;
    const { patientName, doctorName, appointmentDate, appointmentTime, status, notes } = req.body;
    
    const sql = `UPDATE appointments 
                 SET patient_name=?, doctor_name=?, appointment_date=?, appointment_time=?, status=?, notes=? 
                 WHERE id=?`;
    
    db.query(sql, [patientName, doctorName, appointmentDate, appointmentTime, status, notes, id], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'Updated' });
    });
});

// DELETE appointment
app.delete('/api/appointments/:id', (req, res) => {
    const { id } = req.params;
    
    db.query('DELETE FROM appointments WHERE id=?', [id], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'Deleted' });
    });
});

// ============ BILLING ROUTES ============

// GET all bills
app.get('/api/bills', (req, res) => {
    db.query('SELECT * FROM bills ORDER BY id DESC', (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

// CREATE bill
app.post('/api/bills', (req, res) => {
    const { 
        patientName, consultationFee, medicineCharges, labCharges, 
        roomCharges, otherCharges, amountPaid, paymentMethod, paymentStatus, billDate 
    } = req.body;
    
    // Calculate totals
    const totalAmount = 
        parseFloat(consultationFee || 0) + 
        parseFloat(medicineCharges || 0) + 
        parseFloat(labCharges || 0) + 
        parseFloat(roomCharges || 0) + 
        parseFloat(otherCharges || 0);
    
    const balance = totalAmount - parseFloat(amountPaid || 0);
    
    const sql = `INSERT INTO bills 
                 (patient_name, consultation_fee, medicine_charges, lab_charges, 
                  room_charges, other_charges, total_amount, amount_paid, balance, 
                  payment_method, payment_status, bill_date) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    
    db.query(sql, [
        patientName, consultationFee, medicineCharges, labCharges,
        roomCharges, otherCharges, totalAmount, amountPaid, balance,
        paymentMethod, paymentStatus, billDate
    ], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: err.message });
        }
        res.json({ id: result.insertId, message: 'Created' });
    });
});

// UPDATE bill
app.put('/api/bills/:id', (req, res) => {
    const { id } = req.params;
    const { 
        patientName, consultationFee, medicineCharges, labCharges, 
        roomCharges, otherCharges, amountPaid, paymentMethod, paymentStatus, billDate 
    } = req.body;
    
    const totalAmount = 
        parseFloat(consultationFee || 0) + 
        parseFloat(medicineCharges || 0) + 
        parseFloat(labCharges || 0) + 
        parseFloat(roomCharges || 0) + 
        parseFloat(otherCharges || 0);
    
    const balance = totalAmount - parseFloat(amountPaid || 0);
    
    const sql = `UPDATE bills 
                 SET patient_name=?, consultation_fee=?, medicine_charges=?, 
                     lab_charges=?, room_charges=?, other_charges=?, 
                     total_amount=?, amount_paid=?, balance=?, 
                     payment_method=?, payment_status=?, bill_date=? 
                 WHERE id=?`;
    
    db.query(sql, [
        patientName, consultationFee, medicineCharges, labCharges,
        roomCharges, otherCharges, totalAmount, amountPaid, balance,
        paymentMethod, paymentStatus, billDate, id
    ], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'Updated' });
    });
});

// DELETE bill
app.delete('/api/bills/:id', (req, res) => {
    const { id } = req.params;
    
    db.query('DELETE FROM bills WHERE id=?', [id], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'Deleted' });
    });
});

// ============ TEST ROUTE ============
app.get("/", (req, res) => {
    res.send("Hospital Management API Running...");
});

// ============ START SERVER ============
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});