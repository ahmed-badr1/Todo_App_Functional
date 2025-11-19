let todos = loadTodos();

// DOM Elements
const addForm = document.getElementById('addForm');
const taskInput = document.getElementById('taskInput');
const searchInput = document.getElementById('searchInput');
const todosContainer = document.getElementById('todosContainer');
const totalCount = document.getElementById('totalCount');
const activeCount = document.getElementById('activeCount');
const completedCount = document.getElementById('completedCount');

// Local Storage
function saveTodos() {
  localStorage.setItem('todos', JSON.stringify(todos));
}

function loadTodos() {
  const todos = localStorage.getItem('todos');
  return todos ? JSON.parse(todos) : [];
}

// Main Function For Todos
function addTask(title) {
  const task = {
    id: Date.now(),
    title,
    completed: false,
    createdAt: new Date().toISOString(),
  }

  todos.unshift(task)
  saveTodos();
  taskInput.value = '';
  renderTasks(todos);
}

function toggleTodo(id) {
  const targetTodo = todos.find(todo => todo.id === id);
  if (!targetTodo) return;

  targetTodo.completed = !targetTodo.completed;
  saveTodos();
  renderTasks(todos);
}

function deleteTodo(id) {
  todos = todos.filter(todo => todo.id !== id);
  saveTodos();
  renderTasks(todos);
}

function editTodoTitle(id, newTitle) {
  const targetTodo = todos.find(todo => todo.id === id);
  if (!targetTodo) return;

  targetTodo.title = escapeHTML(newTitle);
  saveTodos();
  renderTasks(todos);
}

function searchTodo(searchQuery) {
  if (!searchQuery) renderTasks(todos);
  const filteredTodo = todos.filter((todo) => todo.title.toLowerCase().includes(searchQuery));
  renderTasks(filteredTodo);
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

function renderTasks(todos) {
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
      <button class="btn btn-edit">Edit</button>
        <button class="btn btn-delete">Delete</button>
      </div>
    </div>
  `).join('');

  updateStats();
}
renderTasks(todos);


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

  if (event.target.matches('.btn-edit')) {
    const targetTodo = event.target.closest('.todo-item');
    const targetTodoId = +targetTodo?.dataset.id;
    const titleElement = targetTodo.querySelector('.todo-title');
    const currentTitle = titleElement.textContent;

    // create input to take new title from user
    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'edit-input';
    input.value = currentTitle;

    // Replace Title with Input
    titleElement.replaceWith(input);
    input.focus();
    input.select();

    function saveEdit() {
      const newTitle = input.value.trim();
      if (newTitle) {
        editTodoTitle(targetTodoId, newTitle);
      } else {
        renderTasks(todos);
      }
    }

    input.addEventListener('blur', saveEdit, {once: true});
    input.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') saveEdit();
      if (event.key === 'Escape') renderTasks(todos);
    })
  }
});

searchInput.addEventListener('input', (event) => {
  const searchQuery = event.target.value.trim();
  searchTodo(searchQuery);
});
