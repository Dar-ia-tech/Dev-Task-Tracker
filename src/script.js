const addBtn = document.querySelectorAll('.add-task-btn');
const modal = document.getElementById('addTaskModal');
const closeBtn = document.getElementById('closeModalBtn');
const cancelBtn = document.getElementById('cancelModalBtn');
const addTaskForm = document.querySelector('.modal-form');
let currentEditingCard = null;

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
    // -------------------------------------------------------------
    // ➕ РЕЖИМ СТВОРЕННЯ НОВОЇ КАРТКИ
    // -------------------------------------------------------------
    const taskId = 'BL-' + Math.floor(100 + Math.random() * 900);

    const card = document.createElement('div');
    card.className = 'task-card';
    card.innerHTML = `
        <div class="card-top">
          <div class="tags-group">
            <span class="tag tag-${tag.toLowerCase()}">${tag}</span>
            <span class="task-id">${taskId}</span>
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
        <h4 class="task-title">${title}</h4>
        <p class="task-desc">${desc}</p>
        <div class="attachment-chip">
          <i class="material-symbols-outlined">attach_file</i>
          <span>auth-flow.fig</span>
        </div>
        <div class="card-footer">
          <span class="priority priority-${priority.toLowerCase()}">${priority} priority</span>
          <span class="due-date">
            <i class="material-symbols-outlined">calendar_today</i> ${dueDate}
          </span>
        </div>
        <div class="card-subfooter">
          <span class="project-tag">
            <span class="dot purple"></span> Website launch
          </span>
          <div class="comments-count">
            <i class="material-symbols-outlined">chat_bubble</i> 3
          </div>
        </div>`;

    if (targetContainer) {
      const addBtnColumn = targetContainer.querySelector('.add-task-btn');
      if (addBtnColumn) {
        targetContainer.insertBefore(card, addBtnColumn);
      } else {
        targetContainer.appendChild(card);
      }
    }
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

    const menu = editBtn.closest('.dropdown-menu');
    if (menu) menu.classList.remove('show');

    const titleEl = card.querySelector('.task-title');
    const descEl = card.querySelector('.task-desc');

    document.getElementById('taskTitle').value = titleEl ? titleEl.textContent.trim() : '';
    document.getElementById('taskDesc').value = descEl ? descEl.textContent.trim() : '';

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
    card.remove();
    return;
  }

  // 5. Клік поза меню — закриваємо відкриті dropdown
  document.querySelectorAll('.dropdown-menu.show').forEach(menu => {
    menu.classList.remove('show');
  });
});