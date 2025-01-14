// Récupération des éléments HTML
const todoList = document.getElementById("list");
const inputTask = document.getElementById("input-task");
const addTaskButton = document.getElementById("add-task");
const clearTaskButton = document.getElementById("clear-tasks");

// Chargement des tâches depuis le localStorage
const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
tasks.forEach((task) => {
  addTaskToDOM(task.text, task.done); // Utilise addTaskToDOM pour restaurer les tâches
});

// Ajout d'une tâche avec le bouton "Ajouter"
addTaskButton.addEventListener("click", () => {
  const taskText = inputTask.value.trim();
  if (taskText) {
    addTaskToDOM(taskText); // Utilise addTaskToDOM pour ajouter une nouvelle tâche
    inputTask.value = "";
    saveTasks(); // Sauvegarde des tâches
  }
});

// Ajout d'une tâche avec la touche "Entrée"
inputTask.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    const taskText = inputTask.value.trim();
    if (taskText) {
      addTaskToDOM(taskText); // Utilise addTaskToDOM pour ajouter une nouvelle tâche
      inputTask.value = "";
      saveTasks(); // Sauvegarde des tâches
    }
  }
});

// Fonction pour ajouter une tâche dans le DOM
function addTaskToDOM(taskText, done = false) {
  const li = document.createElement("li");
  li.textContent = taskText;
  if (done) {
    li.classList.add("done");
    li.classList.add("flou-text");
  }

  // Bouton de suppression
  const deleteBtn = document.createElement("button");
  deleteBtn.innerHTML = "&#128465;"; // Icône de corbeille
  deleteBtn.classList.add("delete-btn");
  deleteBtn.addEventListener("click", () => {
    li.remove();
    saveTasks();
  });

  li.appendChild(deleteBtn);
  todoList.appendChild(li);
}

// Barrer une tâche au clic
todoList.addEventListener("click", (event) => {
  if (event.target.tagName === "LI") {
    event.target.classList.toggle("done");
    // changer la couleur de fond de la tâche si elle est barrée
    if (event.target.classList.contains("done")) {
      event.target.classList.add("flou-text");
    } else {
      event.target.classList.remove("flou-text");
    }
    saveTasks();
  }
});

// Fonction pour sauvegarder les tâches dans le localStorage
function saveTasks() {
  const tasks = Array.from(todoList.children).map((li) => ({
    text: li.firstChild.textContent, // Récupère uniquement le texte de la tâche
    done: li.classList.contains("done"), // Vérifie si la tâche est barrée
  }));
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Suppression de toutes les tâches
clearTaskButton.addEventListener("click", () => {
  todoList.innerHTML = "";
  localStorage.removeItem("tasks");
});
