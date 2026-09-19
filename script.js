// ============ API CONFIGURATION ============
const API_URL = 'http://localhost:5000/api/patients';   // ← Fixed!

// ============ CHECK LOGIN ============
function checkLogin() {
    const user = localStorage.getItem('user');
    if (!user && !window.location.pathname.includes('index.html') && window.location.pathname !== '/') {
        window.location.href = 'index.html';
    }
}

// ============ LOGOUT ============
function logout() {
    localStorage.removeItem('user');
    window.location.href = 'index.html';
}

// ============ SHOW TOAST ============
function showToast(message, isError = false) {
    const toast = document.getElementById('toast');
    if (!toast) return;
    
    toast.textContent = message;
    toast.className = 'toast' + (isError ? ' error' : '');
    toast.style.display = 'block';
    
    setTimeout(() => {
        toast.style.display = 'none';
    }, 3000);
}

// ============ PATIENTS CRUD ============

// Load all patients
async function loadPatients() {
    try {
        const response = await fetch(API_URL);   // ← Fixed!
        const patients = await response.json();
        displayPatients(patients);
        updatePatientCount(patients.length);
    } catch (error) {
        console.error('Error loading patients:', error);
        displayPatients([]);
    }
}

// Display patients in table
function displayPatients(patients) {
    const tbody = document.getElementById('patientTableBody');
    if (!tbody) return;
    
    if (patients.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="no-data">No patients found. Add a patient above!</td></tr>';
        return;
    }
    
    tbody.innerHTML = patients.map(patient => `
        <tr>
            <td>${patient.id}</td>
            <td>${patient.patient_name || patient.name}</td>
            <td>${patient.age}</td>
            <td>${patient.gender}</td>
            <td>${patient.phone}</td>
            <td>${patient.blood_group || patient.bloodGroup || '-'}</td>
            <td>
                <button class="btn-edit" onclick="editPatient(${patient.id})">
                    <i class="fas fa-edit"></i> Edit
                </button>
                <button class="btn-delete" onclick="deletePatient(${patient.id})">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </td>
        </tr>
    `).join('');
}

// Save patient (Add or Update)
async function savePatient(event) {
    event.preventDefault();
    
    const id = document.getElementById('patientId').value;
    
    // Check which form fields exist
    const nameField = document.getElementById('name');
    const emailField = document.getElementById('email');
    const bloodField = document.getElementById('bloodGroup');
    const addressField = document.getElementById('address');
    const diseaseField = document.getElementById('disease');
    
    const patient = {
        name: nameField ? nameField.value : '',
        age: parseInt(document.getElementById('age').value),
        gender: document.getElementById('gender').value,
        phone: document.getElementById('phone').value
    };
    
    if (emailField) patient.email = emailField.value;
    if (bloodField) patient.bloodGroup = bloodField.value;
    if (addressField) patient.address = addressField.value;
    if (diseaseField) patient.disease = diseaseField.value;
    
    try {
        let response;
        if (id) {
            // Update
            response = await fetch(`${API_URL}/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(patient)
            });
        } else {
            // Create
            response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(patient)
            });
        }
        
        if (response.ok) {
            showToast(id ? '✅ Patient updated!' : '✅ Patient added!');
            resetForm();
            loadPatients();
        } else {
            showToast('❌ Error saving patient!', true);
        }
    } catch (error) {
        console.error('Error:', error);
        showToast('❌ Cannot connect to server!', true);
    }
}

// Edit patient
async function editPatient(id) {
    try {
        // Fetch all and find the one
        const response = await fetch(API_URL);
        const patients = await response.json();
        const patient = patients.find(p => p.id === id);
        
        if (!patient) {
            showToast('❌ Patient not found!', true);
            return;
        }
        
        // Fill form fields (check if they exist first)
        document.getElementById('patientId').value = patient.id;
        
        const nameField = document.getElementById('name');
        if (nameField) nameField.value = patient.patient_name || patient.name || '';
        
        document.getElementById('age').value = patient.age;
        document.getElementById('gender').value = patient.gender;
        document.getElementById('phone').value = patient.phone;
        
        const emailField = document.getElementById('email');
        if (emailField) emailField.value = patient.email || '';
        
        const bloodField = document.getElementById('bloodGroup');
        if (bloodField) bloodField.value = patient.blood_group || patient.bloodGroup || '';
        
        const addressField = document.getElementById('address');
        if (addressField) addressField.value = patient.address || '';
        
        const diseaseField = document.getElementById('disease');
        if (diseaseField) diseaseField.value = patient.disease || '';
        
        document.getElementById('formTitle').textContent = 'Edit Patient';
        window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
        showToast('❌ Error loading patient!', true);
    }
}

// Delete patient
async function deletePatient(id) {
    if (!confirm('Are you sure you want to delete this patient?')) return;
    
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            showToast('✅ Patient deleted!');
            loadPatients();
        } else {
            showToast('❌ Error deleting patient!', true);
        }
    } catch (error) {
        showToast('❌ Cannot connect to server!', true);
    }
}

// Reset form
function resetForm() {
    const form = document.getElementById('patientForm');
    if (form) form.reset();
    
    const idField = document.getElementById('patientId');
    if (idField) idField.value = '';
    
    const title = document.getElementById('formTitle');
    if (title) title.textContent = 'Add New Patient';
}

// Search patients
function searchPatients() {
    const input = document.getElementById('searchInput');
    if (!input) return;
    
    const searchText = input.value.toLowerCase();
    const rows = document.querySelectorAll('#patientTableBody tr');
    
    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(searchText) ? '' : 'none';
    });
}

// Update patient count on dashboard
function updatePatientCount(count) {
    const element = document.getElementById('totalPatients');
    if (element) {
        element.textContent = count;
    }
}

// ============ INITIALIZE ============
document.addEventListener('DOMContentLoaded', () => {
    checkLogin();
    
    // Load patients if on patients page
    if (window.location.pathname.includes('patients.html')) {
        loadPatients();
    }
    
    // Load count for dashboard
    if (window.location.pathname.includes('dashboard.html')) {
        loadPatients();
    }
});