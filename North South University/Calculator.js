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
    { grade: 'A', min: 93, max: 100, gp: 4.00, remark: 'Excellent' },
    { grade: 'A-', min: 90, max: 92, gp: 3.70, remark: 'Very Good' },
    { grade: 'B+', min: 87, max: 89, gp: 3.30, remark: 'Good' },
    { grade: 'B', min: 83, max: 86, gp: 3.00, remark: 'Satisfactory' },
    { grade: 'B-', min: 80, max: 82, gp: 2.70, remark: 'Fair' },
    { grade: 'C+', min: 77, max: 79, gp: 2.30, remark: 'Above Average' },
    { grade: 'C', min: 73, max: 76, gp: 2.00, remark: 'Average' },
    { grade: 'C-', min: 70, max: 72, gp: 1.70, remark: 'Below Average' },
    { grade: 'D+', min: 67, max: 69, gp: 1.30, remark: 'Poor' },
    { grade: 'D', min: 60, max: 66, gp: 1.00, remark: 'Very Poor' },
    { grade: 'F', min: 0, max: 59, gp: 0.00, remark: 'Failure' }
];

let quizCount = 3; // Initial number of quizzes
let midCount = 1; // Initial number of mid terms

function initializeCalculator() {
    // Initial renders
    renderQuizzes();
    renderMids();
    
    // Distribution input listeners
    const weightInputs = ['weight-quiz', 'weight-presentation', 'weight-assignment', 'weight-attendance', 'weight-mid', 'weight-final'];
    weightInputs.forEach(id => {
        const input = document.getElementById(id);
        if (input) {
            input.addEventListener('input', function() {
                enforceMaxWeight(id);
                updateDynamicLabels();
                calculateTotal();
            });
        }
    });

    // Mark input listeners
    const staticInputs = ['attendance-percent', 'final-exam'];
    staticInputs.forEach(id => {
        const input = document.getElementById(id);
        if (input) {
            input.addEventListener('input', () => {
                enforceMarkLimits(id);
                calculateTotal();
            });
            input.addEventListener('blur', () => validateInput(id));
        }
    });
    
    updateDynamicLabels();
    calculateTotal();
}

function selectQuality(type, quality) {
    const weights = getWeights();
    const max = weights[type] || 0;
    let marks = 0;

    // Remove active class from buttons in this section
    const sectionClass = type === 'presentation' ? '.presentation-section' : '.assignment-section';
    document.querySelectorAll(`${sectionClass} .select-btn`).forEach(btn => btn.classList.remove('active'));
    
    // Add active to clicked button
    const btn = event.currentTarget;
    if (btn) btn.classList.add('active');

    if (max === 5) {
        if (quality === 'poor') marks = 3;
        else if (quality === 'good') marks = 4;
        else if (quality === 'excellent') marks = 5;
    } else if (max === 10) {
        if (quality === 'poor') marks = Math.floor(Math.random() * 2) + 5; // 5-6
        else if (quality === 'good') marks = Math.floor(Math.random() * 2) + 7; // 7-8
        else if (quality === 'excellent') marks = Math.floor(Math.random() * 2) + 9; // 9-10
    } else if (max === 15) {
        if (quality === 'poor') marks = Math.floor(Math.random() * 3) + 6; // 6,7,8
        else if (quality === 'good') marks = Math.floor(Math.random() * 3) + 9; // 9,10,11
        else if (quality === 'excellent') marks = Math.floor(Math.random() * 4) + 12; // 12,13,14,15
    } else {
        // Fallback for other values: Scaled marks
        if (quality === 'poor') marks = Math.round(max * 0.6);
        else if (quality === 'good') marks = Math.round(max * 0.8);
        else if (quality === 'excellent') marks = max;
    }

    document.getElementById(`${type}-mark`).value = marks;
    document.getElementById(`${type}-display`).textContent = `Score: ${marks}`;
    calculateTotal();
}

function enforceMarkLimits(id) {
    const input = document.getElementById(id);
    let val = parseFloat(input.value) || 0;
    const weights = getWeights();
    let max = 100;

    if (id.startsWith('quiz')) max = weights.quiz;
    else if (id.startsWith('mid')) max = weights.mid;
    else if (id === 'final-exam') max = weights.final;
    else if (id === 'attendance-percent') max = 100;

    if (val > max) {
        input.value = max;
        showToast(`Max allowed is ${max}`);
    }
    if (val < 0) input.value = 0;
}

