const express = require('express');
const mysql = require('mysql');
const app = express();
const port = 7000;

// Connection...........
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'db'
});

db.connect((err) => {
    if (err) {
        console.log('DB not connected', err);
    } else {
        console.log('DB connected');
    }
});

// Middleware...........
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set('view engine', 'ejs');

// Routes..............

// Home page
app.get('/', (req, res) => {
    res.render('insert');
});

// Insert Student
app.post('/insert', (req, res) => {
    const { name, email, password } = req.body;
    const sql = `INSERT INTO students (name, email, password) VALUES (?, ?, ?)`;
    db.query(sql, [name, email, password], (err, result) => {
        if (err) {
            console.log('Data not inserted', err);
            return res.send("<script>alert('Data not inserted try Again');location.replace('/insert')");
        } else {
            console.log('Data inserted successfully', result);
            return res.send("<script>alert('Data is inserted');location.replace('/select')</script>");
        }
    });
});

// Select all students
app.get('/select', (req, res) => {
    const sql = 'SELECT * FROM students';
    db.query(sql, (err, result) => {
        if (err) {
            console.log('Not selected', err);
            return res.send('Server error');
        } else {
            let table = `
                <h2>All Students</h2>
                <table border="1" cellpadding="10">
                <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Password</th>
                    <th colspan="2">Action</th>
                </tr>`;

            result.forEach((student) => {
                table += `
                    <tr>
                        <td>${student.name}</td>
                        <td>${student.email}</td>
                        <td>${student.password}</td>
                        <td><a href="/select/${student.id}">Update</a></td>
                        <td><a href="/delete/${student.id}">Delete</a></td>
                    </tr>`;
            });

            table += `</table>`;
            res.send(table);
        }
    });
});

// Delete student
app.get('/delete/:id', (req, res) => {
    const id = req.params.id;
    const sql = 'DELETE FROM students WHERE id = ?';
    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error('Data not deleted', err);
            return res.send('Data not deleted');
        }
        console.log('Data deleted', result);
        return res.redirect('/select');
    });
});

// Select single student for update
app.get('/select/:id', (req, res) => {
    const id = req.params.id;
    const sql = 'SELECT * FROM students WHERE id = ?';
    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error('Data not selected', err);
            return res.status(500).send('Database error occurred');
        }
        const student = result[0];

        const form = `
            <h2>Update Student</h2>
            <form action="/update/${student.id}" method="post">
                <input type="text" value="${student.name}" name="name" placeholder="Name" required><br><br>
                <input type="email" value="${student.email}" name="email" placeholder="Email" required><br><br>
                <input type="password" value="${student.password}" name="password" placeholder="Password" required><br><br>
                <button type="submit">Update</button>
            </form>
        `;
        res.send(form);
    });
});

// Handle update POST
app.post('/update/:id', (req, res) => {
    const id = req.params.id;
    const { name, email, password } = req.body;
    const sql = 'UPDATE students SET name = ?, email = ?, password = ? WHERE id = ?';
    db.query(sql, [name, email, password, id], (err, result) => {
        if (err) {
            console.error('Data not updated', err);
            return res.status(500).send('Database error occurred while updating');
        }

        if (result.affectedRows === 0) {
            return res.status(404).send('Student not found');
        }

        console.log('Student updated successfully', result);
        return res.send("<script>alert('Student updated successfully');location.replace('/select')</script>");
    });
});

// Server running
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
