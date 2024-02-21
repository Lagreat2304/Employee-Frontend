import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css'; 

const App = () => {
  const [employeeId, setEmployeeId] = useState('');
  const [employeeName, setEmployeeName] = useState('');
  const [department, setDepartment] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('');
  const [designation, setDesignation] = useState('');
  const [salary, setSalary] = useState('');
  const [alert,setAlert] = useState(null);
  const[employees,setEmployees] = useState([]);

  useEffect(() => {
    fetchEmployees();
  });

  const fetchEmployees = async () => {
    try {
      const response = await axios.get('https://9b7f-182-19-35-177.ngrok-free.app/getemployee');
      setEmployees(response.data);
      setTimeout(fetchEmployees, 1000);
    } catch (error) {
      console.error('Error fetching Employees:', error);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if(employeeId==='' || employeeName==='' || department==='' || dob==='' || gender==='' || designation==='' || salary===''){
      setAlert({ type: 'error', message: 'Fill All the Fields' });
      setTimeout(() => {
        setAlert(null);
      }, 3000);
      return;
    }
    const formData = {
      EmployeeId: employeeId,
      EmployeeName: employeeName,
      Department: department,
      DOB: dob,
      Gender: gender,
      Designation: designation,
      Salary: salary
    };
  
    try {
      const response = await fetch('https://9b7f-182-19-35-177.ngrok-free.app/addemployee', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        const data = await response.json();
        setAlert({ type: 'success', message: 'Added Successfully!' });
        setTimeout(() => {
          setAlert(null);
        }, 3000);
        console.log(data.message); 
        setEmployeeId('');
        setEmployeeName('');
        setDepartment('');
        setDob('');
        setGender('');
        setDesignation('');
        setSalary('');
      } else {
        console.error('Failed to add employee:', response.statusText);
        setAlert({ type: 'error', message: 'Failed!' });
        setTimeout(() => {
          setAlert(null);
        }, 3000);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const formatDate = (dob) => {
    const date = new Date(dob);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };
  
  

  return (
    <div className="form-container">
      {alert && <div className={`alert ${alert.type}`}>{alert.message}</div>}
      <h2>Employee Management System</h2>
      <form onSubmit={handleFormSubmit}>
        <div className="form-group">
          <label>Employee ID:</label>
          <input type="text" value={employeeId} onChange={(e) => setEmployeeId(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Employee Name:</label>
          <input type="text" maxLength={30} value={employeeName} onChange={(e) => setEmployeeName(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Department:</label>
          <select value={department} onChange={(e) => setDepartment(e.target.value)}>
            <option value="">Select Department</option>
            <option value="IT">IT</option>
            <option value="HR">HR</option>
            <option value="Finance">Finance</option>
          </select>
        </div>
        <div className="form-group">
          <label>Date of Birth:</label>
          <input type="date" value={dob} onChange={(e) => setDob(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Gender:</label>
          <label><input type="radio" value="Male" checked={gender === 'Male'} onChange={() => setGender('Male')} /> Male</label>
          <label><input type="radio" value="Female" checked={gender === 'Female'} onChange={() => setGender('Female')} /> Female</label>
        </div>
        <div className="form-group">
          <label>Designation:</label>
          <input type="text" value={designation} onChange={(e) => setDesignation(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Salary:</label>
          <input type="text" value={salary} maxLength={8} onChange={(e) => setSalary(e.target.value)} />
        </div>
        <button type="submit">Add</button>
      </form>
      <div className='table-container'>
      <h3>Employees List</h3>
      <table>
        <thead>
          <tr>
            <th>Employee ID</th>
            <th>Employee Name</th>
            <th>Department</th>
            <th>DOB</th>
            <th>Gender</th>
            <th>Designation</th>
            <th>Salary</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee) => (
            <tr key={employee.EmployeeId}>
              <td>{employee.EmployeeId}</td>
              <td>{employee.EmployeeName}</td>
              <td>{employee.Department}</td>
              <td className='dob'>{formatDate(employee.DOB)}</td>
              <td>{employee.Gender}</td>
              <td>{employee.Designation}</td>
              <td>{employee.Salary}</td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  );
};

export default App;
