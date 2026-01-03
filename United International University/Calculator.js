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

// Grade thresholds
const gradeThresholds = [
    { grade: 'A', min: 90, max: 100, gp: 4.00, remark: 'Excellent' },
    { grade: 'A-', min: 86, max: 89, gp: 3.67, remark: 'Very Good' },
    { grade: 'B+', min: 82, max: 85, gp: 3.33, remark: 'Good' },
    { grade: 'B', min: 78, max: 81, gp: 3.00, remark: 'Satisfactory' },
    { grade: 'B-', min: 74, max: 77, gp: 2.67, remark: 'Fair' },
    { grade: 'C+', min: 70, max: 73, gp: 2.33, remark: 'Above Average' },
    { grade: 'C', min: 66, max: 69, gp: 2.00, remark: 'Average' },
    { grade: 'C-', min: 62, max: 65, gp: 1.67, remark: 'Below Average' },
    { grade: 'D+', min: 58, max: 61, gp: 1.33, remark: 'Poor' },
    { grade: 'D', min: 55, max: 57, gp: 1.00, remark: 'Very Poor' },
    { grade: 'F', min: 0, max: 54, gp: 0.00, remark: 'Failure' }
];

let quizCount = 4; // Initial number of quizzes

function initializeCalculator() {
    // Render initial quizzes
    renderQuizzes();
    
    // Add input listeners for other static fields
    const staticInputs = ['mid-term', 'attendance-percent', 'final-exam'];
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
    
    // Initial calculation
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
        calculateTotal();
    } else {
        showToast("Maximum 10 quizzes allowed");
    }
}

function removeQuiz() {
    if (quizCount > 1) {
        quizCount--;
        renderQuizzes();
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
    
    // Add active class to selected button
    event.target.closest('.select-btn').classList.add('active');
    
    // Calculate marks based on quality
    let marks = 0;
    if (type === 'presentation') {
        if (quality === 'poor') marks = Math.floor(Math.random() * (6 - 5 + 1)) + 5; // 5-6
        else if (quality === 'good') marks = Math.floor(Math.random() * (8 - 7 + 1)) + 7; // 7-8
        else if (quality === 'excellent') marks = Math.floor(Math.random() * (10 - 9 + 1)) + 9; // 9-10
        
        document.getElementById('presentation-mark').value = marks;
        document.getElementById('presentation-display').textContent = `Score: ${marks}`;
    } else if (type === 'assignment') {
        if (quality === 'poor') marks = 3;
        else if (quality === 'good') marks = 4;
        else if (quality === 'excellent') marks = 5;
        
        document.getElementById('assignment-mark').value = marks;
        document.getElementById('assignment-display').textContent = `Score: ${marks}`;
    }
    
    calculateTotal();
}

function calculateTotal() {
    // Get all quiz marks from the container
    const quizInputs = document.querySelectorAll('#quiz-inputs-container input');
    const quizMarks = Array.from(quizInputs)
        .map(input => parseFloat(input.value) || 0)
        .sort((a, b) => b - a); // Sort descending
    
    // Logic: Best 2 count, others are averaged. Total Quiz = (Best1 + Best2 + AvgOthers) / 3
    let quizTotal = 0;
    if (quizMarks.length >= 2) {
        const best2 = quizMarks.slice(0, 2);
        const others = quizMarks.slice(2);
        const avgOthers = others.length > 0 ? (others.reduce((a, b) => a + b, 0) / others.length) : 0;
        quizTotal = (best2[0] + best2[1] + avgOthers) / 3;
    } else {
        quizTotal = quizMarks.reduce((a, b) => a + b, 0) / Math.max(quizMarks.length, 1);
    }
    
    // Update quiz average display
    document.getElementById('quiz-avg-display').textContent = `Result: ${quizTotal.toFixed(2)} / 10`;
    
    // Get midterm marks
    const midtermMarks = parseFloat(document.getElementById('mid-term').value) || 0;
    
    // Get assignment marks
    const assignmentMarks = parseFloat(document.getElementById('assignment-mark').value) || 0;

    // Get presentation marks
    const presentationMarks = parseFloat(document.getElementById('presentation-mark').value) || 0;

    // Calculate attendance marks (out of 5)
    const attendancePercent = parseFloat(document.getElementById('attendance-percent').value) || 0;
    const attendanceMarks = (attendancePercent / 100) * 5;
    
    // Update attendance display
    document.getElementById('attendance-display').textContent = `Points: ${attendanceMarks.toFixed(2)}`;
    
    // Calculate total marks (Total 100: Quiz 10, Mid 30, Final 40, Attendance 5, Assignment 5, Presentation 10)
    const currentTotal = quizTotal + midtermMarks + attendanceMarks + assignmentMarks + presentationMarks;
    
    // Check if final exam mark is actually entered
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
        neededPassElement.classList.add(getGradeColorClass(currentGrade.grade));
    } else {
        footerLabel.textContent = 'Next Milestone';
        const nextGrade = findClosestHigherGrade(currentTotal);
        
        if (nextGrade) {
            const marksNeeded = nextGrade.min - currentTotal;
            if (marksNeeded <= 40) {
                const displayNeeded = marksNeeded % 1 === 0 ? marksNeeded : marksNeeded.toFixed(1);
                passStatus = `${displayNeeded} in Final for ${nextGrade.grade}`;
            } else {
                passStatus = `Target ${nextGrade.grade} (Unreachable)`;
            }
        } else {
            passStatus = 'A Grade Achieved!';
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
    // Current grade threshold (the one the user currently has)
    let currentThreshold = determineGrade(currentMarks);
    
    // Find all grades higher than the current one
    // gradeThresholds is ordered from A+ (0) to F (last)
    const possibleGrades = gradeThresholds.filter(t => t.min > currentThreshold.min);
    
    if (possibleGrades.length === 0) return null;
    
    // The immediate next grade is the one with the smallest min that's > currentMarks
    // Since gradeThresholds is A+ to F, the one just before currentThreshold in the list
    // is the immediate next. But filtering and picking the last one is safer.
    return possibleGrades[possibleGrades.length - 1];
}

function getGradeColorClass(grade) {
    const gradeMap = {
        'A': 'grade-a-plus',
        'A-': 'grade-a',
        'B+': 'grade-b-plus',
        'B': 'grade-b',
        'B-': 'grade-b-minus',
        'C+': 'grade-c-plus',
        'C': 'grade-c',
        'C-': 'grade-d',
        'D+': 'grade-d',
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
        
        // Check if grade is already achieved with current total (including final if entered)
        if (totalWithFinal >= threshold.min) {
            status = '✓ Achieved';
            statusClass = 'status-achieved';
        } else if (neededMarks <= 50) {
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
    // Remove existing toast if any
    const existingToast = document.querySelector('.warning-toast');
    if (existingToast) {
        existingToast.remove();
    }
    
    // Create new toast
    const toast = document.createElement('div');
    toast.className = 'warning-toast';
    toast.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i> ${message}`;
    document.body.appendChild(toast);
    
    // Show toast
    setTimeout(() => toast.classList.add('show'), 10);
    
    // Hide and remove toast after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 400);
    }, 3000);
}
