// script.js

// Employee Management System
class EmployeeManagementSystem {
    constructor() {
        this.currentUser = null;
        this.isLoginMode = true;
        this.employees = [];
        this.nextEmployeeId = 1;
        this.init();
    }
    
    init() {
        this.loadData();
        this.setupEventListeners();
        this.checkAuthStatus();
    }
    
    loadData() {
        // Load users from localStorage
        const usersData = localStorage.getItem('employeeSystemUsers');
        if (!usersData) {
            // Create default admin user
            const defaultUsers = [
                {
                    id: 1,
                    name: 'Admin User',
                    email: 'admin@example.com',
                    password: 'admin123',
                    createdAt: new Date().toISOString(),
                    lastLogin: null,
                    employeesAdded: 0
                }
            ];
            localStorage.setItem('employeeSystemUsers', JSON.stringify(defaultUsers));
        }
        
        // Load employees from localStorage
        const employeesData = localStorage.getItem('employeeSystemEmployees');
        if (employeesData) {
            this.employees = JSON.parse(employeesData);
            if (this.employees.length > 0) {
                this.nextEmployeeId = Math.max(...this.employees.map(e => e.id)) + 1;
            }
        } else {
            // Create sample employees
            this.employees = [
                {
                    id: 1,
                    name: 'John Doe',
                    email: 'john.doe@example.com',
                    phone: '+1 (555) 123-4567',
                    department: 'Engineering',
                    position: 'Software Engineer',
                    salary: 85000,
                    status: 'active',
                    hireDate: '2023-01-15',
                    address: '123 Main St, San Francisco, CA',
                    addedBy: 1
                },
                {
                    id: 2,
                    name: 'Jane Smith',
                    email: 'jane.smith@example.com',
                    phone: '+1 (555) 987-6543',
                    department: 'Marketing',
                    position: 'Marketing Manager',
                    salary: 75000,
                    status: 'active',
                    hireDate: '2022-08-22',
                    address: '456 Oak Ave, New York, NY',
                    addedBy: 1
                },
                {
                    id: 3,
                    name: 'Robert Johnson',
                    email: 'robert.j@example.com',
                    phone: '+1 (555) 456-7890',
                    department: 'Sales',
                    position: 'Sales Executive',
                    salary: 65000,
                    status: 'on leave',
                    hireDate: '2023-03-10',
                    address: '789 Pine Rd, Chicago, IL',
                    addedBy: 1
                },
                {
                    id: 4,
                    name: 'Sarah Williams',
                    email: 'sarah.w@example.com',
                    phone: '+1 (555) 789-0123',
                    department: 'HR',
                    position: 'HR Specialist',
                    salary: 60000,
                    status: 'active',
                    hireDate: '2021-11-05',
                    address: '321 Elm Blvd, Austin, TX',
                    addedBy: 1
                }
            ];
            this.nextEmployeeId = 5;
            this.saveEmployees();
        }
        
        // Load current user from sessionStorage
        const currentUser = sessionStorage.getItem('employeeSystemCurrentUser');
        if (currentUser) {
            this.currentUser = JSON.parse(currentUser);
        }
    }
    
    saveEmployees() {
        localStorage.setItem('employeeSystemEmployees', JSON.stringify(this.employees));
    }
    
    saveUsers(users) {
        localStorage.setItem('employeeSystemUsers', JSON.stringify(users));
    }
    
    setupEventListeners() {
        // Auth form submission
        document.getElementById('auth-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleAuth();
        });
        
        // Toggle between login/signup
        document.getElementById('toggle-auth').addEventListener('click', () => {
            this.toggleAuthMode();
        });
        
        // Logout button
        document.getElementById('logout-btn').addEventListener('click', () => {
            this.logout();
        });
        
        // Tab navigation
        document.querySelectorAll('.tab').forEach(tab => {
            tab.addEventListener('click', () => {
                this.switchTab(tab.dataset.tab);
            });
        });
        
