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

let quizCount = 3; // Initial number of quizzes

function initializeCalculator() {
    // Add input listeners for all fields
    const inputs = ['quiz1', 'quiz2', 'mid-term', 'attendance-percent', 'final-exam'];
    inputs.forEach(id => {
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

// Remove dynamic quiz functions (renderQuizzes, addQuiz, removeQuiz)
// ... keeping other utility functions ...

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
        if (quality === 'poor') marks = 3;
        else if (quality === 'good') marks = 4;
        else if (quality === 'excellent') marks = 5;
        
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
    // Get both quiz marks
    const quiz1 = parseFloat(document.getElementById('quiz1').value) || 0;
    const quiz2 = parseFloat(document.getElementById('quiz2').value) || 0;
    const quizSum = quiz1 + quiz2;
    
    // Update quiz sum display
    document.getElementById('quiz-avg-display').textContent = `Total: ${quizSum.toFixed(2)}`;
    
    // Get presentation and assignment marks
    const presentationMarks = parseFloat(document.getElementById('presentation-mark').value) || 0;
    const assignmentMarks = parseFloat(document.getElementById('assignment-mark').value) || 0;
    
    // Get midterm marks
    const midtermMarks = parseFloat(document.getElementById('mid-term').value) || 0;
    
    // Calculate attendance marks (out of 5)
    const attendancePercent = parseFloat(document.getElementById('attendance-percent').value) || 0;
    const attendanceMarks = (attendancePercent / 100) * 5;
    
    // Update attendance display
    document.getElementById('attendance-display').textContent = `Points: ${attendanceMarks.toFixed(2)}`;
    
    // Calculate total marks
    const currentTotal = quizSum + presentationMarks + assignmentMarks + midtermMarks + attendanceMarks;
    
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
            // Use Math.ceil or keep precision based on preference, but following "4 to get C" style
            const displayNeeded = marksNeeded % 1 === 0 ? marksNeeded : marksNeeded.toFixed(1);
            passStatus = `${displayNeeded} to get ${nextGrade.grade}`;
        } else {
            // Check if already at A+
            if (currentGrade.grade === 'A+') {
                passStatus = 'Perfect Grade (A+)';
            } else {
                passStatus = 'A+ Target Achieved!';
            }
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
        
        // Check if grade is already achieved with current total (including final if entered)
        if (totalWithFinal >= threshold.min) {
            status = '✓ Achieved';
            statusClass = 'status-achieved';
        } else if (neededMarks <= 40) {
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
