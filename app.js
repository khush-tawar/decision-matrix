// Task data storage
let tasks = [];

// DOM Elements
const taskInput = document.getElementById('taskInput');
const urgencyInput = document.getElementById('urgencyInput');
const importanceInput = document.getElementById('importanceInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const taskList = document.getElementById('taskList');
const clearCompletedBtn = document.getElementById('clearCompletedBtn');

// Quadrant task containers
const q1Tasks = document.getElementById('q1-tasks');
const q2Tasks = document.getElementById('q2-tasks');
const q3Tasks = document.getElementById('q3-tasks');
const q4Tasks = document.getElementById('q4-tasks');

// Enable/disable add button based on task input
taskInput.addEventListener('input', () => {
    addTaskBtn.disabled = taskInput.value.trim() === '';
});

// Add task on button click
addTaskBtn.addEventListener('click', addTask);

// Add task on Enter key
taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && taskInput.value.trim() !== '') {
        addTask();
    }
});

// Clear completed tasks
clearCompletedBtn.addEventListener('click', clearCompletedTasks);

// Add a new task
function addTask() {
    const text = taskInput.value.trim();
    const urgency = parseInt(urgencyInput.value);
    const importance = parseInt(importanceInput.value);

    if (text === '') return;

    const task = {
        id: Date.now(),
        text: text,
        urgency: urgency,
        importance: importance,
        completed: false
    };

    tasks.push(task);
    
    // Clear inputs
    taskInput.value = '';
    urgencyInput.value = 5;
    importanceInput.value = 5;
    addTaskBtn.disabled = true;

    // Re-render
    render();
}

// Calculate priority score
function calculatePriority(task) {
    return (task.importance * 1.5) + task.urgency;
}

// Determine which quadrant a task belongs to
function getQuadrant(task) {
    const isUrgent = task.urgency > 5;
    const isImportant = task.importance > 5;

    if (isUrgent && isImportant) return 1; // Do
    if (!isUrgent && isImportant) return 2; // Decide
    if (isUrgent && !isImportant) return 3; // Delegate
    return 4; // Delete
}

// Toggle task completion
function toggleTask(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
        task.completed = !task.completed;
        render();
    }
}

// Clear completed tasks
function clearCompletedTasks() {
    tasks = tasks.filter(task => !task.completed);
    render();
}

// Main render function
function render() {
    // Sort tasks by priority (descending)
    const sortedTasks = [...tasks].sort((a, b) => {
        return calculatePriority(b) - calculatePriority(a);
    });

    // Clear existing content
    taskList.innerHTML = '';
    q1Tasks.innerHTML = '';
    q2Tasks.innerHTML = '';
    q3Tasks.innerHTML = '';
    q4Tasks.innerHTML = '';

    // Render task list
    sortedTasks.forEach(task => {
        // Create task list item
        const li = document.createElement('li');
        li.className = `task-item ${task.completed ? 'completed' : ''}`;

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'task-checkbox';
        checkbox.checked = task.completed;
        checkbox.addEventListener('change', () => toggleTask(task.id));

        const taskContent = document.createElement('div');
        taskContent.className = 'task-content';

        const taskText = document.createElement('span');
        taskText.className = 'task-text';
        taskText.textContent = task.text;

        const taskScores = document.createElement('div');
        taskScores.className = 'task-scores';

        const urgencyBadge = document.createElement('span');
        urgencyBadge.className = 'score-badge';
        urgencyBadge.textContent = `U: ${task.urgency}`;

        const importanceBadge = document.createElement('span');
        importanceBadge.className = 'score-badge';
        importanceBadge.textContent = `I: ${task.importance}`;

        const priorityBadge = document.createElement('span');
        priorityBadge.className = 'score-badge';
        priorityBadge.textContent = `P: ${calculatePriority(task).toFixed(1)}`;

        taskScores.appendChild(urgencyBadge);
        taskScores.appendChild(importanceBadge);
        taskScores.appendChild(priorityBadge);

        taskContent.appendChild(taskText);
        taskContent.appendChild(taskScores);

        li.appendChild(checkbox);
        li.appendChild(taskContent);

        taskList.appendChild(li);

        // Add to appropriate quadrant
        const quadrant = getQuadrant(task);
        const taskTag = document.createElement('div');
        taskTag.className = 'task-tag';
        taskTag.textContent = task.text;

        switch(quadrant) {
            case 1:
                q1Tasks.appendChild(taskTag);
                break;
            case 2:
                q2Tasks.appendChild(taskTag);
                break;
            case 3:
                q3Tasks.appendChild(taskTag);
                break;
            case 4:
                q4Tasks.appendChild(taskTag);
                break;
        }
    });
}

// Initial render
render();