        // Employee form submission
        document.getElementById('employee-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addEmployee();
        });
        
        // Edit employee form submission
        document.getElementById('edit-employee-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.updateEmployee();
        });
        
        // Close edit modal
        document.getElementById('close-edit-modal').addEventListener('click', () => {
            this.closeEditModal();
        });
        
        // Delete employee button
        document.getElementById('delete-employee-btn').addEventListener('click', () => {
            this.deleteEmployee();
        });
        
        // Search employees
        document.getElementById('search-employee').addEventListener('input', (e) => {
            this.filterEmployees(e.target.value);
        });
        
        // Change password form
        document.getElementById('change-password-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.changePassword();
        });
        
        // Close modals when clicking outside
        document.getElementById('edit-employee-modal').addEventListener('click', (e) => {
            if (e.target.id === 'edit-employee-modal') {
                this.closeEditModal();
            }
        });
    }
    
    checkAuthStatus() {
        if (this.currentUser) {
            this.showDashboard();
            this.updateDashboardStats();
            this.loadEmployeesTable();
            this.loadRecentEmployees();
            this.loadProfileData();
        } else {
            this.showAuthScreen();
        }
    }
    
    showAuthScreen() {
        document.getElementById('auth-screen').classList.remove('d-none');
        document.getElementById('dashboard').classList.add('d-none');
    }
    
    showDashboard() {
        document.getElementById('auth-screen').classList.add('d-none');
        document.getElementById('dashboard').classList.remove('d-none');
        document.getElementById('logged-in-user').textContent = this.currentUser.name;
    }
    
    toggleAuthMode() {
        this.isLoginMode = !this.isLoginMode;
        
        const authTitle = document.getElementById('auth-title');
        const authSubtitle = document.getElementById('auth-subtitle');
        const authSubmit = document.getElementById('auth-submit');
        const nameField = document.getElementById('name-field');
        const confirmPasswordField = document.getElementById('confirm-password-field');
        const authToggle = document.getElementById('auth-toggle');
        
        if (this.isLoginMode) {
            authTitle.textContent = 'Employee Login';
            authSubtitle.textContent = 'Access your employee management dashboard';
            authSubmit.innerHTML = '<i class="fas fa-sign-in-alt"></i> Login';
            nameField.classList.add('d-none');
            confirmPasswordField.classList.add('d-none');
            authToggle.innerHTML = 'Don\'t have an account? <span class="link" id="toggle-auth">Sign Up</span>';
        } else {
            authTitle.textContent = 'Create Account';
            authSubtitle.textContent = 'Sign up for a new employee management account';
            authSubmit.innerHTML = '<i class="fas fa-user-plus"></i> Sign Up';
            nameField.classList.remove('d-none');
            confirmPasswordField.classList.remove('d-none');
            authToggle.innerHTML = 'Already have an account? <span class="link" id="toggle-auth">Login</span>';
        }
        
        // Re-attach event listener to new toggle link
        const newToggleAuth = document.getElementById('toggle-auth');
        newToggleAuth.addEventListener('click', () => {
            this.toggleAuthMode();
        });
        
        // Clear any existing alerts
        this.hideAuthAlert();
    }
    
    handleAuth() {
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        
        if (this.isLoginMode) {
            this.login(email, password);
        } else {
            const name = document.getElementById('fullName').value.trim();
            const confirmPassword = document.getElementById('confirmPassword').value;
            this.signup(name, email, password, confirmPassword);
        }
    }
    
    login(email, password) {
        const users = JSON.parse(localStorage.getItem('employeeSystemUsers') || '[]');
        const user = users.find(u => u.email === email && u.password === password);
        
        if (user) {
            // Update last login
            user.lastLogin = new Date().toISOString();
            const userIndex = users.findIndex(u => u.id === user.id);
            users[userIndex] = user;
            this.saveUsers(users);
            
            this.currentUser = user;
            sessionStorage.setItem('employeeSystemCurrentUser', JSON.stringify(user));
            this.showSuccessAlert('Login successful! Redirecting to dashboard...', 'auth-alert');
            
            setTimeout(() => {
                this.showDashboard();
                this.updateDashboardStats();
                this.loadEmployeesTable();
                this.loadRecentEmployees();
                this.loadProfileData();
                this.hideAuthAlert();
            }, 1500);
        } else {
            this.showErrorAlert('Invalid email or password. Please try again.', 'auth-alert');
        }
    }
    
    signup(name, email, password, confirmPassword) {
        // Validation
        if (!name || !email || !password || !confirmPassword) {
            this.showErrorAlert('All fields are required.', 'auth-alert');
            return;
        }
        
        if (password !== confirmPassword) {
            this.showErrorAlert('Passwords do not match.', 'auth-alert');
            return;
        }
        
        if (password.length < 6) {
            this.showErrorAlert('Password must be at least 6 characters long.', 'auth-alert');
            return;
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            this.showErrorAlert('Please enter a valid email address.', 'auth-alert');
            return;
        }
        
        const users = JSON.parse(localStorage.getItem('employeeSystemUsers') || '[]');
        
        // Check if user already exists
        if (users.some(u => u.email === email)) {
            this.showErrorAlert('An account with this email already exists.', 'auth-alert');
            return;
        }
        
        // Create new user
        const newUser = {
            id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
            name,
            email,
            password,
            createdAt: new Date().toISOString(),
            lastLogin: null,
            employeesAdded: 0
        };
        
        users.push(newUser);
        this.saveUsers(users);
        
        this.showSuccessAlert('Account created successfully! You can now login.', 'auth-alert');
        
        // Switch to login mode
        setTimeout(() => {
            this.isLoginMode = true;
            this.toggleAuthMode();
            document.getElementById('email').value = email;
            document.getElementById('password').value = '';
            this.hideAuthAlert();
        }, 2000);
    }
    
    logout() {
        this.currentUser = null;
        sessionStorage.removeItem('employeeSystemCurrentUser');
        this.showAuthScreen();
        this.hideAuthAlert();
        
        // Clear form fields
        document.getElementById('email').value = '';
        document.getElementById('password').value = '';
        document.getElementById('fullName').value = '';
        document.getElementById('confirmPassword').value = '';
    }
    
    switchTab(tabId) {
        // Update active tab
        document.querySelectorAll('.tab').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabId}"]`).classList.add('active');
        
        // Show selected tab content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.add('d-none');
        });
        document.getElementById(tabId).classList.remove('d-none');
        
        // Refresh data if needed
        if (tabId === 'dashboard-tab') {
            this.updateDashboardStats();
            this.loadRecentEmployees();
        } else if (tabId === 'employees-tab') {
            this.loadEmployeesTable();
        } else if (tabId === 'profile-tab') {
            this.loadProfileData();
        }
    }
    
    updateDashboardStats() {
        const total = this.employees.length;
        const active = this.employees.filter(e => e.status === 'active').length;
        const onLeave = this.employees.filter(e => e.status === 'on leave').length;
        const inactive = this.employees.filter(e => e.status === 'inactive').length;
        
        document.getElementById('total-employees').textContent = total;
        document.getElementById('active-employees').textContent = active;
        document.getElementById('on-leave').textContent = onLeave;
        document.getElementById('inactive-employees').textContent = inactive;
    }
    
    loadRecentEmployees() {
        const tableBody = document.querySelector('#recent-employees-table tbody');
        tableBody.innerHTML = '';
        
        if (this.employees.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="5" class="empty-state">
                        <i class="fas fa-users"></i>
                        <h4>No employees found</h4>
                        <p>Add your first employee to get started</p>
                    </td>
                </tr>
            `;
            return;
        }
        
        // Get 5 most recent employees
        const recentEmployees = [...this.employees]
            .sort((a, b) => new Date(b.hireDate || '2023-01-01') - new Date(a.hireDate || '2023-01-01'))
            .slice(0, 5);
        
        recentEmployees.forEach(employee => {
            const row = document.createElement('tr');
            
            let statusBadge = '';
            switch (employee.status) {
                case 'active':
                    statusBadge = '<span class="status-badge status-active">Active</span>';
                    break;
                case 'inactive':
                    statusBadge = '<span class="status-badge status-inactive">Inactive</span>';
                    break;
                case 'on leave':
                    statusBadge = '<span class="status-badge status-leave">On Leave</span>';
                    break;
            }
            
            row.innerHTML = `
                <td>${employee.id}</td>
                <td>${employee.name}</td>
                <td>${employee.email}</td>
                <td>${employee.department}</td>
                <td>${statusBadge}</td>
            `;
            
            tableBody.appendChild(row);
        });
    }
    
    loadEmployeesTable(filter = '') {
        const tableBody = document.querySelector('#employees-table tbody');
        tableBody.innerHTML = '';
        
        if (this.employees.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="8" class="empty-state">
                        <i class="fas fa-users"></i>
                        <h4>No employees found</h4>
                        <p>Add your first employee to get started</p>
                    </td>
                </tr>
            `;
            return;
        }
        
        let filteredEmployees = this.employees;
        
        if (filter) {
            const searchTerm = filter.toLowerCase();
            filteredEmployees = this.employees.filter(employee => 
                employee.name.toLowerCase().includes(searchTerm) ||
                employee.email.toLowerCase().includes(searchTerm) ||
                employee.department.toLowerCase().includes(searchTerm) ||
                employee.position.toLowerCase().includes(searchTerm) ||
                (employee.phone && employee.phone.toLowerCase().includes(searchTerm))
            );
        }
        
        filteredEmployees.forEach(employee => {
            const row = document.createElement('tr');
            
            let statusBadge = '';
            switch (employee.status) {
                case 'active':
                    statusBadge = '<span class="status-badge status-active">Active</span>';
                    break;
                case 'inactive':
                    statusBadge = '<span class="status-badge status-inactive">Inactive</span>';
                    break;
                case 'on leave':
                    statusBadge = '<span class="status-badge status-leave">On Leave</span>';
                    break;
            }
            
            row.innerHTML = `
                <td>${employee.id}</td>
                <td>${employee.name}</td>
                <td>${employee.email}</td>
                <td>${employee.phone || 'N/A'}</td>
                <td>${employee.department}</td>
                <td>${employee.position}</td>
                <td>${statusBadge}</td>
                <td>
                    <div class="actions">
                        <button class="action-btn btn-primary" onclick="employeeSystem.editEmployee(${employee.id})">
                            <i class="fas fa-edit"></i> Edit
                        </button>
                    </div>
                </td>
            `;
            
            tableBody.appendChild(row);
        });
    }
    
    filterEmployees(searchTerm) {
        this.loadEmployeesTable(searchTerm);
    }
    
    addEmployee() {
        const name = document.getElementById('employee-name').value.trim();
        const email = document.getElementById('employee-email').value.trim();
        const phone = document.getElementById('employee-phone').value.trim();
        const department = document.getElementById('employee-department').value;
        const position = document.getElementById('employee-position').value.trim();
        const salary = document.getElementById('employee-salary').value;
        const status = document.getElementById('employee-status').value;
        const hireDate = document.getElementById('employee-hire-date').value;
        const address = document.getElementById('employee-address').value.trim();
        
        // Validation
        if (!name || !email || !department || !position || !status) {
            this.showErrorAlert('Please fill in all required fields (marked with *).', 'employee-form-alert');
            return;
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            this.showErrorAlert('Please enter a valid email address.', 'employee-form-alert');
            return;
        }
        
        // Check if employee with same email already exists
        if (this.employees.some(e => e.email === email)) {
            this.showErrorAlert('An employee with this email already exists.', 'employee-form-alert');
            return;
        }
        
        // Create new employee
        const newEmployee = {
            id: this.nextEmployeeId++,
            name,
            email,
            phone: phone || null,
            department,
            position,
            salary: salary ? parseInt(salary) : null,
            status,
            hireDate: hireDate || new Date().toISOString().split('T')[0],
            address: address || null,
            addedBy: this.currentUser.id
        };
        
        this.employees.push(newEmployee);
        this.saveEmployees();
        
        // Update user's employees added count
        this.updateUserEmployeesAdded();
        
        this.showSuccessAlert('Employee added successfully!', 'employee-form-alert');
        
        // Reset form
        document.getElementById('employee-form').reset();
        
        // Update dashboard and tables
        this.updateDashboardStats();
        this.loadEmployeesTable();
        this.loadRecentEmployees();
        
        // Switch to employees tab
        this.switchTab('employees-tab');
    }
    
    updateUserEmployeesAdded() {
        const users = JSON.parse(localStorage.getItem('employeeSystemUsers') || '[]');
        const userIndex = users.findIndex(u => u.id === this.currentUser.id);
        if (userIndex !== -1) {
            if (!users[userIndex].employeesAdded) {
                users[userIndex].employeesAdded = 0;
            }
            users[userIndex].employeesAdded++;
            this.saveUsers(users);
            this.currentUser.employeesAdded = users[userIndex].employeesAdded;
            sessionStorage.setItem('employeeSystemCurrentUser', JSON.stringify(this.currentUser));
        }
    }
    
    editEmployee(employeeId) {
        const employee = this.employees.find(e => e.id === employeeId);
        if (!employee) return;
        
        // Populate edit form
        document.getElementById('edit-employee-id').value = employee.id;
        document.getElementById('edit-employee-name').value = employee.name;
        document.getElementById('edit-employee-email').value = employee.email;
        document.getElementById('edit-employee-phone').value = employee.phone || '';
        document.getElementById('edit-employee-department').value = employee.department;
        document.getElementById('edit-employee-position').value = employee.position;
        document.getElementById('edit-employee-salary').value = employee.salary || '';
        document.getElementById('edit-employee-status').value = employee.status;
        document.getElementById('edit-employee-hire-date').value = employee.hireDate || '';
        document.getElementById('edit-employee-address').value = employee.address || '';
        
        // Show modal
        document.getElementById('edit-employee-modal').style.display = 'flex';
        this.hideEditAlert();
    }
    
    updateEmployee() {
        const id = parseInt(document.getElementById('edit-employee-id').value);
        const name = document.getElementById('edit-employee-name').value.trim();
        const email = document.getElementById('edit-employee-email').value.trim();
        const phone = document.getElementById('edit-employee-phone').value.trim();
        const department = document.getElementById('edit-employee-department').value;
        const position = document.getElementById('edit-employee-position').value.trim();
        const salary = document.getElementById('edit-employee-salary').value;
        const status = document.getElementById('edit-employee-status').value;
        const hireDate = document.getElementById('edit-employee-hire-date').value;
        const address = document.getElementById('edit-employee-address').value.trim();
        
        // Validation
        if (!name || !email || !department || !position || !status) {
            this.showErrorAlert('Please fill in all required fields (marked with *).', 'edit-employee-alert');
            return;
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            this.showErrorAlert('Please enter a valid email address.', 'edit-employee-alert');
            return;
        }
        
        // Check if email is already used by another employee
        const emailExists = this.employees.some(e => e.email === email && e.id !== id);
        if (emailExists) {
            this.showErrorAlert('An employee with this email already exists.', 'edit-employee-alert');
            return;
        }
        
        // Update employee
        const employeeIndex = this.employees.findIndex(e => e.id === id);
        if (employeeIndex !== -1) {
            this.employees[employeeIndex] = {
                ...this.employees[employeeIndex],
                name,
                email,
                phone: phone || null,
                department,
                position,
                salary: salary ? parseInt(salary) : null,
                status,
                hireDate: hireDate || this.employees[employeeIndex].hireDate,
                address: address || null
            };
            
            this.saveEmployees();
            this.showSuccessAlert('Employee updated successfully!', 'edit-employee-alert');
            
            // Update tables and close modal after delay
            setTimeout(() => {
                this.closeEditModal();
                this.updateDashboardStats();
                this.loadEmployeesTable();
                this.loadRecentEmployees();
            }, 1500);
        }
    }
    
    deleteEmployee() {
        const id = parseInt(document.getElementById('edit-employee-id').value);
        
        if (confirm('Are you sure you want to delete this employee? This action cannot be undone.')) {
            const employeeIndex = this.employees.findIndex(e => e.id === id);
            if (employeeIndex !== -1) {
                this.employees.splice(employeeIndex, 1);
                this.saveEmployees();
                
                this.closeEditModal();
                this.updateDashboardStats();
                this.loadEmployeesTable();
                this.loadRecentEmployees();
                
                this.showSuccessAlert('Employee deleted successfully!', 'employee-form-alert');
            }
        }
    }
    
    closeEditModal() {
        document.getElementById('edit-employee-modal').style.display = 'none';
        document.getElementById('edit-employee-form').reset();
        this.hideEditAlert();
    }
    
    loadProfileData() {
        if (!this.currentUser) return;
        
        document.getElementById('profile-name').textContent = this.currentUser.name;
        document.getElementById('profile-email').textContent = this.currentUser.email;
        
        // Format join date
        const joinDate = new Date(this.currentUser.createdAt);
        document.getElementById('profile-join-date').textContent = joinDate.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        
        // Update employees added count
        const employeesAdded = this.employees.filter(e => e.addedBy === this.currentUser.id).length;
        document.getElementById('profile-employees-added').textContent = employeesAdded;
        
        // Update last login
        if (this.currentUser.lastLogin) {
            const lastLogin = new Date(this.currentUser.lastLogin);
            const now = new Date();
            const diffInHours = Math.floor((now - lastLogin) / (1000 * 60 * 60));
            
            let lastLoginText;
            if (diffInHours < 1) {
                lastLoginText = 'Just now';
            } else if (diffInHours < 24) {
                lastLoginText = `${diffInHours} hours ago`;
            } else {
                const diffInDays = Math.floor(diffInHours / 24);
                lastLoginText = `${diffInDays} days ago`;
            }
            
            document.getElementById('profile-last-login').textContent = lastLoginText;
        } else {
            document.getElementById('profile-last-login').textContent = 'First login';
        }
    }
    
    changePassword() {
        const currentPassword = document.getElementById('current-password').value;
        const newPassword = document.getElementById('new-password').value;
        const confirmNewPassword = document.getElementById('confirm-new-password').value;
        
        // Validation
        if (!currentPassword || !newPassword || !confirmNewPassword) {
            this.showErrorAlert('All fields are required.', 'profile-alert');
            return;
        }
        
        if (newPassword !== confirmNewPassword) {
            this.showErrorAlert('New passwords do not match.', 'profile-alert');
            return;
        }
        
        if (newPassword.length < 6) {
            this.showErrorAlert('New password must be at least 6 characters long.', 'profile-alert');
            return;
        }
        
        if (newPassword === currentPassword) {
            this.showErrorAlert('New password must be different from current password.', 'profile-alert');
            return;
        }
        
        // Check current password
        const users = JSON.parse(localStorage.getItem('employeeSystemUsers') || '[]');
        const userIndex = users.findIndex(u => u.id === this.currentUser.id);
        
        if (userIndex === -1 || users[userIndex].password !== currentPassword) {
            this.showErrorAlert('Current password is incorrect.', 'profile-alert');
            return;
        }
        
        // Update password
        users[userIndex].password = newPassword;
        this.saveUsers(users);
        
        // Update current user in session
        this.currentUser.password = newPassword;
        sessionStorage.setItem('employeeSystemCurrentUser', JSON.stringify(this.currentUser));
        
        this.showSuccessAlert('Password changed successfully!', 'profile-alert');
        
        // Clear form
        document.getElementById('change-password-form').reset();
    }
    
    showSuccessAlert(message, alertId) {
        const alertElement = document.getElementById(alertId);
        alertElement.innerHTML = `
            <div>
                <i class="fas fa-check-circle"></i> ${message}
            </div>
            <button class="close" onclick="this.parentElement.classList.add('d-none')">&times;</button>
        `;
        alertElement.className = 'alert alert-success';
        alertElement.classList.remove('d-none');
    }
    
    showErrorAlert(message, alertId) {
        const alertElement = document.getElementById(alertId);
        alertElement.innerHTML = `
            <div>
                <i class="fas fa-exclamation-circle"></i> ${message}
            </div>
            <button class="close" onclick="this.parentElement.classList.add('d-none')">&times;</button>
        `;
        alertElement.className = 'alert alert-danger';
        alertElement.classList.remove('d-none');
    }
    
    showInfoAlert(message, alertId) {
        const alertElement = document.getElementById(alertId);
        alertElement.innerHTML = `
            <div>
                <i class="fas fa-info-circle"></i> ${message}
            </div>
            <button class="close" onclick="this.parentElement.classList.add('d-none')">&times;</button>
        `;
        alertElement.className = 'alert alert-info';
        alertElement.classList.remove('d-none');
    }
    
    hideAuthAlert() {
        document.getElementById('auth-alert').classList.add('d-none');
    }
    
    hideEditAlert() {
        document.getElementById('edit-employee-alert').classList.add('d-none');
    }
}

// Initialize the application
const employeeSystem = new EmployeeManagementSystem();
