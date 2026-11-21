const addBtn = document.querySelectorAll('.add-task-btn');
const modal = document.getElementById('addTaskModal');
const closeBtn = document.getElementById('closeModalBtn');
const cancelBtn = document.getElementById('cancelModalBtn');
const addTaskForm = document.querySelector('.modal-form');
const helpModalBtn = document.getElementById('help-modal');
const openHelpBtn = document.getElementById('open-help-btn');
const closeModalBtn = document.getElementById('close-help-btn');
const settingModal = document.getElementById('settings-modal');
const openSettingBtn = document.getElementById('open-settings-btn');
const closeSettingBtn = document.getElementById('close-settings-btn');
const settingWorkspace = document.getElementById('settings-workspace');
const settingPlantName = document.getElementById('settings-plant-name');
const saveBtn = document.getElementById('save-settings-btn');
const clerBtn = document.getElementById('clear-all-tasks-btn');
const workspaceDispaly = document.getElementById('workspace-name-display');
const plantName = document.getElementById('plant-name');
let currentEditingCard = null;
const searchFilter = document.getElementById('searchInput');
const priorityFilter = document.getElementById('priorityFilter');
const logoutBtn = document.getElementById('logout-btn');
const userGreetingEl = document.getElementById('user-greeting-name');
let tasks = [];

const savedUsername = localStorage.getItem('flora_username');

if (userGreetingEl && savedUsername) {
  userGreetingEl.textContent = savedUsername;
}
const chekItem = localStorage.getItem('flora_auth');
if (chekItem !== 'true') {
  window.location.href = 'login.html';
}

if (logoutBtn) {
  logoutBtn.addEventListener('click', function (e) {
    e.preventDefault();
    localStorage.removeItem('flora_auth');
    window.location.href = 'login.html';
  });
}

function openModal() {
  if (modal) modal.classList.add('active');
}

function closeModal() {
  if (modal) modal.classList.remove('active');
  currentEditingCard = null;
}

const currentFilters = {
  tab: 'all',
  priority: 'all',
  search: ''
};

const searchInput = document.getElementById('searchInput');
const priorityBtn = document.getElementById('priorityFilter');

if (searchInput) {
  searchInput.addEventListener('input', function (e) {
    currentFilters.search = e.target.value.trim().toLowerCase();
    loadTasks();
  });
}

if (priorityBtn) {
  priorityBtn.addEventListener('change', function (e) {
    currentFilters.priority = e.target.value;
    loadTasks();
  });
}

addBtn.forEach(btn => {
  btn.addEventListener('click', () => {
    currentEditingCard = null;
    if (addTaskForm) addTaskForm.reset();
    openModal();
  });
});

if (closeBtn) closeBtn.addEventListener('click', closeModal);
if (cancelBtn) cancelBtn.addEventListener('click', closeModal);

if (addTaskForm) {
  addTaskForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const title = document.getElementById('taskTitle').value;
    const desc = document.getElementById('taskDesc') ? document.getElementById('taskDesc').value : '';
    const status = document.getElementById('taskStatus') ? document.getElementById('taskStatus').value : 'in-plan';
    const priority = document.getElementById('taskPriority') ? document.getElementById('taskPriority').value : 'medium';
    const tag = document.getElementById('taskTag') ? document.getElementById('taskTag').value : 'Dev';
    const dueDate = document.getElementById('taskDueDate') ? document.getElementById('taskDueDate').value : '';

    if (title.trim() === '') {
      alert('Будь ласка, введіть назву задачі!');
      return;
    }

    if (currentEditingCard) {
      const taskId = currentEditingCard.getAttribute('data-id');
      const existingTask = tasks.find(t => String(t.id) === String(taskId));

      if (existingTask) {
        existingTask.title = title;
        existingTask.desc = desc;
        existingTask.status = status;
        existingTask.priority = priority;
        existingTask.tag = tag;
        existingTask.dueDate = dueDate;
      }
      currentEditingCard = null;
    } else {
      const newTask = {
        id: 'BL-' + Math.floor(100 + Math.random() * 900),
        title: title,
        desc: desc,
        tag: tag,
        priority: priority,
        dueDate: dueDate,
        status: status || 'in-plan'
      };
      tasks.push(newTask);
    }

    saveTask();
    loadTasks();
    addTaskForm.reset();
    closeModal();
  });
}

