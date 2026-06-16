import { useState, useCallback } from 'react';
import { systemsData, selectionLogic } from '../data/gradingSystems';

const formatNum = (num) => parseFloat(Number(num).toFixed(2));

const defaultConfig = {
  distribution: { quiz: 15, presentation: 8, assignment: 5, attendance: 7, mid: 25, final: 40 },
  quizSettings: { total: 3, count: 3, method: 'avg' },
};

export function useCalculator() {
  const [config] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('calculatorConfig')) || defaultConfig;
    } catch {
      return defaultConfig;
    }
  });

  const [gradeThresholds, setGradeThresholds] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('activeSystem')) || systemsData[1];
    } catch {
      return systemsData[1];
    }
  });

  const [quizValues, setQuizValues] = useState(() =>
    Array(config.quizSettings.total).fill('')
  );
  const [selections, setSelections] = useState({
    presentation: { level: null, value: 0 },
    assignment: { level: null, value: 0 },
  });
  const [attendancePercent, setAttendancePercent] = useState('');
  const [midMarks, setMidMarks] = useState('');
  const [finalMarks, setFinalMarks] = useState('');

  const determineGrade = useCallback((marks) => {
    for (const t of gradeThresholds) {
      if (marks >= t.min) return t;
    }
    return gradeThresholds[gradeThresholds.length - 1];
  }, [gradeThresholds]);

  const getGradeColorClass = (grade) => {
    const map = {
      'A+': 'grade-a-plus', 'A': 'grade-a', 'A-': 'grade-a-minus',
      'B+': 'grade-b-plus', 'B': 'grade-b', 'B-': 'grade-b-minus',
      'C+': 'grade-c-plus', 'C': 'grade-c', 'C-': 'grade-c',
      'D+': 'grade-d', 'D': 'grade-d', 'F': 'grade-f',
    };
    return map[grade] || '';
  };

  // Computed values
  const quizNums = quizValues.map(v => parseFloat(v) || 0).sort((a, b) => b - a);
  const bestQuizzes = quizNums.slice(0, config.quizSettings.count);
  let quizScore = 0;
  if (config.quizSettings.method === 'avg') {
    quizScore = bestQuizzes.length > 0
      ? bestQuizzes.reduce((a, b) => a + b, 0) / config.quizSettings.count
      : 0;
  } else {
    quizScore = bestQuizzes.reduce((a, b) => a + b, 0);
  }
  quizScore = Math.min(quizScore, config.distribution.quiz);

  const presMarks = selections.presentation.value;
  const assignMarks = selections.assignment.value;
  const midVal = parseFloat(midMarks) || 0;
  const finalVal = parseFloat(finalMarks) || 0;
  const attendPct = parseFloat(attendancePercent) || 0;
  const attendMarks = (attendPct / 100) * config.distribution.attendance;

  const total = formatNum(quizScore + presMarks + assignMarks + midVal + attendMarks + finalVal);
  const currentGrade = determineGrade(total);
  const isFinalEntered = finalMarks !== '';

  const getMilestone = () => {
    if (isFinalEntered) return { text: `Archived ${currentGrade.grade}`, cls: getGradeColorClass(currentGrade.grade) };
    if (total >= 80) return { text: 'Perfect! A+ Achieved', cls: 'grade-a-plus' };
    const next = [...gradeThresholds].reverse().find(t => t.min > total);
    if (next) return { text: `${formatNum(next.min - total)} more for ${next.grade}`, cls: getGradeColorClass(next.grade) };
    return { text: 'Max Grade Reached', cls: '' };
  };

  const getGradeTargets = () => {
    return gradeThresholds.map(threshold => {
      const needed = threshold.min - total;
      let statusText, sClass;
      if (needed <= 0) {
        sClass = 'status-achieved'; statusText = '✓ Achieved';
      } else if (isFinalEntered || needed > config.distribution.final) {
        sClass = 'status-impossible'; statusText = 'Not Achieved';
      } else {
        sClass = 'status-possible'; statusText = `${formatNum(needed)} marks`;
      }
      return { ...threshold, statusText, sClass };
    });
  };

  const setSelection = (type, level) => {
    const max = config.distribution[type];
    const logic = selectionLogic[max] || { poor: [Math.floor(max * 0.5)], good: [Math.floor(max * 0.7)], excellent: [max] };
    const possibleValues = logic[level];
    const pickedValue = possibleValues[Math.floor(Math.random() * possibleValues.length)];
    setSelections(prev => ({ ...prev, [type]: { level, value: pickedValue } }));
  };

  const applySystem = (id) => {
    const sys = systemsData[id];
    setGradeThresholds(sys);
    localStorage.setItem('activeSystem', JSON.stringify(sys));
  };

  return {
    config,
    quizValues, setQuizValues,
    selections, setSelection,
    attendancePercent, setAttendancePercent,
    midMarks, setMidMarks,
    finalMarks, setFinalMarks,
    quizScore, attendMarks,
    total, currentGrade,
    isFinalEntered,
    getMilestone,
    getGradeTargets,
    getGradeColorClass,
    determineGrade,
    applySystem,
    formatNum,
    gradeThresholds,
    systemsData,
  };
}
