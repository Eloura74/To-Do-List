let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
const taskList = document.getElementById('taskList');
const taskInput = document.getElementById('taskInput');

function addTask() {
    const taskText = taskInput.value.trim();
    if (taskText) {
        tasks.push({
            text: taskText,
            blurred: false
        });
        saveTasks();
        renderTasks();
        taskInput.value = '';
    }
}

function renderTasks() {
    taskList.innerHTML = '';
    tasks.forEach((task, index) => {
        const li = document.createElement('li');
        li.className = 'task-item';
        if (task.blurred) li.classList.add('blurred');
        
        li.innerHTML = `
            ${task.text}
            <span class="delete-indicator">Glisser pour supprimer</span>
        `;

        // Gestion du clic pour flouter
        li.addEventListener('click', (e) => {
            if (!li.classList.contains('sliding')) {
                task.blurred = !task.blurred;
                li.classList.toggle('blurred');
                saveTasks();
            }
        });

        // Gestion du glissement tactile
        let startX = 0;
        let currentX = 0;

        li.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
        });

        li.addEventListener('touchmove', (e) => {
            currentX = e.touches[0].clientX;
            const diff = startX - currentX;
            
            if (diff > 50) {
                li.classList.add('sliding');
            } else {
                li.classList.remove('sliding');
            }
        });

        li.addEventListener('touchend', () => {
            const diff = startX - currentX;
            if (diff > 100) {
                // Supprimer la tâche
                tasks.splice(index, 1);
                saveTasks();
                renderTasks();
            } else {
                li.classList.remove('sliding');
            }
        });

        taskList.appendChild(li);
    });
}

function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Écouter la touche Entrée dans l'input
taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addTask();
    }
});

// Charger les tâches au démarrage
renderTasks();
