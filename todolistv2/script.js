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

function deleteTask(index) {
    tasks.splice(index, 1);
    saveTasks();
    renderTasks();
}

function renderTasks() {
    taskList.innerHTML = '';
    tasks.forEach((task, index) => {
        const li = document.createElement('li');
        li.className = 'task-item';
        if (task.blurred) li.classList.add('blurred');
        
        // Créer le conteneur de texte
        const taskText = document.createElement('span');
        taskText.className = 'task-text';
        taskText.textContent = task.text;
        
        // Créer le bouton de suppression pour desktop
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.innerHTML = '🗑️';
        deleteBtn.onclick = (e) => {
            e.stopPropagation();
            deleteTask(index);
        };

        // Indicateur de suppression pour mobile
        const deleteIndicator = document.createElement('span');
        deleteIndicator.className = 'delete-indicator';
        deleteIndicator.textContent = 'Glisser pour supprimer';

        li.appendChild(taskText);
        li.appendChild(deleteBtn);
        li.appendChild(deleteIndicator);

        // Gestion du clic pour flouter
        li.addEventListener('click', (e) => {
            // Ne pas flouter si on clique sur le bouton de suppression
            if (e.target.className === 'delete-btn') {
                return;
            }
            if (!li.classList.contains('sliding')) {
                task.blurred = !task.blurred;
                li.classList.toggle('blurred');
                saveTasks();
            }
        });

        // Gestion du glissement tactile
        let startX = 0;
        let currentX = 0;
        let isDragging = false;

        li.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            isDragging = false;
        });

        li.addEventListener('touchmove', (e) => {
            currentX = e.touches[0].clientX;
            const diff = startX - currentX;
            isDragging = true;
            
            if (diff > 50) {
                li.classList.add('sliding');
            } else {
                li.classList.remove('sliding');
            }
        });

        li.addEventListener('touchend', () => {
            const diff = startX - currentX;
            if (diff > 100) {
                deleteTask(index);
            } else {
                li.classList.remove('sliding');
                // Si ce n'était pas un glissement significatif et qu'on n'a pas beaucoup déplacé,
                // on considère que c'était un tap pour flouter
                if (!isDragging || diff < 10) {
                    task.blurred = !task.blurred;
                    li.classList.toggle('blurred');
                    saveTasks();
                }
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
