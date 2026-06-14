// Universal Calculator Logic
let config = JSON.parse(localStorage.getItem('calculatorConfig')) || {
    distribution: { quiz: 15, presentation: 8, assignment: 5, attendance: 7, mid: 25, final: 40 },
    quizSettings: { total: 3, count: 3, method: 'avg' }
};

let selections = {
    presentation: { level: null, value: 0 },
    assignment: { level: null, value: 0 }
};

const selectionLogic = {
    5: { poor: [3], good: [4], excellent: [5] },
    6: { poor: [4], good: [5], excellent: [6] },
    7: { poor: [4], good: [5], excellent: [6, 7] },
    8: { poor: [5], good: [5, 6], excellent: [7, 8] },
    9: { poor: [5], good: [6], excellent: [7, 8, 9] },
    10: { poor: [5], good: [6, 7], excellent: [8, 9, 10] }
};

const formatNum = (num) => parseFloat(Number(num).toFixed(2));

const systemsData = {
    1: [
        { grade: 'A+', min: 80, max: 100, gp: 4.00 },
        { grade: 'A', min: 75, max: 79, gp: 3.75 },
        { grade: 'A-', min: 70, max: 74, gp: 3.50 },
        { grade: 'B+', min: 65, max: 69, gp: 3.25 },
        { grade: 'B', min: 60, max: 64, gp: 3.00 },
        { grade: 'B-', min: 55, max: 59, gp: 2.75 },
        { grade: 'C+', min: 50, max: 54, gp: 2.50 },
        { grade: 'C', min: 45, max: 49, gp: 2.25 },
        { grade: 'D', min: 40, max: 44, gp: 2.00 },
        { grade: 'F', min: 0, max: 39, gp: 0.00 }
    ],
    2: [
        { grade: 'A', min: 90, max: 100, gp: 4.00 },
        { grade: 'A-', min: 86, max: 89, gp: 3.70 },
        { grade: 'B+', min: 82, max: 85, gp: 3.30 },
        { grade: 'B', min: 78, max: 81, gp: 3.00 },
        { grade: 'B-', min: 74, max: 77, gp: 2.70 },
        { grade: 'C+', min: 70, max: 73, gp: 2.30 },
        { grade: 'C', min: 66, max: 69, gp: 2.00 },
        { grade: 'C-', min: 62, max: 65, gp: 1.70 },
        { grade: 'D+', min: 58, min: 61, gp: 1.30 },
        { grade: 'D', min: 55, max: 57, gp: 1.00 },
        { grade: 'F', min: 0, max: 54, gp: 0.00 }
    ],
    3: [
        { grade: 'A+', min: 94, max: 100, gp: 4.00 },
        { grade: 'A', min: 90, max: 93.99, gp: 3.75 },
        { grade: 'B+', min: 86, max: 89.99, gp: 3.50 },
        { grade: 'B', min: 82, max: 85.99, gp: 3.25 },
        { grade: 'C+', min: 78, max: 81.99, gp: 3.00 },
        { grade: 'C', min: 74, max: 77.99, gp: 2.75 },
        { grade: 'D+', min: 70, max: 73.99, gp: 2.50 },
        { grade: 'D', min: 50, max: 69.99, gp: 2.25 },
        { grade: 'F', min: 0, max: 49.99, gp: 0.00 }
    ],
    4: [
        { grade: 'A', min: 93, max: 100, gp: 4.00 },
        { grade: 'A-', min: 90, max: 92, gp: 3.75 },
        { grade: 'B+', min: 87, max: 89, gp: 3.50 },
        { grade: 'B', min: 83, max: 86, gp: 3.25 },
        { grade: 'B-', min: 80, max: 82, gp: 3.00 },
        { grade: 'C+', min: 77, max: 79, gp: 2.75 },
        { grade: 'C', min: 73, max: 76, gp: 2.50 },
        { grade: 'C-', min: 70, max: 72, gp: 2.25 },
        { grade: 'D+', min: 67, max: 69, gp: 2.00 },
        { grade: 'D', min: 60, max: 66, gp: 1.00 },
        { grade: 'F', min: 0, max: 59, gp: 0.00 }
    ]
};

let gradeThresholds = JSON.parse(localStorage.getItem('activeSystem')) || systemsData[1];

window.addEventListener('DOMContentLoaded', () => {
    applyConfig();
    renderQuizzes();
    calculateTotal();
    renderSemesterList();
});

