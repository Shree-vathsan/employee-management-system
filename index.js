const express = require('express');
const mysql2 = require('mysql2');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const database = mysql2.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'FsdTask',
    timezone: '+00:00'
});

database.connect((error) => {
    if (error) { 
        console.error("Database connection failed: ", error);
    } else {
        console.log("Connected to the database.");
    }
});

app.get('/', (req, res) => {
    const query = "SELECT * FROM employee;";
    database.query(query, (err, result) => {
        if (err) {
            return res.status(500).json({ error: "Failed to fetch employees" });
        }
        return res.status(200).json(result);
    });
});

app.post('/new', (req, res) => {
    const { emp_id, name, email, phone_no, department, doj, role } = req.body;
    const checkQuery = "SELECT * FROM employee WHERE emp_id = ? OR email = ?";
    database.query(checkQuery, [emp_id, email], (err, result) => {
        if (err) {
            return res.status(500).json({ error: "Error while checking duplicates" });
        }
        if (result.length > 0) {
            const duplicate = [];
            result.forEach((item) => {
                if (item.emp_id === emp_id) duplicate.push("Employee ID");
                if (item.email === email) duplicate.push("Email");
            });
            return res.status(409).json({ error: `${duplicate.join(" and ")} already exist!` });
        }
        const insertQuery = `
            INSERT INTO employee (emp_id, name, email, phone_no, department, doj, role)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        const values = [emp_id, name, email, phone_no, department, doj, role];
        database.query(insertQuery, values, (err, result) => {
            if (err) {
                return res.status(500).json({ error: "Failed to add employee" });
            }
            return res.status(201).json({ message: "Employee added successfully!" });
        });
    });
});

app.delete('/employees/:id', (req, res) => {
    const empId = req.params.id;
    const deleteQuery = "DELETE FROM employee WHERE emp_id = ?";
    database.query(deleteQuery, [empId], (err, result) => {
        if (err) {
            return res.status(500).json({ error: "Failed to delete employee" });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Employee not found!" });
        }
        return res.status(200).json({ message: "Employee deleted successfully!" });
    });
});

const PORT = 8800;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
