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

let quizCount = 4; 
let bestQuizzesToCount = 2; // Default best 2

function initializeCalculator() {
    renderQuizzes();
    
    const staticInputs = ['mid-term', 'missed-classes', 'final-exam'];
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

function selectQuizBest(count) {
    bestQuizzesToCount = count;
    
    // Update active class on pill buttons
    document.querySelectorAll('.pill-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.innerText.includes(count.toString()) || (count === 4 && btn.innerText.includes('All'))) {
            btn.classList.add('active');
        }
    });

    // Update displays
    const quizBadge = document.getElementById('quiz-badge');
    if (quizBadge) {
        if (count === 4 && quizCount === 4) {
            quizBadge.textContent = `All 4 of 4`;
        } else if (count === 4) {
            quizBadge.textContent = `All ${quizCount} of ${quizCount}`;
        } else {
            quizBadge.textContent = `Best ${count} of ${quizCount}`;
        }
    }
    
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
        selectQuizBest(bestQuizzesToCount); // Update labels
        calculateTotal();
    } else {
        showToast("Maximum 10 quizzes allowed");
    }
}

function removeQuiz() {
    if (quizCount > 1) {
        quizCount--;
        renderQuizzes();
        selectQuizBest(bestQuizzesToCount); // Update labels
        calculateTotal();
    } else {
        showToast("At least 1 quiz is required");
    }
}

function enforceMaxValue(inputId) {
    const input = document.getElementById(inputId);
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

function validateInput(inputId) {
    const input = document.getElementById(inputId);
    if (!input) return;
    const value = parseFloat(input.value) || 0;
    const max = parseFloat(input.max);
    
    if (value > max) {
        input.value = max;
        calculateTotal();
    }
    
    if (value < 0) {
        input.value = 0;
        calculateTotal();
    }
}

function selectQuality(type, quality) {
    // Find the closest container to the buttons
    const container = event.target.closest('.selection-grid');
    if (!container) return;
    
    // Clear active from this specific grid
    container.querySelectorAll('.select-btn').forEach(btn => btn.classList.remove('active'));
    
    // Set active
    const clickedBtn = event.target.closest('.select-btn');
    if (clickedBtn) clickedBtn.classList.add('active');
    
    let marks = 0;
    if (type === 'presentation') {
        // 10-mark presentation logic
        if (quality === 'poor') marks = Math.floor(Math.random() * 2) + 5; // 5-6
        else if (quality === 'good') marks = Math.floor(Math.random() * 2) + 7; // 7-8
        else if (quality === 'excellent') marks = Math.floor(Math.random() * 2) + 9; // 9-10
        
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
    const quizInputs = document.querySelectorAll('#quiz-inputs-container input');
    const quizMarks = Array.from(quizInputs)
        .map(input => parseFloat(input.value) || 0)
        .sort((a, b) => b - a); 
    
    // Logic: Average of best N quizzes
    let quizSum = 0;
    // If bestQuizzesToCount is 4, but we have 5 quizzes, 
    // it was intended as "All", so we should handle that.
    // The "All" button sets count to 4 in my current HTML.
    // Let's make it smarter: if 4 is selected but quizCount > 4, 
    // and the button says "All", we should count all.
    
    let effectiveN = bestQuizzesToCount;
    if (bestQuizzesToCount === 4) {
        const allBtn = Array.from(document.querySelectorAll('.pill-btn')).find(b => b.innerText.includes('All'));
        if (allBtn && allBtn.classList.contains('active')) {
            effectiveN = quizCount;
        }
    }

    const countToAverage = Math.min(effectiveN, quizMarks.length);
    for(let i=0; i<countToAverage; i++) {
        quizSum += quizMarks[i];
    }
    
    const quizTotal = countToAverage > 0 ? (quizSum / countToAverage) : 0;
    
    document.getElementById('quiz-avg-display').textContent = `Result (Avg): ${quizTotal.toFixed(2)} / 10`;
    
    const midtermMarks = parseFloat(document.getElementById('mid-term').value) || 0;
    const assignmentMarks = parseFloat(document.getElementById('assignment-mark').value) || 0;
    const presentationMarks = parseFloat(document.getElementById('presentation-mark').value) || 0;

    // Calculate attendance marks (Base 5, deduct 0.25 per missed class)
    const missedClasses = parseFloat(document.getElementById('missed-classes').value) || 0;
    const attendanceMarks = Math.max(0, 5 - (missedClasses * 0.25));
    document.getElementById('attendance-display').textContent = `Points: ${attendanceMarks.toFixed(2)}`;
    
    const finalExamInput = document.getElementById('final-exam');
    const finalMarksString = finalExamInput.value;
    const finalMarks = parseFloat(finalMarksString) || 0;
    const isFinalEntered = finalMarksString.trim() !== "";
    
    const currentTotal = quizTotal + midtermMarks + attendanceMarks + assignmentMarks + presentationMarks;
    const totalWithFinal = currentTotal + finalMarks;
    
    document.getElementById('total-marks').textContent = totalWithFinal.toFixed(2);
    
    const currentGrade = determineGrade(totalWithFinal);
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
        const nextGrade = findClosestHigherGrade(currentTotal);
        
        if (nextGrade) {
            const marksNeeded = nextGrade.min - currentTotal;
            if (marksNeeded <= 40) {
                const displayNeeded = marksNeeded % 1 === 0 ? marksNeeded : marksNeeded.toFixed(1);
                neededPassElement.textContent = `${displayNeeded} in Final for ${nextGrade.grade}`;
            } else {
                neededPassElement.textContent = `Target ${nextGrade.grade} (Unreachable)`;
            }
        } else {
            neededPassElement.textContent = 'A Grade Achieved!';
        }
    }
    
    updateGradeTargets(currentTotal, totalWithFinal);
}

function determineGrade(marks) {
    for (let threshold of gradeThresholds) {
        if (marks >= threshold.min && marks <= threshold.max) {
            return threshold;
        }
    }
    return gradeThresholds[gradeThresholds.length - 1]; 
}

function findClosestHigherGrade(currentMarks) {
    let currentThreshold = determineGrade(currentMarks);
    const possibleGrades = gradeThresholds.filter(t => t.min > currentThreshold.min);
    if (possibleGrades.length === 0) return null;
    return possibleGrades[possibleGrades.length - 1];
}

function getGradeColorClass(grade) {
    const gradeMap = {
        'A': 'grade-a-plus', 'A-': 'grade-a', 'B+': 'grade-b-plus',
        'B': 'grade-b', 'B-': 'grade-b-minus', 'C+': 'grade-c-plus',
        'C': 'grade-c', 'C-': 'grade-d', 'D+': 'grade-d', 'D': 'grade-d', 'F': 'grade-f'
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