function applyConfig() {
    // Update badges
    document.getElementById('presentation-badge').textContent = `Max ${config.distribution.presentation}`;
    document.getElementById('assignment-badge').textContent = `Max ${config.distribution.assignment}`;
    document.getElementById('attendance-badge').textContent = `Max ${config.distribution.attendance}`;
    document.getElementById('mid-badge').textContent = `Max ${config.distribution.mid}`;
    document.getElementById('final-badge').textContent = `Max ${config.distribution.final}`;
    
    const methodText = config.quizSettings.method === 'avg' ? 'Avg' : 'Sum';
    document.getElementById('quiz-badge').textContent = `Best ${config.quizSettings.count} of ${config.quizSettings.total} (${methodText})`;
    
    document.getElementById('configSummary').textContent = `Quiz: ${config.distribution.quiz}% | Mid: ${config.distribution.mid}% | Final: ${config.distribution.final}%`;

    // Hide sections if their weight is 0
    document.querySelector('.quiz-section').style.display = config.distribution.quiz === 0 ? 'none' : 'block';
    document.querySelector('.presentation-section').style.display = config.distribution.presentation === 0 ? 'none' : 'block';
    document.querySelector('.assignment-section').style.display = config.distribution.assignment === 0 ? 'none' : 'block';
    document.querySelector('.attendance-section').style.display = config.distribution.attendance === 0 ? 'none' : 'block';
    document.querySelector('.midterm-section').style.display = config.distribution.mid === 0 ? 'none' : 'block';
    document.querySelector('.final-section').style.display = config.distribution.final === 0 ? 'none' : 'block';
}

function renderQuizzes() {
    const container = document.getElementById('quiz-inputs-container');
    container.innerHTML = '';
    
    // Default max for a single quiz is the section weight
    const quizMax = config.distribution.quiz;
    
    for (let i = 1; i <= config.quizSettings.total; i++) {
        const div = document.createElement('div');
        div.className = 'input-group';
        div.innerHTML = `
            <label>Quiz ${i}</label>
            <input type="number" id="quiz-${i}" placeholder="${quizMax}" min="0" max="${quizMax}" oninput="enforceLimit(this); calculateTotal()">
        `;
        container.appendChild(div);
    }
}

function enforceLimit(input) {
    const max = parseFloat(input.getAttribute('max'));
    let val = parseFloat(input.value);
    
    if (val > max) {
        input.value = max;
        input.classList.add('error-shake');
        setTimeout(() => input.classList.remove('error-shake'), 400);
    }
    if (val < 0) input.value = 0;
}

function setSelection(type, level) {
    const max = config.distribution[type];
    const logic = selectionLogic[max] || { poor: [max * 0.5], good: [max * 0.7], excellent: [max] };
    
    const possibleValues = logic[level];
    const pickedValue = possibleValues[Math.floor(Math.random() * possibleValues.length)];
    
    selections[type] = { level, value: pickedValue };
    
    // Update UI
    const container = document.getElementById(`${type}-selection`);
    container.querySelectorAll('.select-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.classList.contains(level)) btn.classList.add('active');
    });
    
    document.getElementById(`${type}-display-val`).textContent = `Points: ${pickedValue}`;
    
    calculateTotal();
}

