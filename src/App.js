import React, { useState } from 'react';

function App() {
  const [data, setData] = useState([]); // State to hold API results
  const [loading, setLoading] = useState(false); // State for loading indicator
  const [queryType, setQueryType] = useState(''); // State to track which query is active
  const [employee1Name, setEmployee1Name] = useState(''); // State for employee 1's name input
  const [employee2Name, setEmployee2Name] = useState(''); // State for employee 2's name input
  const [buttonPressed, setButtonPressed] = useState(false); // State to track if a button has been pressed

  // Function to fetch data for Query1
  const handleQuery1 = async () => {
    setLoading(true);
    setData([]); // Clear the table
    setQueryType('query1');
    setButtonPressed(true); // Set button pressed state to true
    try {
      const response = await fetch('http://localhost:5000/api/query1');
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Function to fetch data for Query2
  const handleQuery2 = async () => {
    setLoading(true);
    setData([]);
    setQueryType('query2');
    setButtonPressed(true); // Set button pressed state to true
    try {
      const response = await fetch('http://localhost:5000/api/query2');
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Function to fetch data for Query3
  const handleQuery3 = async () => {
    setLoading(true);
    setData([]);
    setQueryType('query3');
    setButtonPressed(true); // Set button pressed state to true
    try {
      const response = await fetch('http://localhost:5000/api/query3');
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Function to fetch data for Query4
  const handleQuery4 = async () => {
    setLoading(true);
    setData([]);
    setQueryType('query4');
    setButtonPressed(true); // Set button pressed state to true
    try {
      const response = await fetch('http://localhost:5000/api/query4');
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Function to fetch data for Query5 using employee names
  const handleQuery5 = async () => {
    if (!employee1Name || !employee2Name) {
      alert('Please enter both employee names.');
      return;
    }

    setLoading(true);
    setData([]);
    setQueryType('query5');
    setButtonPressed(true); // Set button pressed state to true
    try {
      const response = await fetch(
        `http://localhost:5000/api/query5?employee1_name=${employee1Name}&employee2_name=${employee2Name}`
      );
      const result = await response.json();

      if (result.message) {
        alert(result.message); // Show message to the user
      } else {
        setData(result);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
    console.log(data);
  };

  // Function to handle Query6 - placeholder for now
  const handleQuery6 = async () => {
    setLoading(true);
    setData([]);
    setQueryType('query6');
    setButtonPressed(true); // Set button pressed state to true
    setLoading(false);
    alert('Query6 logic not implemented yet.');
  };

  // Function to render table headers based on query type
  const renderTableHeaders = () => {
    switch (queryType) {
      case 'query1':
        return (
          <tr>
            <th>Department</th>
            <th>Female/Male Salary Ratio</th>
          </tr>
        );
      case 'query2':
        return (
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
          </tr>
        );
      case 'query3':
        return (
          <tr>
            <th>Department</th>
            <th>Birth Decade</th>
            <th>Number of Employees</th>
            <th>Average Salary</th>
          </tr>
        );
      case 'query4':
        return (
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
          </tr>
        );
      case 'query5':
        return (
          <tr>
            <th>Employee 1 ID</th>
            <th>Department ID</th>
            <th>Employee 2 ID</th>
          </tr>
        );
      default:
        return null;
    }
  };

  // Function to render table body based on query type
  const renderTableBody = () => {
    return data.map((row, index) => {
      switch (queryType) {
        case 'query1':
          return (
            <tr key={index}>
              <td>{row.dept_name}</td>
              <td>{row.ratio}</td>
            </tr>
          );
        case 'query2':
          return (
            <tr key={index}>
              <td>{row.first_name}</td>
              <td>{row.last_name}</td>
            </tr>
          );
        case 'query3':
          return (
            <tr key={index}>
              <td>{row.dept_name}</td>
              <td>{row.birthDecade}</td>
              <td>{row.numOfEmployees}</td>
              <td>{row.averageSalary}</td>
            </tr>
          );
        case 'query4':
          return (
            <tr key={index}>
              <td>{row.first_name}</td>
              <td>{row.last_name}</td>
            </tr>
          );
        case 'query5':
          return (
            <tr key={index}>
              <td>{row.employee1_id}</td>
              <td>{row.department_id}</td>
              <td>{row.employee2_id}</td>
            </tr>
          );
        default:
          return null;
      }
    });
  };

  return (
    <div style={styles.container}>
      <h1>QueryApp</h1>

      {/* First row of buttons */}
      <div style={styles.buttonRow}>
        <button onClick={handleQuery1} style={styles.button}>Query1</button>
        <button onClick={handleQuery2} style={styles.button}>Query2</button>
        <button onClick={handleQuery3} style={styles.button}>Query3</button>
      </div>

      {/* Second row of buttons */}
      <div style={styles.buttonRow}>
        <button onClick={handleQuery4} style={styles.button}>Query4</button>
        <button onClick={handleQuery5} style={styles.button}>Query5</button>
        <button onClick={handleQuery6} style={styles.button}>Query6</button>
      </div>

      {/* Employee name input fields for Query5 */}
      <div style={styles.inputRow}>
        <input
          type="text"
          placeholder="Employee 1 Name"
          value={employee1Name}
          onChange={(e) => setEmployee1Name(e.target.value)}
          style={styles.input}
        />
        <input
          type="text"
          placeholder="Employee 2 Name"
          value={employee2Name}
          onChange={(e) => setEmployee2Name(e.target.value)}
          style={styles.input}
        />
      </div>

      {/* Display loading message */}
      {loading && <p>Loading...</p>}

      {/* Display message if no data is found, only after a button is pressed */}
      {!loading && buttonPressed && data.length === 0 && (
        <p>No tuples matching this query were found in the database.</p>
      )}

      {/* Conditionally render the table only if there is data */}
      {data.length > 0 && (
        <table border="1" style={styles.table}>
          <thead>{renderTableHeaders()}</thead>
          <tbody>{renderTableBody()}</tbody>
        </table>
      )}
    </div>
  );
}

// CSS-in-JS styles
const styles = {
  container: {
    textAlign: 'center',
    padding: '20px',
  },
  buttonRow: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '20px',
    marginBottom: '20px',
  },
  inputRow: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '20px',
  },
  input: {
    padding: '10px',
    fontSize: '16px',
  },
  button: {
    padding: '10px 20px',
    fontSize: '16px',
    cursor: 'pointer',
  },
  table: {
    margin: '0 auto',
    borderCollapse: 'collapse',
    width: '80%',
  },
};

export default App;
