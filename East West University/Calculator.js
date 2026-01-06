// Set university name from URL
window.addEventListener('DOMContentLoaded', function() {
    const path = decodeURIComponent(window.location.pathname);
    const normalizedPath = path.replace(/\\/g, '/');
    const pathParts = normalizedPath.split('/').filter(Boolean);
    const universityFolder = pathParts[pathParts.length - 2]; // Get the folder name (second to last part)
    const universityNameDisplay = universityFolder ? universityFolder.replace(/_/g, ' ') : 'University Calculator';
    
    const uniElement = document.getElementById('universityName');
    if (uniElement) {
        uniElement.textContent = universityNameDisplay;
    }
    
    // Initialize event listeners
    initializeCalculator();
});

// Grade thresholds for East West University
const gradeThresholds = [
    { grade: 'A+', min: 80, max: 100, gp: 4.00, remark: 'Outstanding' },
    { grade: 'A', min: 75, max: 79, gp: 3.75, remark: 'Excellent' },
    { grade: 'A-', min: 70, max: 74, gp: 3.50, remark: 'VeryGood' },
    { grade: 'B+', min: 65, max: 69, gp: 3.25, remark: 'Good' },
    { grade: 'B', min: 60, max: 64, gp: 3.00, remark: 'Satisfactory' },
    { grade: 'B-', min: 55, max: 59, gp: 2.75, remark: 'Fair' },
    { grade: 'C+', min: 50, max: 54, gp: 2.50, remark: 'Average' },
    { grade: 'C', min: 45, max: 49, gp: 2.25, remark: 'BelowAverage' },
    { grade: 'D', min: 40, max: 44, gp: 2.00, remark: 'Weak' },
    { grade: 'F', min: 0, max: 39, gp: 0.00, remark: 'Unsatisfactory' }
];

let quizCount = 3; // Initial number of quizzes (EWU uses average of 3)

function initializeCalculator() {
    // Render initial quizzes
    renderQuizzes();
    
    // Add input listeners for other static fields
    const staticInputs = ['mid-term', 'attendance-marks', 'class-activities', 'final-exam'];
    staticInputs.forEach(id => {
        const input = document.getElementById(id);
        if (input) {
            input.addEventListener('input', function() {
                enforceMaxValue(id);
                calculateTotal();
            });
            input.addEventListener('blur', function() {
                validateInput(id);
            });
        }
    });
    
    // Initial calculation and mode setup
    setQuizMode('best2');
    calculateTotal();
}

function renderQuizzes() {
    const container = document.getElementById('quiz-inputs-container');
    if (!container) return;
    
    // Preserve existing values
    const existingValues = Array.from(container.querySelectorAll('input')).map(input => input.value);
    
    container.innerHTML = '';
    for (let i = 1; i <= quizCount; i++) {
        const inputGroup = document.createElement('div');
        inputGroup.className = 'input-group';
        inputGroup.innerHTML = `
            <label>Quiz ${i}</label>
            <input type="number" id="quiz${i}" placeholder="10" min="0" max="10" value="${existingValues[i-1] || ''}">
        `;
        
        const input = inputGroup.querySelector('input');
        input.addEventListener('input', function() {
            enforceMaxValue(input.id);
            calculateTotal();
        });
        input.addEventListener('blur', function() {
            validateInput(input.id);
        });
        
        container.appendChild(inputGroup);
    }
}

function addQuiz() {
    if (quizCount < 10) {
        quizCount++;
        renderQuizzes();
        updateQuizBadge();
        calculateTotal();
    } else {
        showToast("Maximum 10 quizzes allowed");
    }
}

function removeQuiz() {
    if (quizCount > 1) {
        quizCount--;
        renderQuizzes();
        updateQuizBadge();
        calculateTotal();
    } else {
        showToast("At least 1 quiz is required");
    }
}

function enforceMaxValue(inputId) {
    const input = document.getElementById(inputId);
    const value = parseFloat(input.value);
    const max = parseFloat(input.max);
    
    // If value exceeds max, instantly clamp it
    if (value > max) {
        input.value = max;
        showToast(`Maximum value is ${max}`);
        input.classList.add('error');
        setTimeout(() => input.classList.remove('error'), 400);
    }
    
    // Prevent negative values
    if (value < 0) {
        input.value = 0;
    }
}

