const express = require('express');
const mysql = require('mysql2');
const app = express();
const cors = require('cors');
const port = 5000;

app.use(express.json());
app.use(cors());

//DB connection
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

//helper count result method
const getEmployeeIdsByName = (name) => {
  return new Promise((resolve, reject) => {
    const query = 'SELECT emp_no, first_name, last_name FROM employees WHERE CONCAT(first_name, " ", last_name) = ?';
    db.query(query, [name], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
};

// query1
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

// query2
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

// query3
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

// query4
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

//Query5
app.get('/api/query5', async (req, res) => {
  const { employee1_name, employee2_name } = req.query;

  try {
    // Get employee IDs
    const emp1Results = await getEmployeeIdsByName(employee1_name);
    const emp2Results = await getEmployeeIdsByName(employee2_name);

    if (emp1Results.length === 0 || emp2Results.length === 0) {
      return res.status(404).json({ message: 'Employee not found. Please check the names.' });
    }

    
    const employee1Id = emp1Results[0].emp_no;
    const employee2Id = emp2Results[0].emp_no;

    const query = `
      SELECT 
          e1.emp_no AS employee1_id, 
          e2.emp_no AS employee2_id, 
          d.dept_no AS department_id, 
          d.dept_name AS department_name 
      FROM 
          dept_emp de1 
      JOIN 
          dept_emp de2 ON de1.dept_no = de2.dept_no 
      JOIN 
          departments d ON de1.dept_no = d.dept_no 
      JOIN 
          employees e1 ON de1.emp_no = e1.emp_no 
      JOIN 
          employees e2 ON de2.emp_no = e2.emp_no 
      WHERE 
          e1.emp_no = ? 
          AND e2.emp_no = ? 
          AND de1.from_date <= de2.to_date 
          AND de2.from_date <= de1.to_date;
    `;

    db.query(query, [employee1Id, employee2Id], (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(results);
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Query 6 - 2 degrees of separation 
app.get('/api/query6', (req, res) => {
  const { employee1_name, employee2_name } = req.query;

  const getEmployeeIdsByName = (name) => {
    return new Promise((resolve, reject) => {
      const query = 'SELECT emp_no FROM employees WHERE CONCAT(first_name, " ", last_name) = ?';
      db.query(query, [name], (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
  };

  Promise.all([
    getEmployeeIdsByName(employee1_name),
    getEmployeeIdsByName(employee2_name)
  ])
  .then(([emp1Results, emp2Results]) => {
    if (emp1Results.length === 0 || emp2Results.length === 0) {
      return res.status(404).json({ message: 'Employee not found. Please check the names.' });
    }

    const employee1Id = emp1Results[0].emp_no;
    const employee2Id = emp2Results[0].emp_no;

    const query = `
      SELECT 
        e1.emp_no AS employee1_id, 
        d1.dept_no AS department1_id, 
        e3.emp_no AS employee3_id, 
        d2.dept_no AS department2_id, 
        e2.emp_no AS employee2_id
      FROM dept_emp de1
      JOIN dept_emp de3_1 ON de1.dept_no = de3_1.dept_no 
      JOIN employees e1 ON de1.emp_no = e1.emp_no 
      JOIN employees e3 ON de3_1.emp_no = e3.emp_no 
      JOIN dept_emp de3_2 ON e3.emp_no = de3_2.emp_no 
      JOIN dept_emp de2 ON de3_2.dept_no = de2.dept_no
      JOIN employees e2 ON de2.emp_no = e2.emp_no
      JOIN departments d1 ON de1.dept_no = d1.dept_no
      JOIN departments d2 ON de2.dept_no = d2.dept_no
      WHERE e1.emp_no = ? 
      AND e2.emp_no = ?
      AND de1.from_date <= de3_1.to_date 
      AND de3_1.from_date <= de1.to_date 
      AND de3_2.from_date <= de2.to_date 
      AND de2.from_date <= de3_2.to_date
      ORDER BY department1_id
      LIMIT 100;
    `;

    db.query(query, [employee1Id, employee2Id], (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(results);
    });
  })
  .catch(err => res.status(500).json({ error: err.message }));
});


// Starting the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
