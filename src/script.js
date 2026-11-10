const addBtn = document.querySelectorAll('.add-task-btn');
const modal = document.getElementById('addTaskModal');
const closeBtn = document.getElementById('closeModalBtn');
const cancelBtn = document.getElementById('cancelModalBtn');
const addTaskForm = document.querySelector('.modal-form');
let currentEditingCard = null;
let tasks = [];

// --- Відкриття / Закриття модального вікна ---
function openModal() {
  modal.classList.add('active');
}

function closeModal() {
  modal.classList.remove('active');
  currentEditingCard = null;
}

// Слухачі для кнопок додавання нової задачі
addBtn.forEach(btn => {
  btn.addEventListener('click', () => {
    currentEditingCard = null;
    addTaskForm.reset();
    openModal();
  });
});

closeBtn.addEventListener('click', closeModal);
cancelBtn.addEventListener('click', closeModal);

// --- Обробник відправки форми (створення / редагування) ---
addTaskForm.addEventListener('submit', function (e) {
  e.preventDefault();

  // 1. Зчитуємо дані з полів форми
  const title = document.getElementById('taskTitle').value;
  const desc = document.getElementById('taskDesc').value;
  const status = document.getElementById('taskStatus').value;
  const priority = document.getElementById('taskPriority').value;
  const tag = document.getElementById('taskTag').value;
  const dueDate = document.getElementById('taskDueDate').value;

  // Валідація заголовка
  if (title.trim() === '') {
    alert('Будь ласка, введіть назву задачі!');
    return;
  }

  // 💡 Оголошуємо targetContainer НА САМОМУ ПОЧАТКУ (до використання в if/else)
  const targetContainer = document.querySelector(`[data-status="${status}"] .cards-container`) 
    || document.querySelectorAll('.cards-container')[0];

  if (currentEditingCard) {
    // -------------------------------------------------------------
    // ✏️ РЕЖИМ РЕДАГУВАННЯ
    // -------------------------------------------------------------
    const titleEl = currentEditingCard.querySelector('.task-title');
    const descEl = currentEditingCard.querySelector('.task-desc');
    const priorityEl = currentEditingCard.querySelector('.priority');
    const tagEl = currentEditingCard.querySelector('.tag');
    const dueDateEl = currentEditingCard.querySelector('.due-date');
    const taskId = currentEditingCard.getAttribute('data-id');

    const taskIndex = tasks.findIndex(t => t.id === taskId);

    if(taskIndex !== -1){
      tasks[taskIndex].titleEl = titleEl;
      tasks[taskIndex].descEl = descEl;
      tasks[taskIndex].priorityEl = priorityEl;
      tasks[taskIndex].tagEl = tagEl;
      tasks[taskIndex].dueDateEl = dueDateEl || tasks[taskIndex].dueDateEl;
    }

    if (titleEl) titleEl.textContent = title;
    if (descEl) descEl.textContent = desc;

    if (tagEl) {
      tagEl.textContent = tag;
      tagEl.className = `tag tag-${tag.toLowerCase()}`;
    }

    if (priorityEl) {
      priorityEl.textContent = `${priority} priority`;
      priorityEl.className = `priority priority-${priority.toLowerCase()}`;
    }

    if (dueDateEl) {
      dueDateEl.innerHTML = `<i class="material-symbols-outlined">calendar_today</i> ${dueDate}`;
    }

    // Якщо статус змінився — переміщуємо картку у відповідну колонку
    if (targetContainer && currentEditingCard.parentElement !== targetContainer) {
      targetContainer.appendChild(currentEditingCard);
    }

    currentEditingCard = null;
  } else {

    const newTask = {
    id: 'BL-' + Math.floor(Math.random() * 1000),
    title: title,
    desc: desc,
    tag: tag,
    priority: priority,
    dueDate: dueDate, // або з поля дати
    status: status || 'in-plan-cards',
  }

  tasks.push(newTask);
  saveTask();
  loadTasks();
  }
  addTaskForm.reset();
  closeModal();
});