function calculateTotal() {
    // 1. Quizzes
    const quizInputs = document.querySelectorAll('#quiz-inputs-container input');
    const quizMarks = Array.from(quizInputs)
        .map(input => parseFloat(input.value) || 0)
        .sort((a, b) => b - a);
    
    const bestQuizzes = quizMarks.slice(0, config.quizSettings.count);
    let quizScore = 0;
    
    if (config.quizSettings.method === 'avg') {
        const avg = bestQuizzes.length > 0 ? bestQuizzes.reduce((a, b) => a + b, 0) / config.quizSettings.count : 0;
        quizScore = avg;
    } else {
        // Sum method: Sum of best N. Assume the total possible sum = section weight.
        // Or if sum, each quiz might be e.g. 5 marks. 
        // We'll just take the raw sum but clamp it to the weight.
        quizScore = bestQuizzes.reduce((a, b) => a + b, 0);
    }
    
    // Clamp quiz score to max weight
    quizScore = Math.min(quizScore, config.distribution.quiz);
    document.getElementById('quiz-avg-display').textContent = `Obtained: ${formatNum(quizScore)} / ${config.distribution.quiz}`;

    // 2. Others
    const midInput = document.getElementById('mid-term');
    const finalInput = document.getElementById('final-exam');
    const attendInput = document.getElementById('attendance-percent');

    // Set max attributes dynamically
    midInput.max = config.distribution.mid;
    finalInput.max = config.distribution.final;
    attendInput.max = 100;

    // Apply enforcement
    enforceLimit(midInput);
    enforceLimit(finalInput);
    enforceLimit(attendInput);

    const presMarks = selections.presentation.value;
    const assignMarks = selections.assignment.value;
    const midMarks = parseFloat(midInput.value) || 0;
    const finalMarks = parseFloat(finalInput.value) || 0;
    
    const attendancePercent = parseFloat(attendInput.value) || 0;
    const attendMarks = (attendancePercent / 100) * config.distribution.attendance;
    document.getElementById('attendance-display').textContent = `Points: ${formatNum(attendMarks)} / ${config.distribution.attendance}`;

    // Total
    const total = quizScore + presMarks + assignMarks + midMarks + attendMarks + finalMarks;
    document.getElementById('total-marks').textContent = formatNum(total);

    // Grade
    const grade = determineGrade(total);
    const gradeEl = document.getElementById('grade-status');
    gradeEl.textContent = `${grade.grade} (${grade.gp})`;
    gradeEl.className = 'status-value ' + getGradeColorClass(grade.grade);

    // Next Milestone
    const finalEntered = document.getElementById('final-exam').value !== '';
    updateMilestone(total, finalEntered);
    updateGradeTargets(total, finalEntered);
}

function determineGrade(marks) {
    for (let threshold of gradeThresholds) {
        if (marks >= threshold.min) return threshold;
    }
    return gradeThresholds[gradeThresholds.length - 1];
}

function getGradeColorClass(grade) {
    const map = { 'A+': 'grade-a-plus', 'A': 'grade-a', 'A-': 'grade-a-minus', 'B+': 'grade-b-plus', 'B': 'grade-b', 'B-': 'grade-b-minus', 'C+': 'grade-c-plus', 'C': 'grade-c', 'D': 'grade-d', 'F': 'grade-f' };
    return map[grade] || '';
}

function updateMilestone(total, isFinalEntered) {
    const el = document.getElementById('needed-pass');
    const currentGrade = determineGrade(total);

    if (isFinalEntered) {
        el.textContent = `Archived ${currentGrade.grade}`;
        el.className = 'status-value ' + getGradeColorClass(currentGrade.grade);
        return;
    }

    if (total >= 80) {
        el.textContent = 'Perfect! A+ Achieved';
        el.className = 'status-value grade-a-plus';
    } else {
        const next = [...gradeThresholds].reverse().find(t => t.min > total);
        if (next) {
            const needed = formatNum(next.min - total);
            el.textContent = `${needed} more for ${next.grade}`;
            el.className = 'status-value ' + getGradeColorClass(next.grade);
        } else {
            el.textContent = 'Max Grade Reached';
        }
    }
}

function updateGradeTargets(currentTotal, isFinalEntered) {
    const tbody = document.getElementById('grade-targets-body');
    tbody.innerHTML = '';
    
    gradeThresholds.forEach(threshold => {
        const row = document.createElement('tr');
        const needed = threshold.min - currentTotal;
        let statusText = '';
        
        let sClass = '';
        if (needed <= 0) {
            sClass = 'status-achieved';
            statusText = '✓ Achieved';
        } else if (isFinalEntered || needed > config.distribution.final) {
            sClass = 'status-impossible'; // Locked after final or mathematically impossible
            statusText = 'Not Achieved';
        } else {
            sClass = 'status-possible'; // Still possible if less than final weight
            statusText = `${formatNum(needed)} marks`;
        }
        
        row.innerHTML = `
            <td class="${getGradeColorClass(threshold.grade)}">${threshold.grade}</td>
            <td class="gp-text">${threshold.gp.toFixed(2)}</td>
            <td>${threshold.min} - ${threshold.max}</td>
            <td><span class="status-pill ${sClass}">${statusText}</span></td>
        `;
        tbody.appendChild(row);
    });
}

function openSystemModal() {
    document.getElementById('systemModal').classList.add('show');
}

function closeSystemModal() {
    document.getElementById('systemModal').classList.remove('show');
}

