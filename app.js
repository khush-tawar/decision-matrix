// Task data storage
let tasks = [];
let draggedTask = null;

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

// All quadrant elements
const quadrants = document.querySelectorAll('.quadrant');

// Music Player Elements
const playBtn = document.getElementById('playBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const shuffleBtn = document.getElementById('shuffleBtn');
const trackTitle = document.getElementById('trackTitle');
const trackArtist = document.getElementById('trackArtist');
const quoteElement = document.getElementById('motivationalQuote');

// Motivational Quotes
const quotes = [
    "Stop waiting for perfect. Perfect is boring. Start now, improve later.",
    "You can't win the race if you're still sitting in the parking lot.",
    "Excuses are the nails used to build a house of failure.",
    "Dream big. Start small. Act now.",
    "The best time to start was yesterday. The second best time is now.",
    "Your comfort zone is a beautiful place, but nothing grows there.",
    "Don't count the days, make the days count.",
    "Success is the sum of small efforts repeated daily.",
    "The only way to do great work is to do work.",
    "Stop overthinking and start overworking.",
    "Discipline is choosing between what you want now and what you want most.",
    "Winners focus on winning. Losers focus on winners.",
    "The grind includes weekends.",
    "Hustle until your haters ask if you're hiring.",
    "Sacrifice now, shine later.",
    "Work hard in silence, let success make the noise.",
    "Don't stop when you're tired. Stop when you're done.",
    "Your excuses are just the lies you tell yourself."
];

// Motivational Rap Tracks with public audio URLs
const tracks = [
    { title: "Epic Motivational Beat 1", artist: "Focus Music", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" },
    { title: "Hustle Mode", artist: "Motivation Mix", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3" },
    { title: "Boss Energy", artist: "Power Beats", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3" },
    { title: "Grind Time", artist: "Success Sound", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3" },
    { title: "Victory Lap", artist: "Champion Mix", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3" },
    { title: "No Sleep", artist: "Work Hard", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3" },
    { title: "Rise & Grind", artist: "Morning Motivation", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3" },
    { title: "Beast Mode", artist: "Gym Motivation", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3" },
    { title: "Never Stop", artist: "Relentless", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3" },
    { title: "Success Story", artist: "Winning", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3" }
];

let currentTrackIndex = 0;
let isPlaying = false;
let isShuffleOn = false;
let audioPlayer = null;

// Music Player Functions
function updateTrackDisplay() {
    const track = tracks[currentTrackIndex];
    trackTitle.textContent = track.title;
    trackArtist.textContent = track.artist;
    
    // Load the audio
    if (audioPlayer) {
        audioPlayer.src = track.url;
        if (isPlaying) {
            audioPlayer.play().catch(err => console.log('Audio play failed:', err));
        }
    }
}

function togglePlay() {
    if (!audioPlayer) return;
    
    isPlaying = !isPlaying;
    const playIcon = playBtn.querySelector('span');
    playIcon.textContent = isPlaying ? '⏸' : '▶';
    
    if (isPlaying) {
        audioPlayer.play().catch(err => {
            console.log('Audio play failed:', err);
            isPlaying = false;
            playIcon.textContent = '▶';
        });
    } else {
        audioPlayer.pause();
    }
}

function nextTrack() {
    if (isShuffleOn) {
        currentTrackIndex = Math.floor(Math.random() * tracks.length);
    } else {
        currentTrackIndex = (currentTrackIndex + 1) % tracks.length;
    }
    updateTrackDisplay();
}

function prevTrack() {
    currentTrackIndex = (currentTrackIndex - 1 + tracks.length) % tracks.length;
    updateTrackDisplay();
}

function toggleShuffle() {
    isShuffleOn = !isShuffleOn;
    shuffleBtn.style.background = isShuffleOn ? 'rgba(255, 102, 0, 0.3)' : 'rgba(255, 102, 0, 0.1)';
}

function changeQuote() {
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    quoteElement.style.opacity = '0';
    setTimeout(() => {
        quoteElement.textContent = `"${randomQuote}"`;
        quoteElement.style.opacity = '1';
    }, 300);
}

// Music Player Event Listeners
playBtn.addEventListener('click', togglePlay);
nextBtn.addEventListener('click', nextTrack);
prevBtn.addEventListener('click', prevTrack);
shuffleBtn.addEventListener('click', toggleShuffle);

// Initialize music player
document.addEventListener('DOMContentLoaded', () => {
    audioPlayer = document.getElementById('audioPlayer');
    if (audioPlayer) {
        audioPlayer.volume = 0.7;
        
        // Auto-next when track ends
        audioPlayer.addEventListener('ended', () => {
            nextTrack();
        });
        
        // Handle audio errors
        audioPlayer.addEventListener('error', (e) => {
            console.log('Audio error:', e);
            // Try next track on error
            nextTrack();
        });
    }
    updateTrackDisplay();
});

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

// Setup drag and drop for quadrants
quadrants.forEach(quadrant => {
    quadrant.addEventListener('dragover', handleDragOver);
    quadrant.addEventListener('dragleave', handleDragLeave);
    quadrant.addEventListener('drop', handleDrop);
});

// Drag and Drop Handlers
function handleDragOver(e) {
    e.preventDefault();
    e.currentTarget.classList.add('drag-over');
}

function handleDragLeave(e) {
    e.currentTarget.classList.remove('drag-over');
}

function handleDrop(e) {
    e.preventDefault();
    e.currentTarget.classList.remove('drag-over');
    
    const quadrantNum = parseInt(e.currentTarget.dataset.quadrant);
    
    if (draggedTask) {
        // Update task urgency and importance based on quadrant
        updateTaskByQuadrant(draggedTask, quadrantNum);
        draggedTask = null;
        render();
    }
}

function updateTaskByQuadrant(taskId, quadrant) {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    
    switch(quadrant) {
        case 1: // Urgent & Important
            task.urgency = 8;
            task.importance = 8;
            break;
        case 2: // Not Urgent & Important
            task.urgency = 3;
            task.importance = 8;
            break;
        case 3: // Urgent & Not Important
            task.urgency = 8;
            task.importance = 3;
            break;
        case 4: // Not Urgent & Not Important
            task.urgency = 3;
            task.importance = 3;
            break;
    }
}

// Delete task
function deleteTask(taskId) {
    tasks = tasks.filter(t => t.id !== taskId);
    render();
}

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
        const wasCompleted = task.completed;
        task.completed = !task.completed;
        
        // Change quote when task is completed
        if (!wasCompleted && task.completed) {
            changeQuote();
        }
        
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
        li.draggable = true;
        li.dataset.taskId = task.id;

        // Drag events for task list items
        li.addEventListener('dragstart', (e) => {
            draggedTask = task.id;
            e.target.classList.add('dragging');
        });

        li.addEventListener('dragend', (e) => {
            e.target.classList.remove('dragging');
        });

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
        taskTag.draggable = true;
        taskTag.dataset.taskId = task.id;
        
        // Task text
        const taskTagText = document.createElement('span');
        taskTagText.textContent = task.text;
        taskTag.appendChild(taskTagText);

        // Delete button
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'task-delete';
        deleteBtn.innerHTML = '×';
        deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            deleteTask(task.id);
        });
        taskTag.appendChild(deleteBtn);

        // Drag events for task tags
        taskTag.addEventListener('dragstart', (e) => {
            draggedTask = task.id;
            e.target.classList.add('dragging');
        });

        taskTag.addEventListener('dragend', (e) => {
            e.target.classList.remove('dragging');
        });

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
