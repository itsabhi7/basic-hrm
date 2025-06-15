import { useState, useEffect } from 'react'
import axios from 'axios'
import './App.css'

const API_BASE_URL = 'http://127.0.0.1:8000/api'

function App() {
  const [employees, setEmployees] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingEmployee, setEditingEmployee] = useState(null)
  const [loading, setLoading] = useState(true)

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    position: '',
    department: 'HR',
    phone: '',
    date_joined: '',
    salary: ''
  })

  useEffect(() => {
    fetchEmployees()
  }, [])

  const fetchEmployees = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/employees/`)
      setEmployees(response.data)
    } catch (error) {
      console.error('Error fetching employees:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async (term) => {
    setSearchTerm(term)
    try {
      const response = await axios.get(`${API_BASE_URL}/employees/search/?q=${term}`)
      setEmployees(response.data)
    } catch (error) {
      console.error('Error searching employees:', error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingEmployee) {
        await axios.put(`${API_BASE_URL}/employees/${editingEmployee.id}/`, formData)
      } else {
        await axios.post(`${API_BASE_URL}/employees/`, formData)
      }
      
      setFormData({
        name: '',
        email: '',
        position: '',
        department: 'HR',
        phone: '',
        date_joined: '',
        salary: ''
      })
      setShowForm(false)
      setEditingEmployee(null)
      fetchEmployees()
    } catch (error) {
      console.error('Error saving employee:', error)
      alert('Error saving employee. Please check all fields.')
    }
  }

  const handleEdit = (employee) => {
    setFormData({
      name: employee.name,
      email: employee.email,
      position: employee.position,
      department: employee.department,
      phone: employee.phone,
      date_joined: employee.date_joined,
      salary: employee.salary.toString()
    })
    setEditingEmployee(employee)
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        await axios.delete(`${API_BASE_URL}/employees/${id}/`)
        fetchEmployees()
      } catch (error) {
        console.error('Error deleting employee:', error)
      }
    }
  }

  const departmentColors = {
    'HR': '#e74c3c',
    'IT': '#3498db',
    'FINANCE': '#f39c12',
    'MARKETING': '#9b59b6',
    'SALES': '#2ecc71',
    'OPERATIONS': '#34495e'
  }

  if (loading) {
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
        <p>Loading employees...</p>
      </div>
    )
  }

  return (
    <div className="app">
      <div className="header">
        <h1>🏢 HR Management System</h1>
        <div className="header-actions">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search employees..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="search-input"
            />
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="add-button"
          >
            + Add Employee
          </button>
        </div>
      </div>

      {showForm && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>{editingEmployee ? 'Edit Employee' : 'Add New Employee'}</h2>
              <button
                onClick={() => {
                  setShowForm(false)
                  setEditingEmployee(null)
                  setFormData({
                    name: '',
                    email: '',
                    position: '',
                    department: 'HR',
                    phone: '',
                    date_joined: '',
                    salary: ''
                  })
                }}
                className="close-button"
              >
                ×
              </button>
            </div>
            <form onSubmit={handleSubmit} className="employee-form">
              <div className="form-grid">
                <div className="form-group">
                  <label>Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Position</label>
                  <input
                    type="text"
                    value={formData.position}
                    onChange={(e) => setFormData({...formData, position: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Department</label>
                  <select
                    value={formData.department}
                    onChange={(e) => setFormData({...formData, department: e.target.value})}
                    required
                  >
                    <option value="HR">Human Resources</option>
                    <option value="IT">Information Technology</option>
                    <option value="FINANCE">Finance</option>
                    <option value="MARKETING">Marketing</option>
                    <option value="SALES">Sales</option>
                    <option value="OPERATIONS">Operations</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Phone</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Date Joined</label>
                  <input
                    type="date"
                    value={formData.date_joined}
                    onChange={(e) => setFormData({...formData, date_joined: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Salary</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.salary}
                    onChange={(e) => setFormData({...formData, salary: e.target.value})}
                    required
                  />
                </div>
              </div>
              <div className="form-actions">
                <button type="submit" className="save-button">
                  {editingEmployee ? 'Update Employee' : 'Add Employee'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="employees-grid">
        {employees.length === 0 ? (
          <div className="empty-state">
            <h3>No employees found</h3>
            <p>Start by adding your first employee to the system.</p>
          </div>
        ) : (
          employees.map((employee) => (
            <div key={employee.id} className="employee-card">
              <div className="employee-header">
                <div className="employee-avatar">
                  {employee.name.charAt(0).toUpperCase()}
                </div>
                <div className="employee-info">
                  <h3>{employee.name}</h3>
                  <p className="position">{employee.position}</p>
                </div>
                <div 
                  className="department-badge"
                  style={{ backgroundColor: departmentColors[employee.department] }}
                >
                  {employee.department}
                </div>
              </div>
              <div className="employee-details">
                <div className="detail-item">
                  <span className="label">Email:</span>
                  <span className="value">{employee.email}</span>
                </div>
                {employee.phone && (
                  <div className="detail-item">
                    <span className="label">Phone:</span>
                    <span className="value">{employee.phone}</span>
                  </div>
                )}
                <div className="detail-item">
                  <span className="label">Joined:</span>
                  <span className="value">{new Date(employee.date_joined).toLocaleDateString()}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Salary:</span>
                  <span className="value">${parseFloat(employee.salary).toLocaleString()}</span>
                </div>
              </div>
              <div className="employee-actions">
                <button 
                  onClick={() => handleEdit(employee)}
                  className="edit-button"
                >
                  Edit
                </button>
                <button 
                  onClick={() => handleDelete(employee.id)}
                  className="delete-button"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default App