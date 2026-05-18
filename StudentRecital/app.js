// app.js

document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const navSignup = document.getElementById('nav-signup');
  const navReports = document.getElementById('nav-reports');
  const signupView = document.getElementById('signup-view');
  const reportsView = document.getElementById('reports-view');
  
  const signupForm = document.getElementById('signup-form');
  const successMessage = document.getElementById('success-message');
  const editIdInput = document.getElementById('edit-id');
  const cancelEditBtn = document.getElementById('cancel-edit-btn');
  const submitBtn = document.getElementById('submit-btn');
  const addPieceBtn = document.getElementById('add-piece-btn');
  const piecesContainer = document.getElementById('pieces-container');
  
  const authView = document.getElementById('auth-view');
  const loginForm = document.getElementById('login-form');
  const authPassword = document.getElementById('auth-password');
  const authError = document.getElementById('auth-error');
  
  const changePwdBtn = document.getElementById('change-pwd-btn');
  const changePwdModal = document.getElementById('change-pwd-modal');
  const closeModalBtn = document.getElementById('close-modal-btn');
  const changePwdForm = document.getElementById('change-pwd-form');
  const newPasswordBtn = document.getElementById('new-password');
  const confirmPasswordBtn = document.getElementById('confirm-password');
  const pwdError = document.getElementById('pwd-error');
  const pwdSuccess = document.getElementById('pwd-success');
  
  const exportProgramBtn = document.getElementById('export-program-btn');
  const exportProgramModal = document.getElementById('export-program-modal');
  const closeProgramModalBtn = document.getElementById('close-program-modal-btn');
  const exportProgramForm = document.getElementById('export-program-form');
  
  const reportsTable = document.getElementById('reports-table');
  const reportsBody = document.getElementById('reports-body');
  const emptyState = document.getElementById('empty-state');
  const exportBtn = document.getElementById('export-btn');

  // Local Storage Keys
  const STORAGE_KEY = 'student_recital_registrations';
  const AUTH_KEY = 'student_recital_password';

  // State
  let registrations = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  let currentPassword = localStorage.getItem(AUTH_KEY) || 'Mu$1c@rt5';
  let isUnlocked = false;

  // --- UI Navigation ---
  
  const showView = (viewToShow) => {
    // Hide all
    signupView.classList.add('hidden');
    reportsView.classList.add('hidden');
    authView.classList.add('hidden');
    signupView.classList.remove('active');
    reportsView.classList.remove('active');
    authView.classList.remove('active');
    
    // Deactivate all tabs
    navSignup.classList.remove('active');
    navReports.classList.remove('active');
    
    // Show selected
    if (viewToShow === 'signup') {
      signupView.classList.remove('hidden');
      setTimeout(() => signupView.classList.add('active'), 10);
      navSignup.classList.add('active');
    } else if (viewToShow === 'reports') {
      navReports.classList.add('active');
      if (!isUnlocked) {
        authView.classList.remove('hidden');
        setTimeout(() => authView.classList.add('active'), 10);
        authPassword.value = '';
        authError.classList.add('hidden');
      } else {
        reportsView.classList.remove('hidden');
        setTimeout(() => reportsView.classList.add('active'), 10);
        renderTable(); // Update table when showing reports
      }
    }
  };

  navSignup.addEventListener('click', () => {
    resetForm();
    showView('signup');
  });
  navReports.addEventListener('click', () => showView('reports'));

  // --- Authentication Handling ---
  
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (authPassword.value === currentPassword) {
      isUnlocked = true;
      showView('reports');
    } else {
      authError.classList.remove('hidden');
    }
  });

  changePwdBtn.addEventListener('click', () => {
    changePwdModal.classList.remove('hidden');
    changePwdForm.reset();
    pwdError.classList.add('hidden');
    pwdSuccess.classList.add('hidden');
  });

  closeModalBtn.addEventListener('click', () => {
    changePwdModal.classList.add('hidden');
  });

  changePwdForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const newPwd = document.getElementById('new-password').value;
    const confirmPwd = document.getElementById('confirm-password').value;
    
    if (newPwd !== confirmPwd) {
      pwdError.classList.remove('hidden');
      pwdSuccess.classList.add('hidden');
      return;
    }
    
    pwdError.classList.add('hidden');
    currentPassword = newPwd;
    localStorage.setItem(AUTH_KEY, currentPassword);
    
    pwdSuccess.classList.remove('hidden');
    setTimeout(() => {
      changePwdModal.classList.add('hidden');
    }, 1500);
  });

  exportProgramBtn.addEventListener('click', () => {
    exportProgramModal.classList.remove('hidden');
    exportProgramForm.reset();
  });

  closeProgramModalBtn.addEventListener('click', () => {
    exportProgramModal.classList.add('hidden');
  });

  exportProgramForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const recitalName = document.getElementById('recital-name').value;
    const recitalDate = document.getElementById('recital-date').value;
    exportProgramModal.classList.add('hidden');
    
    generatePrintableProgram(recitalName, recitalDate);
  });

  const generatePrintableProgram = (name, date) => {
    // Sort a copy of the registrations alphabetically by student name
    const sorted = [...registrations].sort((a, b) => 
      a.studentName.localeCompare(b.studentName)
    );

    let html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Recital Program</title>
        <style>
          body { 
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; 
            color: #111827; 
            padding: 40px; 
            margin: 0; 
            background-image: url('data:image/svg+xml;utf8,<svg viewBox="0 0 24 24" fill="none" stroke="rgba(212, 40, 40, 0.08)" stroke-width="0.5" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>');
            background-repeat: no-repeat;
            background-position: center 50%;
            background-attachment: fixed;
            background-size: 50%;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .header { text-align: center; margin-bottom: 40px; border-bottom: 3px solid #D42828; padding-bottom: 20px; }
          .logo { display: inline-block; width: 250px; height: auto; margin-bottom: 20px; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .header h1 { margin: 0 0 10px 0; font-size: 28px; text-transform: uppercase; letter-spacing: 1px; color: #111827; }
          .header p { margin: 0; font-size: 18px; color: #D42828; font-weight: bold; }
          .student-block { margin-bottom: 30px; border-bottom: 1px solid #E5E7EB; padding-bottom: 20px; }
          .student-header { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 12px; }
          .student-name { font-size: 20px; font-weight: bold; color: #D42828; }
          .student-meta { font-size: 14px; font-style: italic; color: #4B5563; }
          .repertoire-list { list-style: none; padding: 0; margin: 0; }
          .repertoire-item { display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 16px; }
          .song-title { font-weight: 500; }
          .composer { font-size: 14px; color: #6B7280; }
          @media print {
            body { padding: 0; }
            .header { border-bottom-color: #D42828 !important; }
            .student-name { color: #D42828 !important; }
            .student-block { page-break-inside: avoid; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <img src="data:image/png;base64,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" alt="Music & Arts" class="logo">
          <h1>${escapeHTML(name)}</h1>
          <p>${escapeHTML(date)}</p>
          <svg style="margin-top: 20px; color: #D42828;" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>
        </div>
    `;

    if (sorted.length === 0) {
      html += `<p style="text-align:center;">No students registered to perform yet.</p>`;
    } else {
      sorted.forEach(reg => {
        let piecesHtml = '';
        if (reg.pieces && reg.pieces.length > 0) {
          piecesHtml = `<ul class="repertoire-list">`;
          reg.pieces.forEach(p => {
            const compositeComposer = p.composer ? `by ${p.composer}` : '';
            piecesHtml += `
              <li class="repertoire-item">
                <span class="song-title">${escapeHTML(p.song)}</span>
                <span class="composer">${escapeHTML(compositeComposer)}</span>
              </li>
            `;
          });
          piecesHtml += `</ul>`;
        } else {
          piecesHtml = `<p style="margin:0; font-style:italic; font-size:14px;">No pieces listed</p>`;
        }

        let timeStr = `${reg.yearsPlaying} Yrs`;
        if (reg.monthsPlaying && reg.monthsPlaying > 0) {
          timeStr += `, ${reg.monthsPlaying} Mo`;
        }

        html += `
          <div class="student-block">
            <div class="student-header">
              <div class="student-name">
                ${escapeHTML(reg.studentName)} 
                <span style="font-size:14px; color:#4B5563; font-weight:normal; margin-left: 8px;">(Age ${reg.studentAge}, ${escapeHTML(timeStr)} playing)</span>
              </div>
              <div class="student-meta">${escapeHTML(reg.instrument)} &bull; Instructor: ${escapeHTML(reg.instructor)}</div>
            </div>
            ${piecesHtml}
          </div>
        `;
      });
    }

    html += `
      </body>
      </html>
    `;

    const printWin = window.open('', '_blank');
    if (printWin) {
      printWin.document.write(html);
      printWin.document.close();
      printWin.focus();
      // small delay to allow CSS parsing and painting
      setTimeout(() => {
        printWin.print();
      }, 500);
    } else {
      alert("Please allow popups for this site to generate the program.");
    }
  };

  // --- Dynamic Pieces ---
  const createPieceRow = (composer = '', song = '') => {
    const row = document.createElement('div');
    row.className = 'piece-row';
    row.innerHTML = `
      <div class="form-group half">
        <label>Composer / Performer</label>
        <input type="text" name="composer[]" required placeholder="e.g. J.S. Bach" value="${escapeHTML(composer)}">
      </div>
      <div class="form-group half">
        <label>Song Title</label>
        <input type="text" name="song[]" required placeholder="e.g. Minuet in G" value="${escapeHTML(song)}">
      </div>
      <div class="remove-col">
        <button type="button" class="remove-piece-btn" title="Remove Piece">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
      </div>
    `;
    
    row.querySelector('.remove-piece-btn').addEventListener('click', () => {
      row.remove();
    });
    
    return row;
  };

  addPieceBtn.addEventListener('click', () => {
    piecesContainer.appendChild(createPieceRow());
  });

  // --- Form Handling ---
  
  signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Gather pieces
    const composers = Array.from(document.getElementsByName('composer[]')).map(i => i.value.trim());
    const songs = Array.from(document.getElementsByName('song[]')).map(i => i.value.trim());
    
    const pieces = composers.map((comp, index) => ({
      composer: comp,
      song: songs[index]
    }));
    
    // Gather data
    const registrationData = {
      id: editIdInput.value || Date.now().toString(),
      studentName: document.getElementById('studentName').value.trim(),
      studentAge: parseInt(document.getElementById('studentAge').value, 10),
      yearsPlaying: document.getElementById('yearsPlaying').value,
      monthsPlaying: document.getElementById('monthsPlaying').value,
      instrument: document.getElementById('instrument').value.trim(),
      instructor: document.getElementById('instructor').value.trim(),
      attendees: parseInt(document.getElementById('attendees').value, 10),
      pieces: pieces,
      dateRegistered: new Date().toISOString()
    };
    
    // Save or Update
    if (editIdInput.value) {
      const index = registrations.findIndex(reg => reg.id === editIdInput.value);
      if (index !== -1) {
        // preserve original date
        registrationData.dateRegistered = registrations[index].dateRegistered;
        registrations[index] = registrationData;
      }
    } else {
      registrations.push(registrationData);
    }
    
    saveData();
    resetForm();
    showSuccessMessage();
  });

  cancelEditBtn.addEventListener('click', () => {
    resetForm();
  });

  const resetForm = () => {
    signupForm.reset();
    editIdInput.value = '';
    submitBtn.textContent = 'Complete Registration';
    document.querySelector('.glass-panel h2').textContent = 'Student Registration Form';
    cancelEditBtn.classList.add('hidden');
    
    // Reset pieces container to 1 row
    piecesContainer.innerHTML = '';
    piecesContainer.appendChild(createInitialPieceRow());
  };

  const createInitialPieceRow = () => {
    const row = document.createElement('div');
    row.className = 'piece-row';
    row.innerHTML = `
      <div class="form-group half">
        <label>Composer / Performer</label>
        <input type="text" name="composer[]" required placeholder="e.g. J.S. Bach">
      </div>
      <div class="form-group half">
        <label>Song Title</label>
        <input type="text" name="song[]" required placeholder="e.g. Minuet in G">
      </div>
      <div class="remove-col">
      </div>
    `;
    return row;
  };

  const showSuccessMessage = () => {
    successMessage.classList.remove('hidden');
    setTimeout(() => {
      successMessage.classList.add('hidden');
    }, 3000);
  };

  // --- Data Management ---
  
  const saveData = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(registrations));
  };

  const deleteRegistration = (id) => {
    if (confirm('Are you sure you want to delete this registration?')) {
      registrations = registrations.filter(reg => reg.id !== id);
      saveData();
      renderTable();
    }
  };

  // --- Rendering ---
  
  const editRegistration = (id) => {
    const reg = registrations.find(r => r.id === id);
    if (!reg) return;

    // Populate form fields
    document.getElementById('studentName').value = reg.studentName;
    document.getElementById('studentAge').value = reg.studentAge;
    document.getElementById('yearsPlaying').value = reg.yearsPlaying;
    document.getElementById('monthsPlaying').value = reg.monthsPlaying || '';
    document.getElementById('instrument').value = reg.instrument;
    document.getElementById('instructor').value = reg.instructor;
    document.getElementById('attendees').value = reg.attendees;
    
    // Setup Pieces
    piecesContainer.innerHTML = '';
    if (reg.pieces && reg.pieces.length > 0) {
      // Create first piece without remove button
      const firstRow = createInitialPieceRow();
      firstRow.querySelector('input[name="composer[]"]').value = reg.pieces[0].composer;
      firstRow.querySelector('input[name="song[]"]').value = reg.pieces[0].song;
      piecesContainer.appendChild(firstRow);
      
      // Add the rest
      for (let i = 1; i < reg.pieces.length; i++) {
        piecesContainer.appendChild(createPieceRow(reg.pieces[i].composer, reg.pieces[i].song));
      }
    } else {
      piecesContainer.appendChild(createInitialPieceRow());
    }

    // Update UI for editing
    editIdInput.value = reg.id;
    submitBtn.textContent = 'Save Changes';
    document.querySelector('.glass-panel h2').textContent = 'Edit Student Registration';
    cancelEditBtn.classList.remove('hidden');
    
    showView('signup');
  };

  // --- Rendering ---
  
  const renderTable = () => {
    // Clear existing
    reportsBody.innerHTML = '';
    
    if (registrations.length === 0) {
      reportsTable.classList.add('hidden');
      emptyState.classList.remove('hidden');
      return;
    }
    
    reportsTable.classList.remove('hidden');
    emptyState.classList.add('hidden');
    
    // Populate
    registrations.forEach(reg => {
      const tr = document.createElement('tr');
      
      // Format Pieces
      let piecesFormatted = 'None';
      if (reg.pieces && reg.pieces.length > 0) {
        piecesFormatted = reg.pieces.map(p => `${escapeHTML(p.song)} by ${escapeHTML(p.composer)}`).join('<br>');
      }
      
      let timeStr = `${reg.yearsPlaying} Yrs`;
      if (reg.monthsPlaying && reg.monthsPlaying > 0) {
        timeStr += `, ${reg.monthsPlaying} Mo`;
      }
      
      tr.innerHTML = `
        <td>${escapeHTML(reg.studentName)}</td>
        <td>${reg.studentAge}</td>
        <td>${escapeHTML(timeStr)}</td>
        <td>${escapeHTML(reg.instrument)}</td>
        <td>${escapeHTML(reg.instructor)}</td>
        <td style="font-size: 0.9em;">${piecesFormatted}</td>
        <td>${reg.attendees}</td>
        <td>
          <div class="action-buttons">
            <button class="edit-btn" data-id="${reg.id}" aria-label="Edit">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-edit"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            </button>
            <button class="delete-btn" data-id="${reg.id}" aria-label="Delete">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash-2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
            </button>
          </div>
        </td>
      `;
      
      reportsBody.appendChild(tr);
    });
    
    // Attach listeners
    document.querySelectorAll('.delete-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        deleteRegistration(id);
      });
    });

    document.querySelectorAll('.edit-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.closest('.edit-btn').getAttribute('data-id');
        editRegistration(id);
      });
    });
  };

  // Helper to prevent XSS
  const escapeHTML = (str) => {
    return str.replace(/[&<>'"]/g, 
      tag => ({
          '&': '&amp;',
          '<': '&lt;',
          '>': '&gt;',
          "'": '&#39;',
          '"': '&quot;'
        }[tag]));
  };

  // --- CSV Export ---
  
  const convertToCSV = (objArray) => {
    const array = typeof objArray !== 'object' ? JSON.parse(objArray) : objArray;
    let str = '';
    
    // Headers
    const headers = ['Student Name', 'Age', 'Experience (Yrs)', 'Experience (Mos)', 'Instrument', 'Instructor', 'Repertoire', 'Attendees', 'Date Registered'];
    str += headers.join(',') + '\r\n';

    // Rows
    for (let i = 0; i < array.length; i++) {
      let line = '';
      
      let repertoireFormatted = '';
      if (array[i].pieces && array[i].pieces.length > 0) {
        repertoireFormatted = array[i].pieces.map(p => `${p.song} by ${p.composer}`).join(' | ');
      }
      
      const rowData = [
        array[i].studentName,
        array[i].studentAge,
        array[i].yearsPlaying,
        array[i].monthsPlaying || 0,
        array[i].instrument,
        array[i].instructor,
        repertoireFormatted,
        array[i].attendees,
        new Date(array[i].dateRegistered).toLocaleString()
      ];
      
      for (const value of rowData) {
        if (line !== '') line += ',';
        // Enclose in quotes to handle commas in data
        line += `"${String(value).replace(/"/g, '""')}"`;
      }
      
      str += line + '\r\n';
    }
    return str;
  };

  exportBtn.addEventListener('click', () => {
    if (registrations.length === 0) {
      alert('No data to export!');
      return;
    }
    
    const csvData = convertToCSV(registrations);
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    
    // Create download link
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `Recital_Report_${new Date().toISOString().split('T')[0]}.csv`);
    
    // Trigger download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  });
});
