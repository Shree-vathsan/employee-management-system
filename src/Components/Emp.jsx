import React, { useState } from 'react';
import '../Components/Emp.css';
import axios from 'axios';

const dept = ["HR", "Developer", "Testing", "Marketting", "PR"];

const App = () => {
  const [formData, setFormData] = useState({
    name: '',
    emp_id: '',
    email: '',
    phone_no: '',
    department: '',
    doj: '',
    role: ''
  });

  const [errors, setErrors] = useState({
    name: '',
    emp_id: '',
    email: '',
    phone_no: '',
    department: '',
    doj: '',
    role: ''
  });

  const [formSubmitted, setFormSubmitted] = useState(false);

  const validateField = (field, value) => {
    let error = '';
    switch (field) {
      case 'name':
        if (!value) error = 'Name is required';
        break;
      case 'emp_id':
        if (!value) error = 'Employee ID is required';
        break;
      case 'email':
        if (!value) error = 'Email is required';
        else if (!/^\S+@\S+\.\S+$/.test(value)) error = 'Email is not valid';
        break;
      case 'phone_no':
        if (!value) error = 'Phone number is required';
        else if (!/^\d{10}$/.test(value)) error = 'Phone number is not valid';
        break;
      case 'department':
        if (!value) error = 'Department is required';
        break;
      case 'doj':
        const date = new Date(value);
        const today = new Date();
        if (!value) error = 'Date of Joining is required';
        else if (date > today) error = 'Future date cannot be used as joining date';
        break;
      case 'role':
        if (!value) error = 'Role is required';
        break;
      default:
        break;
    }
    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    setErrors({
      ...errors,
      [name]: validateField(name, value)
    });
  };

  const fieldNames = {
    name: "Name",
    emp_id: "Employee ID",
    email: "Email",
    phone_no: "Phone number",
    department: "Department",
    doj: "Date of Joining",
    role: "Role"
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

   
    const requiredFields = ['name', 'emp_id', 'email', 'phone_no', 'department', 'doj', 'role'];
    let formIsValid = true;

    for (let field of requiredFields) {
      if (!formData[field]) {
        setErrors(prevErrors => ({
          ...prevErrors,
          [field]: `${fieldNames[field]} is required.`
        }));
        formIsValid = false;
      }
    }

    if (!formIsValid) return;

    
    try {
      const response = await axios.post("http://localhost:8800/new", formData, {
        headers: { "Content-Type": "application/json" },
      });
      setFormSubmitted(true);
      console.log(response.data);
    } catch (e) {
      if (e.response) {
        console.error("Error Response:", e.response.data);
      } else if (e.request) {
        console.error("Error Request:", e.request);
      } else {
        console.error("Error Message:", e.message);
      }
    }
  };

  const handleReset = () => {
    setFormData({
      name: '',
      emp_id: '',
      email: '',
      phone_no: '',
      department: '',
      doj: '',
      role: ''
    });
    setErrors({});
    setFormSubmitted(false);
  };

  return (
    <div className="container">
      <h1>Employee Management System</h1>
      <form onSubmit={handleSubmit}>
        {/* Name */}
        <div className="form">
          <label>Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={errors.name ? 'error' : ''}
          />
          {errors.name && <span className="error-message">{errors.name}</span>}
        </div>

        
        <div className="form">
          <label>Employee ID</label>
          <input
            type="text"
            name="emp_id"
            value={formData.emp_id}
            onChange={handleChange}
            className={errors.emp_id ? 'error' : ''}
          />
          {errors.emp_id && <span className="error-message">{errors.emp_id}</span>}
        </div>

        
        <div className="form">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={errors.email ? 'error' : ''}
          />
          {errors.email && <span className="error-message">{errors.email}</span>}
        </div>

        
        <div className="form">
          <label>Phone Number</label>
          <input
            type="text"
            name="phone_no"
            value={formData.phone_no}
            onChange={handleChange}
            className={errors.phone_no ? 'error' : ''}
          />
          {errors.phone_no && <span className="error-message">{errors.phone_no}</span>}
        </div>

       
        <div className="form">
          <label>Department</label>
          <select
            name="department"
            value={formData.department}
            onChange={handleChange}
            className={errors.department ? 'error' : ''}
          >
            <option value="">Select Department</option>
            {dept.map((department, index) => (
              <option key={index} value={department}>
                {department}
              </option>
            ))}
          </select>
          {errors.department && <span className="error-message">{errors.department}</span>}
        </div>

        <div className="form">
          <label>Date of Joining</label>
          <input
            type="date"
            name="doj"
            value={formData.doj}
            onChange={handleChange}
            className={errors.doj ? 'error' : ''}
          />
          {errors.doj && <span className="error-message">{errors.doj}</span>}
        </div>

        
        <div className="form">
          <label>Role</label>
          <input
            type="text"
            name="role"
            value={formData.role}
            onChange={handleChange}
            className={errors.role ? 'error' : ''}
          />
          {errors.role && <span className="error-message">{errors.role}</span>}
        </div>

        <div className="form-actions">
          <button type="submit" disabled={Object.values(errors).some((err) => err !== '')}>
            Submit
          </button>
          <button type="button" onClick={handleReset}>
            Reset
          </button>
        </div>
      </form>

      {formSubmitted && (
        <div className="success-message">
          <p>Employee added successfully!</p>
        </div>
      )}
    </div>
  );
};

export default App;
