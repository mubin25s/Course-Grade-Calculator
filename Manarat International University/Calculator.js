// Set university name from URL
window.addEventListener('DOMContentLoaded', function() {
    const path = decodeURIComponent(window.location.pathname);
    const normalizedPath = path.replace(/\\/g, '/');
    const pathParts = normalizedPath.split('/').filter(Boolean);
    const universityFolder = pathParts[pathParts.length - 2]; 
    const universityNameDisplay = universityFolder ? universityFolder.replace(/_/g, ' ') : 'University Calculator';
    
    const uniElement = document.getElementById('universityName');
    if (uniElement) {
        uniElement.textContent = universityNameDisplay;
    }
    
    initializeCalculator();
});

// Grade thresholds
const gradeThresholds = [
    { grade: 'A+', min: 80, max: 100, gp: 4.00, remark: 'Outstanding' },
    { grade: 'A', min: 75, max: 79, gp: 3.75, remark: 'Excellent' },
    { grade: 'A-', min: 70, max: 74, gp: 3.50, remark: 'Very Good' },
    { grade: 'B+', min: 65, max: 69, gp: 3.25, remark: 'Good' },
    { grade: 'B', min: 60, max: 64, gp: 3.00, remark: 'Satisfactory' },
    { grade: 'B-', min: 55, max: 59, gp: 2.75, remark: 'Fair' },
    { grade: 'C+', min: 50, max: 54, gp: 2.50, remark: 'Average' },
    { grade: 'C', min: 45, max: 49, gp: 2.25, remark: 'Below Average' },
    { grade: 'D', min: 40, max: 44, gp: 2.00, remark: 'Weak' },
    { grade: 'F', min: 0, max: 39, gp: 0.00, remark: 'Unsatisfactory' }
];

let quizCount = 2; // Starts with 2 quizzes as requested

const weights = {
    quiz: 10,
    attendance: 10,
    mid: 30,
    assignment: 10,
    final: 40
};

function initializeCalculator() {
    renderQuizzes();
    
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

    calculateTotal();
}

function renderQuizzes() {
    const container = document.getElementById('quiz-inputs-container');
    if (!container) return;
    
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
        
        container.appendChild(inputGroup);
    }
}