function applySystem(id) {
    gradeThresholds = systemsData[id];
    localStorage.setItem('activeSystem', JSON.stringify(gradeThresholds));
    closeSystemModal();
    calculateTotal();
}

function addToSemester() {
    const name = document.getElementById('course-name').value.trim();
    const credits = parseFloat(document.getElementById('course-credits').value);
    
    if (!name || isNaN(credits)) {
        showToast('Please enter Course Name and Credits first!', 'error');
        return;
    }

    const total = parseFloat(document.getElementById('total-marks').textContent);
    const gradeObj = determineGrade(total);
    
    const result = {
        name,
        credits,
        grade: gradeObj.grade,
        gp: gradeObj.gp,
        timestamp: new Date().getTime()
    };
    
    let results = JSON.parse(localStorage.getItem('semesterResults')) || [];
    results.push(result);
    localStorage.setItem('semesterResults', JSON.stringify(results));
    
    showToast(`Added ${name} to Semester Results!`);
    renderSemesterList();
}

function renderSemesterList() {
    const list = document.getElementById('semester-list');
    const results = JSON.parse(localStorage.getItem('semesterResults')) || [];
    
    if (results.length === 0) {
        list.innerHTML = '<div class="empty-state">No subjects added yet.</div>';
        return;
    }
    
    list.innerHTML = results.map(sub => `
        <div class="semester-item">
            <div class="sub-name">${sub.name}</div>
            <div class="sub-credits">${sub.credits} CR</div>
            <div class="sub-grade ${getGradeColorClass(sub.grade)}">${sub.grade} (${sub.gp.toFixed(2)})</div>
        </div>
    `).join('');
}

function clearSemester() {
    openConfirmModal('Clear Semester?', 'Are you sure you want to clear all saved semester subjects? This cannot be undone.', () => {
        localStorage.removeItem('semesterResults');
        renderSemesterList();
        showToast('Semester results cleared!');
    });
}

function goToCGPAPage() {
    const results = JSON.parse(localStorage.getItem('semesterResults')) || [];
    if (results.length === 0) {
        showToast('Add at least one subject first!', 'error');
        return;
    }
    window.location.href = '../../X_Calculator/CGPA_Calculator/CGPA_Result.html';
}

function calculateSemesterGPA() {
    const results = JSON.parse(localStorage.getItem('semesterResults')) || [];
    
    if (results.length === 0) {
        showToast('Add at least one subject to calculate GPA!', 'error');
        return;
    }
    
    let totalPoints = 0;
    let totalCredits = 0;
    
    results.forEach(sub => {
        totalPoints += (sub.gp * sub.credits);
        totalCredits += sub.credits;
    });
    
    const finalGPA = totalPoints / totalCredits;
    
    document.getElementById('final-gpa-val').textContent = finalGPA.toFixed(2);
    document.getElementById('total-credits-val').textContent = totalCredits;
    document.getElementById('total-points-val').textContent = totalPoints.toFixed(2);
    
    document.getElementById('semesterResultModal').classList.add('show');
}

function closeSemesterResultModal() {
    document.getElementById('semesterResultModal').classList.remove('show');
}

function openConfirmModal(title, msg, onConfirm) {
    document.getElementById('confirm-title').textContent = title;
    document.getElementById('confirm-msg').textContent = msg;
    const btn = document.getElementById('confirm-action-btn');
    
    // Use onclick for simplicity, ensures only one listener
    btn.onclick = () => {
        onConfirm();
        closeConfirmModal();
    };
    
    document.getElementById('confirmModal').classList.add('show');
}

function closeConfirmModal() {
    document.getElementById('confirmModal').classList.remove('show');
}

function showToast(msg, type = 'success') {
    let toast = document.getElementById('app-toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'app-toast';
        toast.className = 'toast';
        document.body.appendChild(toast);
    }
    
    const icon = type === 'success' ? 'fa-circle-check' : 'fa-circle-exclamation';
    toast.className = `toast ${type}`;
    toast.innerHTML = `<i class="fa-solid ${icon}"></i> <span>${msg}</span>`;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('systemModal');
    if (event.target == modal) {
        closeSystemModal();
    }
}

// --- PWA Service Worker Registration ---
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').then(registration => {
            console.log('ServiceWorker registration successful with scope: ', registration.scope);
        }).catch(err => {
            console.log('ServiceWorker registration failed: ', err);
        });
    });
}

