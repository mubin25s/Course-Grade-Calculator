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
    { grade: 'A', min: 75, max: 79, gp: 4.00, remark: 'Superlative' },
    { grade: 'A-', min: 70, max: 74, gp: 3.80, remark: 'Excellent' },
    { grade: 'B+', min: 65, max: 69, gp: 3.30, remark: 'Very Good' },
    { grade: 'B', min: 60, max: 64, gp: 3.00, remark: 'Good' },
    { grade: 'B-', min: 55, max: 59, gp: 2.80, remark: 'Average' },
    { grade: 'C+', min: 50, max: 54, gp: 2.50, remark: 'Below Average' },
    { grade: 'C', min: 45, max: 49, gp: 2.20, remark: 'Passing' },
    { grade: 'D', min: 40, max: 44, gp: 1.50, remark: 'Probationary' },
    { grade: 'F', min: 0, max: 39, gp: 0.00, remark: 'Fail' }
];

let quizCount = 3; // Initial number of quizzes

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
        if (quality === 'poor') marks = 5;
        else if (quality === 'good') marks = 6;
        else if (quality === 'excellent') marks = Math.random() < 0.5 ? 7 : 8; // Random 7 or 8
        
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
    
    // Calculate average of the best 3 (or fewer if total quizzes < 3)
    let limit = quizMarks.length;
    if (window.quizMode === 'best2') limit = 2;
    // For 'all', limit is length (do nothing special, slice(0, length))
    else if (window.quizMode === 'best3') limit = 3;
    
    // Ensure we don't slice more than available if 'all' or default
    if (window.quizMode === 'all') limit = quizMarks.length;

    const bestQuizzes = quizMarks.slice(0, limit);
    
    // Adjust divider for average calculation
    let divider = bestQuizzes.length;
    if (window.quizMode === 'best2') divider = Math.min(bestQuizzes.length, 2);
    else if (window.quizMode === 'best3') divider = Math.min(bestQuizzes.length, 3);
    else if (window.quizMode === 'all') divider = bestQuizzes.length;
    
    if (divider === 0) divider = 1; // Prevent div by zero
    
    
    const quizAverage = bestQuizzes.length > 0 
        ? bestQuizzes.reduce((a, b) => a + b, 0) / divider 
        : 0;
    
    // Update quiz average display
    // Dynamic Max Mark for display
        let maxMark = '10';
        const wInput = document.getElementById('weight-quiz');
        if(wInput) maxMark = wInput.value;
        else {
             // Try badge
             const b = document.getElementById('quiz-badge') || document.querySelector('.card-header .badge');
             if(b) {
                const m = b.textContent.match(/Max (d+)/);
                if(m) maxMark = m[1];
             }
        }
        
        document.getElementById('quiz-avg-display').textContent = `Result (Avg): ${quizAverage.toFixed(2)} / ${maxMark}`;
    
    // Get presentation and assignment marks
    const presentationMarks = parseFloat(document.getElementById('presentation-mark').value) || 0;
    const assignmentMarks = parseFloat(document.getElementById('assignment-mark').value) || 0;
    
    // Get midterm marks
    const midtermMarks = parseFloat(document.getElementById('mid-term').value) || 0;
    
    // Calculate attendance marks (out of 7)
    const attendancePercent = parseFloat(document.getElementById('attendance-percent').value) || 0;
    const attendanceMarks = (attendancePercent / 100) * 7;
    
    // Update attendance display
    document.getElementById('attendance-display').textContent = `Points: ${attendanceMarks.toFixed(2)}`;
    
    // Calculate total marks
    const currentTotal = quizAverage + presentationMarks + assignmentMarks + midtermMarks + attendanceMarks;
    
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

// Quiz Mode Logic
window.quizMode = 'best3'; // Default

function setQuizMode(mode) {
    window.quizMode = mode;
    
    // Update active button state
    document.querySelectorAll('.pill-btn').forEach(btn => {
        btn.classList.remove('active');
        if(btn.id === 'btn-' + mode) btn.classList.add('active');
    });
    
    // Attempt to update badge if it exists
    const badge = document.getElementById('quiz-badge');
    const badgeSpan = document.querySelector('.card-header .badge');
    const targetBadge = badge || badgeSpan;
    
    const weightInput = document.getElementById('weight-quiz');
    let weight = '10'; // Default fallback

    if (weightInput) {
        weight = weightInput.value;
    } else if (targetBadge) {
        // Try to parse from existing text to preserve the specific max marks of the university
        // Example: "Best 3 of Max 10" -> "10"
        const match = targetBadge.textContent.match(/Max (d+)/);
        if (match) {
            weight = match[1];
        }
    }

    if(targetBadge) {
         if (mode === 'all') targetBadge.textContent = `All (Max ${weight})`;
         else if (mode === 'best2') targetBadge.textContent = `Best 2 of Max ${weight}`;
         else targetBadge.textContent = `Best 3 of Max ${weight}`;
    }

    calculateTotal();
}