function addQuiz() {
    if (quizCount < 10) {
        quizCount++;
        renderQuizzes();
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

function enforceMaxValue(id) {
    const input = document.getElementById(id);
    if (!input) return;
    const value = parseFloat(input.value);
    const max = parseFloat(input.max);
    
    if (value > max) {
        input.value = max;
        showToast(`Maximum value is ${max}`);
        input.classList.add('error');
        setTimeout(() => input.classList.remove('error'), 400);
    }
    if (value < 0) input.value = 0;
}

function validateInput(id) {
    const input = document.getElementById(id);
    if (!input) return;
    const value = parseFloat(input.value) || 0;
    const max = parseFloat(input.max);
    if (value > max) input.value = max;
    if (value < 0) input.value = 0;
    calculateTotal();
}

function selectQuality(type, quality) {
    const section = '.assignment-section';
    document.querySelectorAll(`${section} .select-btn`).forEach(btn => {
        btn.classList.remove('active');
    });
    
    event.target.closest('.select-btn').classList.add('active');
    
    let marks = 0;
    if (quality === 'poor') {
        marks = Math.random() < 0.5 ? 5 : 6;
    } else if (quality === 'good') {
        marks = Math.random() < 0.5 ? 7 : 8;
    } else if (quality === 'excellent') {
        marks = Math.random() < 0.5 ? 9 : 10;
    }
    
    document.getElementById('assignment-mark').value = marks;
    document.getElementById('assignment-display').textContent = `Score: ${marks}`;
    
    calculateTotal();
}

function calculateTotal() {
    // Quiz: Best 1 counts (out of 10)
    const quizInputs = document.querySelectorAll('#quiz-inputs-container input');
    const quizMarks = Array.from(quizInputs)
        .map(input => parseFloat(input.value) || 0);
    const bestQuiz = quizMarks.length > 0 ? Math.max(...quizMarks) : 0;
    
    document.getElementById('quiz-avg-display').textContent = `Best: ${bestQuiz.toFixed(2)}`;
    
    const midMarks = parseFloat(document.getElementById('mid-term').value) || 0;
    
    const assignmentMarks = parseFloat(document.getElementById('assignment-mark').value) || 0;
    
    const attendancePercent = parseFloat(document.getElementById('attendance-percent').value) || 0;
    const attendanceMarks = (attendancePercent / 100) * weights.attendance;
    document.getElementById('attendance-display').textContent = `Points: ${attendanceMarks.toFixed(2)}`;
    
    const finalMarksInput = document.getElementById('final-exam');
    const finalMarksValue = finalMarksInput.value;
    const finalMarks = parseFloat(finalMarksValue) || 0;
    const isFinalEntered = finalMarksValue.trim() !== "";
    
    const totalMarks = bestQuiz + midMarks + assignmentMarks + attendanceMarks + finalMarks;
    
    document.getElementById('total-marks').textContent = totalMarks.toFixed(2);
    
    const currentGrade = determineGrade(totalMarks);
    const gradeStatusElement = document.getElementById('grade-status');
    gradeStatusElement.textContent = `${currentGrade.grade} (${currentGrade.gp})`;
    gradeStatusElement.className = 'status-value ' + getGradeColorClass(currentGrade.grade);
    
    const footerLabel = document.querySelector('.needed-score .status-label');
    const neededPassElement = document.getElementById('needed-pass');
    neededPassElement.className = 'status-value';
    
    if (isFinalEntered) {
        footerLabel.textContent = 'Result Obtained';
        neededPassElement.textContent = currentGrade.remark;
        neededPassElement.classList.add(getGradeColorClass(currentGrade.grade));
    } else {
        footerLabel.textContent = 'Next Milestone';
        const nextGrade = findClosestHigherGrade(totalMarks);
        if (nextGrade) {
            const marksNeeded = nextGrade.min - (bestQuiz + midMarks + assignmentMarks + attendanceMarks);
            if (marksNeeded <= weights.final) {
                neededPassElement.textContent = `${marksNeeded.toFixed(1)} in Final for ${nextGrade.grade}`;
            } else {
                neededPassElement.textContent = `${nextGrade.grade} (Unreachable)`;
            }
        } else {
            neededPassElement.textContent = 'A+ Target Achieved!';
        }
    }
    
    updateGradeTargets(bestQuiz + midMarks + assignmentMarks + attendanceMarks);
}

function determineGrade(marks) {
    for (let threshold of gradeThresholds) {
        if (marks >= threshold.min) return threshold;
    }
    return gradeThresholds[gradeThresholds.length - 1];
}

function findClosestHigherGrade(marks) {
    const current = determineGrade(marks);
    const possible = gradeThresholds.filter(t => t.min > current.min);
    return possible.length > 0 ? possible[possible.length - 1] : null;
}

function getGradeColorClass(grade) {
    const map = {
        'A+': 'grade-a-plus', 'A': 'grade-a', 'A-': 'grade-a-minus',
        'B+': 'grade-b-plus', 'B': 'grade-b', 'B-': 'grade-b-minus',
        'C+': 'grade-c-plus', 'C': 'grade-c', 'D': 'grade-d', 'F': 'grade-f'
    };
    return map[grade] || '';
}

function updateGradeTargets(currentBase) {
    const tbody = document.getElementById('grade-targets-body');
    tbody.innerHTML = '';
    
    gradeThresholds.forEach(threshold => {
        const row = document.createElement('tr');
        const needed = threshold.min - currentBase;
        
        let status = '';
        let statusClass = '';
        
        if (needed <= 0) {
            status = '✓ Achieved';
            statusClass = 'status-achieved';
        } else if (needed <= weights.final) {
            status = `${needed.toFixed(1)} marks`;
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
    const existing = document.querySelector('.warning-toast');
    if (existing) existing.remove();
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