function validateInput(inputId) {
    const input = document.getElementById(inputId);
    const value = parseFloat(input.value) || 0;
    const max = parseFloat(input.max);
    
    if (value > max) {
        showToast(`Maximum value for ${inputId.replace('-', ' ')} is ${max}`);
        input.value = max;
        input.classList.add('error');
        setTimeout(() => input.classList.remove('error'), 400);
        calculateTotal();
    }
    
    if (value < 0) {
        input.value = 0;
        calculateTotal();
    }
}

function selectQuality(type, quality) {
    // Remove active class from all buttons in this section
    const section = type === 'presentation' ? '.presentation-section' : '.assignment-section';
    document.querySelectorAll(`${section} .select-btn`).forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Add active class to selected button (using currentTarget to ensure we get the button)
    event.currentTarget.classList.add('active');
    
    // Calculate marks based on quality (Max 10 for EWU)
    // Poor: 5-6, Good: 7-8, Excellent: 9-10
    let marks = 0;
    if (quality === 'poor') {
        marks = Math.floor(Math.random() * 2) + 5; // 5 or 6
    } else if (quality === 'good') {
        marks = Math.floor(Math.random() * 2) + 7; // 7 or 8
    } else if (quality === 'excellent') {
        marks = Math.floor(Math.random() * 2) + 9; // 9 or 10
    }
    
    if (type === 'presentation') {
        document.getElementById('presentation-mark').value = marks;
        document.getElementById('presentation-display').textContent = `Score: ${marks}`;
    } else if (type === 'assignment') {
        document.getElementById('assignment-mark').value = marks;
        document.getElementById('assignment-display').textContent = `Score: ${marks}`;
    }
    
    calculateTotal();
}

function calculateTotal() {
    // Get all quiz marks from the container
    const quizInputs = document.querySelectorAll('#quiz-inputs-container input');
    const quizMarks = Array.from(quizInputs)
        .map(input => parseFloat(input.value) || 0);
    
    // EWU usually takes average of all entered or best 2/3 based on mode
    let divider = quizCount;
    if (window.quizMode === 'best2') divider = 2;
    else if (window.quizMode === 'best3') divider = 3;
    else if (window.quizMode === 'all') divider = quizCount;

    if (divider === 0) divider = 1;

    const quizSum = quizMarks.sort((a, b) => b - a).slice(0, window.quizMode === 'all' ? quizCount : (window.quizMode === 'best2' ? 2 : 3)).reduce((a, b) => a + b, 0);
    const quizAverage = quizSum / divider;
    
    // Update quiz average display
    document.getElementById('quiz-avg-display').textContent = `Avg: ${quizAverage.toFixed(2)}`;
    
    // Get presentation and assignment marks
    const presentationMarks = parseFloat(document.getElementById('presentation-mark').value) || 0;
    const assignmentMarks = parseFloat(document.getElementById('assignment-mark').value) || 0;
    
    // Get midterm marks
    const midtermMarks = parseFloat(document.getElementById('mid-term').value) || 0;
    
    // Get attendance marks
    const attendanceMarks = parseFloat(document.getElementById('attendance-marks').value) || 0;
    
    // Get class activities marks
    const activitiesMarks = parseFloat(document.getElementById('class-activities').value) || 0;
    
    // Calculate total marks excluding final
    const currentTotal = quizAverage + presentationMarks + assignmentMarks + midtermMarks + attendanceMarks + activitiesMarks;
    
    // Check if final exam mark is actually entered (not just 0)
    const finalExamInput = document.getElementById('final-exam');
    const finalMarksString = finalExamInput.value;
    const finalMarks = parseFloat(finalMarksString) || 0;
    const isFinalEntered = finalMarksString.trim() !== "";
    
    const totalWithFinal = currentTotal + finalMarks;
    
    // Update total marks display
    document.getElementById('total-marks').textContent = totalWithFinal.toFixed(2);
    
    // Determine current grade
    const currentGrade = determineGrade(totalWithFinal);
    const gradeStatusElement = document.getElementById('grade-status');
    gradeStatusElement.textContent = `${currentGrade.grade} (${currentGrade.gp})`;
    
    // Apply grade-specific color class
    gradeStatusElement.className = 'status-value ' + getGradeColorClass(currentGrade.grade);
    
    // Calculate what's needed for the NEXT milestone
    let passStatus = '';
    const footerLabel = document.querySelector('.needed-score .status-label');
    const neededPassElement = document.getElementById('needed-pass');
    
    // Reset color class by default
    neededPassElement.className = 'status-value';
    
    if (isFinalEntered) {
        passStatus = currentGrade.remark;
        footerLabel.textContent = 'Result Obtained';
        // Apply grade-specific color
        neededPassElement.classList.add(getGradeColorClass(currentGrade.grade));
    } else {
        footerLabel.textContent = 'Next Milestone';
        const nextGrade = findClosestHigherGrade(currentTotal);
        
        if (nextGrade) {
            const marksNeeded = nextGrade.min - currentTotal;
            const displayNeeded = marksNeeded % 1 === 0 ? marksNeeded : marksNeeded.toFixed(1);
            passStatus = `${displayNeeded} to get ${nextGrade.grade}`;
        } else if (currentGrade.grade === 'A+') {
            passStatus = 'Perfect Grade (A+)';
        } else {
            passStatus = 'A+ Target Achieved!';
        }
    }
    neededPassElement.textContent = passStatus;
    
    // Update grade targets table
    updateGradeTargets(currentTotal, totalWithFinal);
}

