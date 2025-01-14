let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
const taskList = document.getElementById("taskList");
const taskInput = document.getElementById("taskInput");

function addTask() {
  const taskText = taskInput.value.trim();
  if (taskText) {
    tasks.push({
      text: taskText,
      blurred: false,
    });
    saveTasks();
    renderTasks();
    taskInput.value = "";
  }
}

function deleteTask(index) {
  tasks.splice(index, 1);
  saveTasks();
  renderTasks();
}

function renderTasks() {
  taskList.innerHTML = "";
  tasks.forEach((task, index) => {
    const li = document.createElement("li");
    li.className = "task-item";
    if (task.blurred) li.classList.add("blurred");

    const taskText = document.createElement("span");
    taskText.className = "task-text";
    taskText.textContent = task.text;

    // Bouton de suppression pour desktop
    const deleteBtn = document.createElement("button");
    deleteBtn.className = "delete-btn";
    deleteBtn.innerHTML = "🗑️";
    deleteBtn.onclick = (e) => {
      e.stopPropagation();
      deleteTask(index);
    };

    li.appendChild(taskText);
    li.appendChild(deleteBtn);

    // Gestion tactile pour glissement
    let startX = 0;
    let diff = 0;

    li.addEventListener("touchstart", (e) => {
      startX = e.touches[0].clientX;
      li.style.transition = "none"; // Désactive les transitions pendant le glissement
    });

    li.addEventListener("touchmove", (e) => {
      const currentX = e.touches[0].clientX;
      diff = currentX - startX;

      if (diff < 0) {
        li.style.transform = `translateX(${diff}px)`;
        li.style.backgroundColor = `rgba(255, 0, 0, ${Math.min(
          Math.abs(diff) / 100,
          1
        )})`; // Change la couleur pour indiquer une suppression
      }
    });

    li.addEventListener("touchend", () => {
      if (diff < -80) {
        deleteTask(index); // Supprime la tâche si le glissement dépasse 80px
      } else {
        li.style.transform = "translateX(0)"; // Remet la tâche à sa position initiale
        li.style.backgroundColor = ""; // Réinitialise la couleur
        li.style.transition = "transform 0.3s ease"; // Réactive la transition
      }
    });

    // Gestion du tap pour flouter
    li.addEventListener("click", () => {
      if (Math.abs(diff) < 10) {
        task.blurred = !task.blurred;
        li.classList.toggle("blurred");
        saveTasks();
      }
    });

    taskList.appendChild(li);
  });
}

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Écouter la touche Entrée dans l'input
taskInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    addTask();
  }
});

// Charger les tâches au démarrage
renderTasks();