if (openHelpBtn) {
  openHelpBtn.addEventListener('click', function (e) {
    e.preventDefault();
    helpModalBtn.classList.add('active');
  });
}

if (closeModalBtn) {
  closeModalBtn.addEventListener('click', function (e) {
    e.preventDefault();
    helpModalBtn.classList.remove('active');
  });
}

if (openSettingBtn) {
  openSettingBtn.addEventListener('click', function (e) {
    e.preventDefault();
    settingWorkspace.value = workspaceDispaly.textContent;
    settingPlantName.value = plantName.textContent.replace('Meet ', '');
    settingModal.classList.add('active');
  });
}

if (closeSettingBtn) {
  closeSettingBtn.addEventListener('click', function () {
    settingModal.classList.remove('active');
  });
}

window.addEventListener('click', function (e) {
  if (e.target === helpModalBtn) {
    helpModalBtn.classList.remove('active');
  }
  if (e.target === settingModal) {
    settingModal.classList.remove('active');
  }
  if (e.target === modal) {
    closeModal();
  }
});

if (saveBtn) {
  saveBtn.addEventListener('click', function () {
    const newWorkspace = settingWorkspace.value.trim() || 'Personal workspace';
    const newPlant = settingPlantName.value.trim() || 'Rosie';

    localStorage.setItem('flora_workspace', newWorkspace);
    localStorage.setItem('flora_plant_name', newPlant);

    workspaceDispaly.textContent = newWorkspace;
    plantName.textContent = 'Meet ' + newPlant;

    settingModal.classList.remove('active');
  });
}

if (clerBtn) {
  clerBtn.addEventListener('click', function () {
    if (confirm('Видалити всі задачі?')) {
      tasks = [];
      localStorage.setItem('tasks', JSON.stringify(tasks));
      loadTasks();
      settingModal.classList.remove('active');
    }
  });
}

document.addEventListener('dragstart', function (e) {
  const card = e.target.closest('.task-card');
  if (card) {
    const taskId = card.getAttribute('data-id');
    e.dataTransfer.setData('text/plain', taskId);
    e.dataTransfer.effectAllowed = 'move';
    requestAnimationFrame(() => {
      card.classList.add('dragging');
    });
  }
});

document.addEventListener('dragend', function (e) {
  const card = e.target.closest('.task-card');
  if (card) {
    card.classList.remove('dragging');
  } else {
    document.querySelectorAll('.task-card.dragging').forEach(c => {
      c.classList.remove('dragging');
    });
  }
});

document.addEventListener('dragover', function (e) {
  const column = e.target.closest('.kanban-column, .cards-container, [id$="-cards"]');
  if (column) {
    e.preventDefault();
  }
});

document.addEventListener('dragenter', function (e) {
  const column = e.target.closest('.kanban-column, .cards-container');
  if (column) {
    column.classList.add('drag-over');
  }
});

document.addEventListener('dragleave', function (e) {
  const column = e.target.closest('.kanban-column, .cards-container');
  if (column && !column.contains(e.relatedTarget)) {
    column.classList.remove('drag-over');
  }
});

document.addEventListener('drop', function (e) {
  document.querySelectorAll('.drag-over').forEach(col => col.classList.remove('drag-over'));

  const column = e.target.closest('.kanban-column, .cards-container, [id$="-cards"]');
  if (column) {
    e.preventDefault();

    const taskId = e.dataTransfer.getData('text/plain');
    if (!taskId) return;

    const cardsContainer = column.querySelector('.cards-container') || column;
    const containerId = cardsContainer.id || column.id;

    let newStatus = 'in-plan';
    if (containerId.includes('in-progress')) {
      newStatus = 'in-progress';
    } else if (containerId.includes('done')) {
      newStatus = 'done';
    } else if (containerId.includes('in-plan')) {
      newStatus = 'in-plan';
    }

    const task = tasks.find(t => t.id === taskId);
    if (task) {
      task.status = newStatus;
      saveTask();
      loadTasks();
    }
  }
  updateColumnCounters();
});

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') {
    closeModal();
    if (helpModalBtn) helpModalBtn.classList.remove('active');
    if (settingModal) settingModal.classList.remove('active');
  }

  if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') return;

  if (e.key.toLowerCase() === 'n') {
    e.preventDefault();
    currentEditingCard = null;
    if (addTaskForm) addTaskForm.reset();
    openModal();
  }

  if (e.key === '/') {
    e.preventDefault();
    if (searchFilter) searchFilter.focus();
  }
});

