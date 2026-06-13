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

let selectedCredit = 3;
let quizCount = 2; // Initial 2 quizzes as requested

function getWeights() {
    if (selectedCredit === 2) {
        return { quiz: 5, attendance: 5, mid: 5, final: 35, total: 50 };
    } else {
        return { quiz: 10, attendance: 10, mid: 10, final: 70, total: 100 };
    }
}

function initializeCalculator() {
    renderQuizzes();
    updateWeightsDisplay();
    
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

function selectCredit(credit) {
    selectedCredit = credit;
    
    // Update active class on buttons
    document.querySelectorAll('.credit-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.innerText.includes(credit.toString())) {
            btn.classList.add('active');
        }
    });
    
    updateWeightsDisplay();
    renderQuizzes(); // Refresh quiz placeholders
    calculateTotal();
}

function updateWeightsDisplay() {
    const weights = getWeights();
    
    document.getElementById('credit-badge').textContent = `${selectedCredit} Credits`;
    document.getElementById('quiz-badge').textContent = `Best 1 of Max ${weights.quiz}`;
    document.getElementById('mid-badge').textContent = `${weights.mid} Marks`;
    document.getElementById('attendance-badge').textContent = `${weights.attendance} Marks`;
    document.getElementById('final-badge').textContent = `${weights.final} Marks`;
    
    // Update placeholders and max attributes
    const midInput = document.getElementById('mid-term');
    midInput.placeholder = `Max ${weights.mid}`;
    midInput.max = weights.mid;
    
    const finalInput = document.getElementById('final-exam');
    finalInput.placeholder = `Max ${weights.final}`;
    finalInput.max = weights.final;
    
    // Refresh current values if they exceed new max
    enforceMaxValue('mid-term');
    enforceMaxValue('final-exam');
}

function renderQuizzes() {
    const container = document.getElementById('quiz-inputs-container');
    if (!container) return;
    
    const existingValues = Array.from(container.querySelectorAll('input')).map(input => input.value);
    const weights = getWeights();
    
    container.innerHTML = '';
    for (let i = 1; i <= quizCount; i++) {
        const inputGroup = document.createElement('div');
        inputGroup.className = 'input-group';
        inputGroup.innerHTML = `
            <label>Quiz ${i}</label>
            <input type="number" id="quiz${i}" placeholder="${weights.quiz}" min="0" max="${weights.quiz}" value="${existingValues[i-1] || ''}">
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

function calculateTotal() {
    const weights = getWeights();
    
    // Quiz: Best 1 counts
    const quizInputs = document.querySelectorAll('#quiz-inputs-container input');
    const quizMarks = Array.from(quizInputs)
        .map(input => parseFloat(input.value) || 0);
    const bestQuiz = quizMarks.length > 0 ? Math.max(...quizMarks) : 0;
    
    document.getElementById('quiz-avg-display').textContent = `Best: ${bestQuiz.toFixed(2)} / ${weights.quiz}`;
    
    const midMarks = parseFloat(document.getElementById('mid-term').value) || 0;
    
    const attendancePercent = parseFloat(document.getElementById('attendance-percent').value) || 0;
    const attendanceMarks = (attendancePercent / 100) * weights.attendance;
    document.getElementById('attendance-display').textContent = `Points: ${attendanceMarks.toFixed(2)}`;
    
    const finalMarksInput = document.getElementById('final-exam');
    const finalMarksValue = finalMarksInput.value;
    const finalMarks = parseFloat(finalMarksValue) || 0;
    const isFinalEntered = finalMarksValue.trim() !== "";
    
    // Raw Total (out of 50 or 100)
    const rawTotal = bestQuiz + midMarks + attendanceMarks + finalMarks;
    
    // Display Total (actual points obtained)
    document.getElementById('total-marks').textContent = rawTotal.toFixed(2) + ` / ${weights.total}`;
    
    // Normalized Grade Calculation (always map to 100)
    const normalizedPercent = (rawTotal / weights.total) * 100;
    
    const currentGrade = determineGrade(normalizedPercent);
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
        const nextGrade = findClosestHigherGrade(normalizedPercent);
        if (nextGrade) {
            // Target marks in the raw scale (out of weights.total)
            const targetRaw = (nextGrade.min / 100) * weights.total;
            const marksNeeded = targetRaw - (bestQuiz + midMarks + attendanceMarks);
            
            if (marksNeeded <= weights.final) {
                neededPassElement.textContent = `${marksNeeded.toFixed(1)} in Final for ${nextGrade.grade}`;
            } else {
                neededPassElement.textContent = `Target ${nextGrade.grade} (Unreachable)`;
            }
        } else {
            neededPassElement.textContent = 'A+ Achieved!';
        }
    }
    
    updateGradeTargets(bestQuiz + midMarks + attendanceMarks, weights);
}

function determineGrade(percent) {
    for (let threshold of gradeThresholds) {
        if (percent >= threshold.min) return threshold;
    }
    return gradeThresholds[gradeThresholds.length - 1];
}

function findClosestHigherGrade(percent) {
    const current = determineGrade(percent);
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

function updateGradeTargets(currentBase, weights) {
    const tbody = document.getElementById('grade-targets-body');
    tbody.innerHTML = '';
    
    gradeThresholds.forEach(threshold => {
        const row = document.createElement('tr');
        const targetRaw = (threshold.min / 100) * weights.total;
        const needed = targetRaw - currentBase;
        
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
            <td>${threshold.min}% (${targetRaw.toFixed(1)})</td>
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