// --- Глобальна делегація подій (Edit / Duplicate / Delete / Dropdown) ---
document.addEventListener('click', function (e) {
  const moreBtn = e.target.closest('.card-more');
  const deleteBtn = e.target.closest('.delete-task-btn');
  const duplicateBtn = e.target.closest('.duplicate-task-btn');
  const editBtn = e.target.closest('.edit-task-btn');

  // 1. Натискання на Edit Task
  if (editBtn) {
    const card = editBtn.closest('.task-card');
    currentEditingCard = card;

    const taskId = card.getAttribute('data-id');
    const task = tasks.find(t => t.id === taskId);

    const menu = editBtn.closest('.dropdown-menu');
    if (menu) menu.classList.remove('show');


    if (task) {
      document.getElementById('taskTitle').value = task.title || '';
      document.getElementById('taskDesc').value = task.desc || '';
      if (document.getElementById('taskStatus')) document.getElementById('taskStatus').value = task.status || 'in-plan';
      if (document.getElementById('taskPriority')) document.getElementById('taskPriority').value = task.priority || 'medium';
      if (document.getElementById('taskTag')) document.getElementById('taskTag').value = task.tag || 'Dev';
      if (document.getElementById('taskDueDate')) document.getElementById('taskDueDate').value = task.dueDate || '';
    }

    openModal();
    return;
  }

  // 2. Натискання на Duplicate
  if (duplicateBtn) {
    const card = duplicateBtn.closest('.task-card');
    const cloneCard = card.cloneNode(true);

    const newId = 'BL-' + Math.floor(100 + Math.random() * 900);
    cloneCard.querySelector('.task-id').textContent = newId;

    const dropdownMenu = cloneCard.querySelector('.dropdown-menu');
    if (dropdownMenu) dropdownMenu.classList.remove('show');

    card.after(cloneCard);
    return;
  }

  // 3. Відкриття / закриття меню картки
  if (moreBtn) {
    const dropdown = moreBtn.closest('.dropdown');
    const menu = dropdown.querySelector('.dropdown-menu');

    document.querySelectorAll('.dropdown-menu.show').forEach(m => {
      if (m !== menu) m.classList.remove('show');
    });

    menu.classList.toggle('show');
    return;
  }

  // 4. Натискання на Delete
  if (deleteBtn) {
    const card = deleteBtn.closest('.task-card');
    const taskId = card.getAttribute('data-id');
  
   tasks = tasks.filter(t => t.id !== taskId);

    saveTask();
    loadTasks();
    return;
  }

  // 5. Клік поза меню — закриваємо відкриті dropdown
  document.querySelectorAll('.dropdown-menu.show').forEach(menu => {
    menu.classList.remove('show');
  });
});

document.addEventListener('dragstart', function(e){
  const card = e.target.closest('.task-card');
  if(card){
    const taskId = card.getAttribute('data-id');
    e.dataTransfer.setData('text/plain', taskId);
    
    e.dataTransfer.effectAllowed = 'move';
    requestAnimationFrame(() => {
      card.classList.add('dragging');
    });
  } 
});

document.addEventListener('dragend', function(e){
  const card =e.target.closest('.task-card');
  if(card){
    card.classList.remove('dragging');
  }else{
    document.querySelectorAll('.task-card.dragging').forEach(c => {
      c.classList.remove('dragging');
    });
  }
});

document.addEventListener('dragover', function(e){
const column = e.target.closest('.kanban-column, .cards-container, [id$="-cards"]');

  if(column){
    e.preventDefault();
  }
});

document.addEventListener('dragenter', function(e){
  const column = e.target.closest('.kanban-column, .cards-container');
  if(column){
    column.classList.add('drag-over');
  }
});

document.addEventListener('dragleave', function(e){
   const column = e.target.closest('.kanban-column, .cards-container');

   if(column && !column.contains(e.relatedTarget)){
    column.classList.remove('drag-over');
   }
})

