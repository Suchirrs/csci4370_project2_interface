import React, { useState } from 'react';

function App() {
  const [data, setData] = useState([]); // State to hold API results
  const [loading, setLoading] = useState(false); // State for loading indicator
  const [queryType, setQueryType] = useState(''); // State to track which query is active

  // Function to fetch data when the first query button is clicked
  const handleQuery1 = async () => {
    setLoading(true);
    setData([]); // Clear the table
    setQueryType('query1');
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

  const handleQuery2 = async () => {
    setLoading(true);
    setData([]); // Clear the table
    setQueryType('query2');
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

  const handleQuery3 = async () => {
    setLoading(true);
    setData([]); // Clear the table
    setQueryType('query3');
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

  const handleQuery4 = async () => {
    setLoading(true);
    setData([]); // Clear the table
    setQueryType('query4');
    try {
      const response = await fetch('http://localhost:5000/api/query4');
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
    console.log(data);
  };
  
  const handleQuery5 = () => {
    setLoading(true);
    setData([]); // Clear the table
    console.log('Query5 clicked');
    setLoading(false);
  };
  
  const handleQuery6 = () => {
    setLoading(true);
    setData([]); // Clear the table
    console.log('Query6 clicked');
    setLoading(false);
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

      {/* Display loading message */}
      {loading && <p>Loading...</p>}

      {/* Conditionally render the table only if there is data */}
      {data.length > 0 && (
        <table border="1" style={styles.table}>
          <thead>
            {renderTableHeaders()}
          </thead>
          <tbody>
            {renderTableBody()}
          </tbody>
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