function saveTask() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function createTaskCard(task) {
  const priorityVal = (task.priority || 'medium').toLowerCase();

  let formattedDate = '';
  let overdueClass = '';

  if (task.dueDate) {
    formattedDate = new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(task.dueDate);

    if (due < today && task.status !== 'done') {
      overdueClass = 'overdue';
    }
  }

  return `
    <div class="task-card" draggable="true" data-id="${task.id}">
      <div class="card-top">
        <div class="tags-group">
          <span class="tag tag-${task.tag ? task.tag.toLowerCase() : 'dev'}">${task.tag || 'Dev'}</span>
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

      ${task.desc ? `<p class="task-desc">${task.desc}</p>` : ''}

      <div class="attachment-chip">
        <i class="material-symbols-outlined">attach_file</i>
        <span>auth-flow.fig</span>
      </div>

      <div class="card-footer">
        <span class="priority priority-${priorityVal}">${priorityVal} priority</span>
        
        ${task.dueDate ? `
          <span class="due-date ${overdueClass}">
            <i class="material-symbols-outlined">calendar_today</i> ${formattedDate}
          </span>
        ` : ''}
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

function loadTasks() {
  const savedTasks = localStorage.getItem('tasks');

  if (savedTasks !== null) {
    tasks = JSON.parse(savedTasks);
  } else {
    tasks = [];
  }

  const containers = document.querySelectorAll('.cards-container');
  const todoColumn = document.getElementById('in-plan-cards') || containers[0];
  const inProgressColumn = document.getElementById('in-progress-cards') || containers[1];
  const doneColumn = document.getElementById('done-cards') || containers[2];

  if (!todoColumn || !inProgressColumn || !doneColumn) return;

  const filteredTasks = getFilteredTasks();

  todoColumn.innerHTML = '';
  inProgressColumn.innerHTML = '';
  doneColumn.innerHTML = '';

  filteredTasks.forEach(task => {
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

  updateColumnCounters();
}

function getFilteredTasks() {
  return tasks.filter(task => {
    if (currentFilters.tab === 'dev' || currentFilters.tab === 'study') {
      const taskTag = (task.tag || '').toLowerCase();
      if (taskTag !== currentFilters.tab) {
        return false;
      }
    }

    if (currentFilters.tab === 'today') {
      if (!task.dueDate) {
        return false;
      }

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const due = new Date(task.dueDate);
      due.setHours(0, 0, 0, 0);

      if (due > today || task.status === 'done') {
        return false;
      }
    }

    if (currentFilters.priority !== 'all') {
      const taskPriority = (task.priority || '').toLowerCase();
      if (taskPriority !== currentFilters.priority) {
        return false;
      }
    }

    if (currentFilters.search !== '') {
      const title = (task.title || '').toLowerCase();
      const desc = (task.desc || '').toLowerCase();

      if (!title.includes(currentFilters.search) && !desc.includes(currentFilters.search)) {
        return false;
      }
    }

    return true;
  });
}

function updateColumnCounters() {
  const columnsKanban = document.querySelectorAll('.kanban-column');

  columnsKanban.forEach(column => {
    const columnCount = column.querySelector('.column-count');
    const cards = column.querySelectorAll('.task-card').length;
    if (columnCount) {
      columnCount.textContent = cards;
    }
  });

  const boardStats = document.getElementById('board-stats');
  const filteredTasks = getFilteredTasks();
  const totalTasks = filteredTasks.length;
  const completedTasks = filteredTasks.filter(task => task.status === 'done').length;

  if (boardStats) {
    boardStats.textContent = `${totalTasks} tasks - ${completedTasks} completed`;
  }

  const WEEKLY_GOAL = 5;
  const doneCount = tasks.filter(task => task.status === 'done').length;

  const momentumCompletedEl = document.getElementById('momentum-completed') || document.querySelector('.momentum-card .stat-number');
  const momentumDescEl = document.getElementById('momentum-desc') || document.querySelector('.momentum-desc');

  if (momentumCompletedEl) {
    momentumCompletedEl.textContent = doneCount;
  }

  if (momentumDescEl) {
    const remaining = WEEKLY_GOAL - doneCount;
    if (remaining > 0) {
      momentumDescEl.textContent = `Small steps. Strong roots. You're ${remaining} ${remaining === 1 ? 'task' : 'tasks'} away from your goal.`;
    } else {
      momentumDescEl.textContent = `Amazing job! You've reached your weekly goal of ${WEEKLY_GOAL} completed tasks! 🌸`;
    }
  }

  const totalYearEl = document.getElementById('total-completed-year') || document.querySelector('.total-count');
  if (totalYearEl) {
    totalYearEl.textContent = `${doneCount} ${doneCount === 1 ? 'task' : 'tasks'} completed`;
  }

  updateAnalyticsView();
  updatePlantCompanion();
}