document.addEventListener('drop', function(e){
 document.querySelectorAll('.drag-over').forEach(col => col.classList.remove('drag-over'));

    const column = e.target.closest('.kanban-column, .cards-container, [id$="-cards"]');

  if(column){
    e.preventDefault();

    const taskId = e.dataTransfer.getData('text/plain');
    console.log(taskId)
    if(!taskId) return;

    const cardsContainer = column.querySelector('.cards-container') || column;
    const containerId = cardsContainer.id || column.id;

    console.log('2. Скинули картку', taskId, 'у:', containerId);
    
    let newStatus = 'in-plan-cards';
    if(containerId.includes('in-progress')){
      newStatus = 'in-progress';
    }else if (containerId.includes('done')) {
      newStatus = 'done';
    } else if (containerId.includes('in-plan')) {
      newStatus = 'in-plan';
    }

    const task = tasks.find(t => t.id === taskId);
    if(task){
      task.status = newStatus;
      saveTask();
      loadTasks();
      console.log('3. Статус успішно змінено на:', newStatus);
    }
  }
});

function saveTask(){
  const taskData = JSON.stringify(tasks);
  localStorage.setItem('tasks', taskData);
}

function createTaskCard(task) {
  return `
    <div class="task-card" draggable="true" data-id="${task.id}">
      <div class="card-top">
        <div class="tags-group">
          <span class="tag tag-${task.tag ? task.tag.toLowerCase() : ''}">${task.tag}</span>
          <span class="task-id">${task.id}</span>
        </div>
        <div class="dropdown">
          <button class="card-more" type="button">
            <i class="material-symbols-outlined">more_horiz</i>
          </button>
          <div class="dropdown-menu">
            <button class="dropdown-item edit-task-btn" type="button">
              <i class="material-symbols-outlined">edit</i> Edit task
            </button>
            <button class="dropdown-item duplicate-task-btn" type="button">
              <i class="material-symbols-outlined">content_copy</i> Duplicate
            </button>
            <div class="dropdown-divider"></div>
            <button class="dropdown-item delete-task-btn" type="button">
              <i class="material-symbols-outlined">delete</i> Delete
            </button>
          </div>
        </div>
      </div>
      <h4 class="task-title">${task.title}</h4>
      <p class="task-desc">${task.desc}</p>
      <div class="attachment-chip">
        <i class="material-symbols-outlined">attach_file</i>
        <span>auth-flow.fig</span>
      </div>
      <div class="card-footer">
        <span class="priority priority-${task.priority ? task.priority.toLowerCase() : ''}">${task.priority} priority</span>
        <span class="due-date">
          <i class="material-symbols-outlined">calendar_today</i> ${task.dueDate}
        </span>
      </div>
      <div class="card-subfooter">
        <span class="project-tag">
          <span class="dot purple"></span> Website launch
        </span>
        <div class="comments-count">
          <i class="material-symbols-outlined">chat_bubble</i> 3
        </div>
      </div>
    </div>
  `;
}

function loadTasks(){
  const savedTasks = localStorage.getItem('tasks');

  if(savedTasks !== null){
    tasks = JSON.parse(savedTasks);
  }else{
   tasks = [];
  }

  const todoColumn = document.getElementById('in-plan-cards');
const inProgressColumn = document.getElementById('in-progress-cards');
const doneColumn = document.getElementById('done-cards');

if(!todoColumn || !inProgressColumn || !doneColumn) return;

  todoColumn.innerHTML = '';
  inProgressColumn.innerHTML = '';
  doneColumn.innerHTML = '';

  tasks.forEach(task => {
    const cardHTML = createTaskCard(task);
    const status = (task.status || 'in-plan').toLowerCase();
    if (status === 'in-plan' || status === 'todo' || status === 'in_plan' || status === 'in-plan-cards') {
      todoColumn.insertAdjacentHTML('beforeend', cardHTML);
    } else if (status === 'in-progress' || status === 'in_progress' || status === 'in-progress-cards') {
      inProgressColumn.insertAdjacentHTML('beforeend', cardHTML);
    } else if (status === 'done' || status === 'done-cards') {
      doneColumn.insertAdjacentHTML('beforeend', cardHTML);
    } else {
      todoColumn.insertAdjacentHTML('beforeend', cardHTML);
    }
  });
}

loadTasks();