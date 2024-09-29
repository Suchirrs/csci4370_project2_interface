const express = require('express');
const mysql = require('mysql2');
const app = express();
const cors = require('cors'); // Import the cors package
const port = 5000;

app.use(express.json());
app.use(cors());

// MySQL connection setup
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Spider@123',
  database: 'employees'
});

db.connect(err => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

// API endpoint to run the SQL query for Query1 (button 1)
app.get('/api/query1', (req, res) => {
  const query1 = `SELECT d.dept_name, (female_avg_salary / male_avg_salary) AS ratio 
                FROM ( SELECT de.dept_no, AVG(CASE WHEN e.gender = 'F' THEN s.salary END) AS female_avg_salary,
                AVG(CASE WHEN e.gender = 'M' THEN s.salary END) AS male_avg_salary 
                FROM employees e 
                JOIN dept_emp de ON e.emp_no = de.emp_no 
                JOIN salaries s ON e.emp_no = s.emp_no 
                GROUP BY de.dept_no) AS salary_by_gender 
                JOIN departments d ON salary_by_gender.dept_no = d.dept_no
                WHERE female_avg_salary IS NOT NULL 
                AND male_avg_salary IS NOT NULL 
                ORDER BY ratio DESC;`;

  db.query(query1, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// API endpoint to run the SQL query for Query2 (button 2)
app.get('/api/query2', (req, res) => {
  const query2 = `
    SELECT first_name, last_name 
    FROM employees 
    JOIN dept_manager ON dept_manager.emp_no = employees.emp_no 
    WHERE (to_date - from_date) = (
      SELECT MAX(to_date - from_date) 
      FROM dept_manager
    );
  `;

  db.query(query2, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

app.get('/api/query3', (req, res) => {
  const query3 = `
   SELECT d.dept_name,
                YEAR(e.birth_date) - MOD(YEAR(e.birth_date), 10) AS birthDecade,
                COUNT(e.emp_no) AS numOfEmployees,
                AVG(s.salary) AS averageSalary
                FROM employees e
                JOIN dept_emp de ON e.emp_no = de.emp_no
                JOIN departments d ON de.dept_no = d.dept_no
                JOIN salaries s ON e.emp_no = s.emp_no
                GROUP BY d.dept_name, birthDecade;
  `;

  db.query(query3, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

app.get('/api/query4', (req, res) => {
  const query4 = `
    SELECT e.first_name, e.last_name
    FROM employees e
    JOIN salaries s ON e.emp_no = s.emp_no
    JOIN dept_manager dm ON e.emp_no = dm.emp_no
    JOIN departments d ON dm.dept_no = d.dept_no
    WHERE e.gender = 'F'
    AND e.birth_date < '1990-01-01'
    AND s.salary > 80000
    AND s.to_date = '9999-01-01';
  `;

  db.query(query4, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// Starting the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