function determineGrade(marks) {
    for (let threshold of gradeThresholds) {
        if (marks >= threshold.min && marks <= threshold.max) {
            return threshold;
        }
    }
    return gradeThresholds[gradeThresholds.length - 1]; // Return F if nothing matches
}

function findClosestHigherGrade(currentMarks) {
    let currentThreshold = determineGrade(currentMarks);
    const possibleGrades = gradeThresholds.filter(t => t.min > currentThreshold.min);
    if (possibleGrades.length === 0) return null;
    return possibleGrades[possibleGrades.length - 1];
}

function getGradeColorClass(grade) {
    const gradeMap = {
        'A+': 'grade-a-plus',
        'A': 'grade-a',
        'A-': 'grade-a-minus',
        'B+': 'grade-b-plus',
        'B': 'grade-b',
        'B-': 'grade-b-minus',
        'C+': 'grade-c-plus',
        'C': 'grade-c',
        'D': 'grade-d',
        'F': 'grade-f'
    };
    return gradeMap[grade] || '';
}

function updateGradeTargets(currentTotal, totalWithFinal) {
    const tbody = document.getElementById('grade-targets-body');
    tbody.innerHTML = '';
    
    gradeThresholds.forEach(threshold => {
        const row = document.createElement('tr');
        const neededMarks = threshold.min - currentTotal;
        
        let status = '';
        let statusClass = '';
        
        if (totalWithFinal >= threshold.min) {
            status = '✓ Achieved';
            statusClass = 'status-achieved';
        } else if (neededMarks <= 35) {
            status = `${neededMarks.toFixed(1)} marks`;
            statusClass = 'status-possible';
        } else {
            status = 'Not Possible';
            statusClass = 'status-impossible';
        }
        
        row.innerHTML = `
            <td class="${getGradeColorClass(threshold.grade)}">${threshold.grade}</td>
            <td>${threshold.min} - ${threshold.max}</td>
            <td class="${statusClass}">${status}</td>
        `;
        
        tbody.appendChild(row);
    });
}

function showToast(message) {
    const existingToast = document.querySelector('.warning-toast');
    if (existingToast) existingToast.remove();
    
    const toast = document.createElement('div');
    toast.className = 'warning-toast';
    toast.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i> ${message}`;
    document.body.appendChild(toast);
    
    setTimeout(() => toast.classList.add('show'), 10);
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 400);
    }, 3000);
}

// Initial mode setup
window.quizMode = 'all';

function updateQuizBadge() {
    const badge = document.querySelector('.quiz-section .badge');
    if (!badge) return;
    
    const mode = window.quizMode || 'all';
    if (mode === 'all') badge.textContent = `Average of All (${quizCount})`;
    else if (mode === 'best2') badge.textContent = `Best 2 of ${quizCount}`;
    else if (mode === 'best3') badge.textContent = `Best 3 of ${quizCount}`;
}

function setQuizMode(mode) {
    window.quizMode = mode;
    document.querySelectorAll('.pill-btn').forEach(btn => {
        btn.classList.remove('active');
        if(btn.id === 'btn-' + mode) btn.classList.add('active');
    });
    
    updateQuizBadge();
    calculateTotal();
}
