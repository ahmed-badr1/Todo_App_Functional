let todos = [];

// DOM Elements
const addForm = document.getElementById('addForm');
const taskInput = document.getElementById('taskInput');
const todosContainer = document.getElementById('todosContainer');
const totalCount = document.getElementById('totalCount');
const activeCount = document.getElementById('activeCount');
const completedCount = document.getElementById('completedCount');


function addTask(title) {
  const task = {
    id: Date.now(),
    title,
    completed: false,
    createdAt: new Date().toISOString(),
  }

  todos.unshift(task)
  taskInput.value = '';
  renderTasks();
}

function toggleTodo(id) {
  const targetTodo = todos.find(todo => todo.id === id);
  if (!targetTodo) return;

  targetTodo.completed = !targetTodo.completed;
  renderTasks();
}

function deleteTodo(id) {
  todos = todos.filter(todo => todo.id !== id);
  renderTasks();
}


function updateStats() {
  totalCount.textContent = todos.length;
  activeCount.textContent = todos.filter(todo => !todo.completed).length;
  completedCount.textContent = todos.filter(todo => todo.completed).length;
}

// Convert HTML to text format to avoid security vulnerabilities such as XSS
function escapeHTML(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function renderTasks() {
  if (todos.length === 0) {
    todosContainer.innerHTML = `
      <div class="empty-state">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
        </svg>
        <h2>No todos yet!</h2>
        <p>Add your first task to get started.</p>
      </div>
    `;
    updateStats();
    return;
  }

  todosContainer.innerHTML = todos.map((todo) => `
    <div class="todo-item ${todo.completed ? "completed": ""}" data-id="${todo.id}">
      <input class="todo-checkbox" type="checkbox" ${todo.completed ? "checked": ""}>
      <div class="todo-content">
        <p class="todo-title">${todo.title}</p>
        <p class="todo-created-time">Created at: <time datetime="${todo.createdAt.split("T")[0]}">${todo.createdAt.split("T")[0]}</time></p>
      </div>
      <div class="todo-actions">
      <button class="btn btn-delete">Delete</button>
      </div>
    </div>
  `).join('');

  updateStats();
}
renderTasks();


// Event Listeners
addForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const title = taskInput.value.trim();
  if (!title) return;
  addTask(escapeHTML(title))
});

todosContainer.addEventListener("click", (event) => {
  if (event.target.matches('.todo-checkbox')) {
    const targetTodoId = +(event.target.closest('.todo-item')?.dataset.id);
    toggleTodo(targetTodoId);
  }

  if (event.target.matches('.btn-delete')) {
    const targetTodoId = +(event.target.closest('.todo-item')?.dataset.id);
    deleteTodo(targetTodoId);
  }
})