document.addEventListener('click', function (e) {
  const moreBtn = e.target.closest('.card-more');
  const deleteBtn = e.target.closest('.delete-task-btn');
  const duplicateBtn = e.target.closest('.duplicate-task-btn');
  const editBtn = e.target.closest('.edit-task-btn');
  const filterBtn = e.target.closest('.filter-chip');

  if (filterBtn) {
    document.querySelectorAll('.filter-chip').forEach(btn => btn.classList.remove('active'));
    filterBtn.classList.add('active');
    currentFilters.tab = filterBtn.dataset.filter;
    loadTasks();
    return;
  }

  if (editBtn) {
    const card = editBtn.closest('.task-card');
    currentEditingCard = card;

    const taskId = card.getAttribute('data-id');
    const task = tasks.find(t => String(t.id) === String(taskId));

    const menu = editBtn.closest('.dropdown-menu');
    if (menu) menu.classList.remove('show');

    if (task) {
      document.getElementById('taskTitle').value = task.title || '';
      if (document.getElementById('taskDesc')) document.getElementById('taskDesc').value = task.desc || '';
      if (document.getElementById('taskStatus')) document.getElementById('taskStatus').value = task.status || 'in-plan';
      if (document.getElementById('taskPriority')) document.getElementById('taskPriority').value = task.priority || 'medium';
      if (document.getElementById('taskTag')) document.getElementById('taskTag').value = task.tag || 'Dev';
      if (document.getElementById('taskDueDate')) document.getElementById('taskDueDate').value = task.dueDate || '';
    }

    openModal();
    return;
  }

  if (duplicateBtn) {
    const card = duplicateBtn.closest('.task-card');
    const taskId = card.getAttribute('data-id');
    const originalTask = tasks.find(t => String(t.id) === String(taskId));

    if (originalTask) {
      const clonedTask = {
        ...originalTask,
        id: 'BL-' + Math.floor(100 + Math.random() * 900)
      };
      tasks.push(clonedTask);
      saveTask();
      loadTasks();
    }
    return;
  }

  if (moreBtn) {
    const dropdown = moreBtn.closest('.dropdown');
    const menu = dropdown.querySelector('.dropdown-menu');

    document.querySelectorAll('.dropdown-menu.show').forEach(m => {
      if (m !== menu) m.classList.remove('show');
    });

    menu.classList.toggle('show');
    return;
  }

  if (deleteBtn) {
    const card = deleteBtn.closest('.task-card');
    const taskId = card.getAttribute('data-id');

    tasks = tasks.filter(t => String(t.id) !== String(taskId));
    saveTask();
    loadTasks();
    return;
  }

  document.querySelectorAll('.dropdown-menu.show').forEach(menu => {
    menu.classList.remove('show');
  });
});

function updateAnalyticsView() {
  const total = tasks.length;
  const plan = tasks.filter(t => t.status === 'in-plan' || t.status === 'todo').length;
  const progress = tasks.filter(t => t.status === 'in-progress').length;
  const done = tasks.filter(t => t.status === 'done').length;

  const dev = tasks.filter(t => (t.tag || t.category || '').toLowerCase() === 'dev').length;
  const study = tasks.filter(t => (t.tag || t.category || '').toLowerCase() === 'study').length;
  const high = tasks.filter(t => (t.priority || '').toLowerCase() === 'high').length;

  const pct = (count) => (total > 0 ? Math.round((count / total) * 100) : 0);

  const rateEl = document.getElementById('analytics-completion-rate');
  if (rateEl) rateEl.textContent = `${pct(done)}% overall completion (${done} of ${total} tasks)`;

  const setMetric = (textId, barId, count) => {
    const textEl = document.getElementById(textId);
    const barEl = document.getElementById(barId);
    if (textEl) textEl.textContent = `${count} (${pct(count)}%)`;
    if (barEl) barEl.style.width = `${pct(count)}%`;
  };

  setMetric('stat-status-plan', 'bar-status-plan', plan);
  setMetric('stat-status-progress', 'bar-status-progress', progress);
  setMetric('stat-status-done', 'bar-status-done', done);
  setMetric('stat-cat-dev', 'bar-cat-dev', dev);
  setMetric('stat-cat-study', 'bar-cat-study', study);
  setMetric('stat-prio-high', 'bar-prio-high', high);
}