function enforceMaxWeight(id) {
    const input = document.getElementById(id);
    let val = parseFloat(input.value) || 0;
    
    // Get weights of other fields
    const weightInputs = ['weight-quiz', 'weight-presentation', 'weight-assignment', 'weight-attendance', 'weight-mid', 'weight-final'];
    let otherSum = 0;
    weightInputs.forEach(compId => {
        if (compId !== id) {
            otherSum += parseFloat(document.getElementById(compId).value) || 0;
        }
    });

    if (val + otherSum > 100) {
        val = 100 - otherSum;
        input.value = val < 0 ? 0 : val;
        showToast("Total distribution cannot exceed 100");
    }

    // Update dependencies
    if (id === 'weight-quiz') {
        document.querySelectorAll('#quiz-inputs-container input').forEach(inp => enforceMarkLimits(inp.id));
    } else if (id === 'weight-mid') {
        document.querySelectorAll('#mid-inputs-container input').forEach(inp => enforceMarkLimits(inp.id));
    }
    
    updateDynamicLabels();
    calculateTotal();
}

function updateQuizPlaceholders() {
    const weights = getWeights();
    document.querySelectorAll('#quiz-inputs-container input').forEach(inp => {
        inp.placeholder = weights.quiz;
    });
}

function updateDynamicLabels() {
    const weights = getWeights();
    const total = Object.values(weights).reduce((a, b) => a + b, 0);
    
    const totalBadge = document.getElementById('total-weight-badge');
    if (totalBadge) {
        totalBadge.textContent = `${total} / 100`;
        totalBadge.style.background = total === 100 ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)';
    }

    // Update section badges
    document.getElementById('quiz-badge').textContent = `Best 2 of Max ${weights.quiz}`;
    document.getElementById('presentation-badge').textContent = `${weights.presentation} Marks`;
    document.getElementById('assignment-badge').textContent = `${weights.assignment} Marks`;
    document.getElementById('mid-badge').textContent = `Best 1 of ${weights.mid}`;
    document.getElementById('attendance-badge').textContent = `${weights.attendance} Marks`;
    document.getElementById('final-badge').textContent = `${weights.final} Marks`;

    // Update instruction text for quality sections
    document.getElementById('pres-instruction').textContent = `Select quality (Max ${weights.presentation})`;
    document.getElementById('assign-instruction').textContent = `Select quality (Max ${weights.assignment})`;

    // Update placeholders
    document.getElementById('final-exam').placeholder = `Max ${weights.final}`;
    updateQuizPlaceholders();
}

function getWeights() {
    return {
        quiz: parseFloat(document.getElementById('weight-quiz').value) || 0,
        presentation: parseFloat(document.getElementById('weight-presentation').value) || 0,
        assignment: parseFloat(document.getElementById('weight-assignment').value) || 0,
        attendance: parseFloat(document.getElementById('weight-attendance').value) || 0,
        mid: parseFloat(document.getElementById('weight-mid').value) || 0,
        final: parseFloat(document.getElementById('weight-final').value) || 0
    };
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
        input.addEventListener('input', () => {
            enforceMarkLimits(input.id);
            calculateTotal();
        });
        container.appendChild(inputGroup);
    }
}

function addQuiz() {
    if (quizCount < 10) { quizCount++; renderQuizzes(); calculateTotal(); }
    else { showToast("Max 10 quizzes allowed"); }
}

function removeQuiz() {
    if (quizCount > 1) { quizCount--; renderQuizzes(); calculateTotal(); }
}

function renderMids() {
    const container = document.getElementById('mid-inputs-container');
    if (!container) return;
    const existingValues = Array.from(container.querySelectorAll('input')).map(input => input.value);
    const weights = getWeights();
    
    container.innerHTML = '';
    for (let i = 1; i <= midCount; i++) {
        const inputGroup = document.createElement('div');
        inputGroup.className = 'input-group';
        inputGroup.innerHTML = `
            <label>Mid ${i}</label>
            <input type="number" id="mid${i}" placeholder="${weights.mid}" min="0" max="${weights.mid}" value="${existingValues[i-1] || ''}">
        `;
        const input = inputGroup.querySelector('input');
        input.addEventListener('input', () => {
            enforceMarkLimits(input.id);
            calculateTotal();
        });
        container.appendChild(inputGroup);
    }
}

function addMid() {
    if (midCount < 5) { midCount++; renderMids(); calculateTotal(); }
    else { showToast("Max 5 mid terms allowed"); }
}

function removeMid() {
    if (midCount > 1) { midCount--; renderMids(); calculateTotal(); }
}

function validateInput(id) {
    const input = document.getElementById(id);
    if (!input) return;
    const val = parseFloat(input.value) || 0;
    if (val < 0) input.value = 0;
}

