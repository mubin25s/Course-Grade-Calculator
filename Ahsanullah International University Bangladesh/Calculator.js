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
];

function initializeCalculator() {
    // Add input listeners for real-time calculation and validation
    const inputs = ['quiz1', 'quiz2', 'quiz3', 'mid-term', 'attendance-percent', 'final-exam'];
    inputs.forEach(id => {
        const input = document.getElementById(id);
        if (input) {
            // Real-time validation as user types
            input.addEventListener('input', function() {
                enforceMaxValue(id);
                calculateTotal();
            });
            
            // Additional validation on blur
            input.addEventListener('blur', function() {
                validateInput(id);
            });
        }
    });
    
    // Initial calculation
    calculateTotal();
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
    // Get quiz marks and calculate average
    const quiz1 = parseFloat(document.getElementById('quiz1').value) || 0;
    const quiz2 = parseFloat(document.getElementById('quiz2').value) || 0;
    const quiz3 = parseFloat(document.getElementById('quiz3').value) || 0;
    const quizAverage = (quiz1 + quiz2 + quiz3) / 3;
    
    // Update quiz average display
    document.getElementById('quiz-avg-display').textContent = `Avg: ${quizAverage.toFixed(2)}`;
    
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
    
    // Get final exam marks
    const finalMarks = parseFloat(document.getElementById('final-exam').value) || 0;
    
    // Calculate total (without final for current status)
    const currentTotal = quizAverage + presentationMarks + assignmentMarks + midtermMarks + attendanceMarks;
    const totalWithFinal = currentTotal + finalMarks;
    
    // Update total marks display
    document.getElementById('total-marks').textContent = totalWithFinal.toFixed(2);
    
    // Determine current grade
    const currentGrade = determineGrade(totalWithFinal);
    const gradeStatusElement = document.getElementById('grade-status');
    gradeStatusElement.textContent = `${currentGrade.grade} (${currentGrade.gp})`;
    
    // Apply grade-specific color class
    gradeStatusElement.className = 'status-value ' + getGradeColorClass(currentGrade.grade);
    
    // Calculate what's needed to pass (40 marks minimum) or next grade
    const neededToPass = Math.max(0, 40 - currentTotal);
    let passStatus = '';
    
    if (neededToPass > 40) {
        passStatus = 'Impossible';
    } else if (neededToPass > 0) {
        passStatus = `${neededToPass.toFixed(1)} marks`;
    } else {
        // Already passing - only show closest grade if final exam is empty or 0
        if (finalMarks === 0) {
            // Find the closest higher grade based on current total (without final)
            const closestGrade = findClosestHigherGrade(currentTotal);
            
            if (closestGrade) {
                const marksNeeded = closestGrade.min - currentTotal;
                passStatus = `${marksNeeded.toFixed(1)} to get ${closestGrade.grade}`;
            } else {
                passStatus = 'Already Passing!';
            }
        } else {
            // Final exam has a value, just show "Already Passing!"
            passStatus = 'Already Passing!';
        }
    }
    document.getElementById('needed-pass').textContent = passStatus;
    
    // Update grade targets table
    updateGradeTargets(currentTotal);
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
    // Find the closest higher grade that can be achieved
    // Considering the maximum possible score with final exam (40 marks)
    const maxPossibleMarks = currentMarks + 40; // Assuming final exam can add up to 40 more
    
    for (let threshold of gradeThresholds) {
        if (threshold.min > currentMarks && threshold.min <= maxPossibleMarks) {
            return threshold;
        }
    }
    return null; // Already at the highest achievable grade
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

function updateGradeTargets(currentTotal) {
    const tbody = document.getElementById('grade-targets-body');
    tbody.innerHTML = '';
    
    gradeThresholds.forEach(threshold => {
        const row = document.createElement('tr');
        const neededMarks = threshold.min - currentTotal;
        
        let status = '';
        let statusClass = '';
        
        if (neededMarks <= 0) {
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