const navItems = document.querySelectorAll('.sidebar-nav li[data-view]');
const boardView = document.getElementById('board-view');
const analyticsView = document.getElementById('analytics-view');

navItems.forEach(item => {
  item.addEventListener('click', (e) => {
    e.preventDefault();
    navItems.forEach(el => el.classList.remove('active'));
    item.classList.add('active');

    const view = item.dataset.view;
    if (view === 'analytics') {
      if (boardView) boardView.classList.add('hidden');
      if (analyticsView) analyticsView.classList.remove('hidden');
      updateAnalyticsView();
    } else {
      if (analyticsView) analyticsView.classList.add('hidden');
      if (boardView) boardView.classList.remove('hidden');
    }
  });
});

function updatePlantCompanion() {
  const doneCount = tasks.filter(t => t.status === 'done').length;

  const TASKS_PER_LEVEL = 3;
  const level = Math.min(4, Math.floor(doneCount / TASKS_PER_LEVEL) + 1);
  const progressInLevel = doneCount >= 12 ? 100 : Math.round(((doneCount % TASKS_PER_LEVEL) / TASKS_PER_LEVEL) * 100);

  const stages = {
    1: { emoji: '🌱', title: 'Level 1 - Seed', desc: 'Just planted! Complete tasks to help Rosie sprout.' },
    2: { emoji: '🌿', title: 'Level 2 - Sprouting', desc: 'Growing strong! Keep up your steady rhythm.' },
    3: { emoji: '🌷', title: 'Level 3 - Budding', desc: 'Almost in full bloom! Your consistency pays off.' },
    4: { emoji: '🌸', title: 'Level 4 - Flourishing', desc: 'In full bloom! Rosie is thriving thanks to you.' }
  };

  const currentStage = stages[level];

  const avatarEl = document.getElementById('plant-avatar') || document.querySelector('.plant-avatar');
  const descEl = document.getElementById('plant-desc') || document.querySelector('.plant-desc');
  const levelEl = document.getElementById('plant-level-label') || document.querySelector('.plant-progress-info span:first-child');
  const percentEl = document.getElementById('plant-percent') || document.querySelector('.plant-progress-info span:last-child');
  const fillEl = document.getElementById('plant-progress-fill') || document.querySelector('.progress-fill');

  if (avatarEl) avatarEl.textContent = currentStage.emoji;
  if (descEl) descEl.textContent = currentStage.desc;
  if (levelEl) levelEl.textContent = currentStage.title;
  if (percentEl) percentEl.textContent = `${progressInLevel}%`;
  if (fillEl) fillEl.style.width = `${progressInLevel}%`;
}

const currentUserName = localStorage.getItem('flora_username') || 'Daria';
document.querySelectorAll('.user-name, .sidebar-header *').forEach(el => {
  if (el.children.length === 0 && el.textContent.trim() === 'Alex Kovalenko') {
    el.textContent = currentUserName;
  }
});

document.querySelectorAll('span, p, div').forEach(el => {
  if (el.children.length === 0 && el.textContent.includes('Oct 14, 2026')) {
    el.textContent = new Date().toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }
});

document.querySelectorAll('button, a').forEach(btn => {
  if (btn.textContent.includes('New task')) {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      currentEditingCard = null;
      if (addTaskForm) addTaskForm.reset();
      openModal();
    });
  }
});

function applySavedSettings() {
  const savedWorkspace = localStorage.getItem('flora_workspace');
  const savedPlant = localStorage.getItem('flora_plant_name');

  if (savedWorkspace && workspaceDispaly) {
    workspaceDispaly.textContent = savedWorkspace;
  }

  if (savedPlant && plantName) {
    plantName.textContent = 'Meet ' + savedPlant;
  }
}

applySavedSettings();
loadTasks();