function calculateTotal() {
    const weights = getWeights();
    const totalWeight = Object.values(weights).reduce((a, b) => a + b, 0);

    // Quiz Calculation: Best 2 average, directly used as score (since inputs are capped by weight)
    const quizInputs = document.querySelectorAll('#quiz-inputs-container input');
    const quizMarks = Array.from(quizInputs).map(i => parseFloat(i.value) || 0).sort((a, b) => b - a);
    const bestQuizzes = quizMarks.slice(0, 2);
    const quizScore = bestQuizzes.length > 0 ? (bestQuizzes.reduce((a, b) => a + b, 0) / bestQuizzes.length) : 0;
    document.getElementById('quiz-avg-display').textContent = `Score: ${quizScore.toFixed(2)} / ${weights.quiz}`;

    // Mid Calculation: Best 1 scaled to weight
    const midInputs = document.querySelectorAll('#mid-inputs-container input');
    const midMarks = Array.from(midInputs).map(i => parseFloat(i.value) || 0);
    const bestMidRaw = midMarks.length > 0 ? Math.max(...midMarks) : 0;
    // Note: bestMidRaw is already capped by weights.mid in enforceMarkLimits
    const midScore = bestMidRaw; 
    document.getElementById('mid-best-display').textContent = `Best: ${bestMidRaw.toFixed(2)} / ${weights.mid}`;

    const presScore = parseFloat(document.getElementById('presentation-mark').value) || 0;
    const assignScore = parseFloat(document.getElementById('assignment-mark').value) || 0;
    
    const attendPercent = parseFloat(document.getElementById('attendance-percent').value) || 0;
    const attendScore = (attendPercent / 100) * weights.attendance;
    document.getElementById('attendance-display').textContent = `Points: ${attendScore.toFixed(2)}`;

    const finalScore = parseFloat(document.getElementById('final-exam').value) || 0;

    const currentTotal = quizScore + presScore + assignScore + midScore + attendScore + finalScore;
    document.getElementById('total-marks').textContent = currentTotal.toFixed(2);

    // Update Grade Status
    const totalAchieved = currentTotal;
    const grade = determineGrade(totalAchieved);
    const statusEl = document.getElementById('grade-status');
    statusEl.textContent = `${grade.grade} (${grade.gp})`;
    statusEl.className = 'status-value ' + getGradeColorClass(grade.grade);

    // Milestone calculation
    const footerLabel = document.querySelector('.needed-score .status-label');
    const neededPassEl = document.getElementById('needed-pass');
    
    // Reset color class by default
    neededPassEl.className = 'status-value';
    
    if (document.getElementById('final-exam').value.trim() !== "") {
        footerLabel.textContent = 'Result Obtained';
        neededPassEl.textContent = grade.remark;
        // Apply grade-specific color
        neededPassEl.classList.add(getGradeColorClass(grade.grade));
    } else {
        footerLabel.textContent = 'Next Milestone';
        const next = findClosestHigherGrade(currentTotal);
        if (next) {
            const needed = next.min - currentTotal;
            if (needed > weights.final) {
                neededPassEl.textContent = `Target ${next.grade} (Unreachable)`;
            } else {
                neededPassEl.textContent = `${needed.toFixed(1)} more for ${next.grade}`;
            }
        } else {
            neededPassEl.textContent = 'A Grade Achieved!';
        }
    }

    if (totalWeight !== 100) {
        document.getElementById('total-marks').style.color = 'var(--danger)';
    } else {
        document.getElementById('total-marks').style.color = 'var(--primary)';
    }

    const marksWithoutFinal = currentTotal - finalScore;
    updateGradeTargets(marksWithoutFinal, currentTotal);
}

function determineGrade(marks) {
    if (marks >= 93) return gradeThresholds[0];  // A
    if (marks >= 90) return gradeThresholds[1];  // A-
    if (marks >= 87) return gradeThresholds[2];  // B+
    if (marks >= 83) return gradeThresholds[3];  // B
    if (marks >= 80) return gradeThresholds[4];  // B-
    if (marks >= 77) return gradeThresholds[5];  // C+
    if (marks >= 73) return gradeThresholds[6];  // C
    if (marks >= 70) return gradeThresholds[7];  // C-
    if (marks >= 67) return gradeThresholds[8];  // D+
    if (marks >= 60) return gradeThresholds[9];  // D
    return gradeThresholds[10]; // F
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
        'A': 'grade-a-plus', // Map to blue/top theme
        'A-': 'grade-a',
        'B+': 'grade-b-plus',
        'B': 'grade-b',
        'B-': 'grade-b-minus',
        'C+': 'grade-c-plus',
        'C': 'grade-c',
        'C-': 'grade-d', // Below average / Poor
        'D+': 'grade-d',
        'D': 'grade-d',
        'F': 'grade-f'
    };
    return gradeMap[grade] || '';
}

function updateGradeTargets(currentTotal, totalWithFinal) {
    const tbody = document.getElementById('grade-targets-body');
    tbody.innerHTML = '';
    const weights = getWeights(); // Get current weights
    
    gradeThresholds.forEach(threshold => {
        const row = document.createElement('tr');
        const neededMarks = threshold.min - currentTotal;
        
        let status = '';
        let statusClass = '';
        
        // Check if grade is already achieved with current total (including final if entered)
        if (totalWithFinal >= threshold.min) {
            status = '✓ Achieved';
            statusClass = 'status-achieved';
        } else if (neededMarks <= weights.final) {
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
