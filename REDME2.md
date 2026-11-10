# ⚙️ Task Tracker — Покроковий план розробки JavaScript (Node.js & Web UI)

## 📌 Загальний стек та концепція
* **Мова розробки:** JavaScript (ES6+)[cite: 3]
* **Клієнтська частина (Frontend):** Vanilla JS / DOM API[cite: 3, 4]
* **Серверна частина (Backend/Persistence):** Node.js (`fs/promises` для роботи з JSON)[cite: 3, 4]

---

## 🗓️ ЕТАП 1: Клієнтська логіка та веб-інтерфейс (Frontend JS)
*Головна мета:* Оживити створений UI, налаштувати інтерактивність та зв'язати модальне вікно з Kanban-дошкою[cite: 1, 3, 4].

### 1.1. Управління Модальним Вікном (Modal UI)
- [ ] **Відкриття вікна:** Обробка події кліку на кнопки «+» (Add task) у шапці колонок або сайдбарі[cite: 1].
- [ ] **Закриття вікна:** Обробка натискання на хрестик, кнопку «Cancel» або клік за межами вікна (на оверлей)[cite: 2].
- [ ] **Скидання стану:** Очищення полів форми після кожного закриття або успішного створення задачи[cite: 2].

### 1.2. Зчитування та Валідація Форми (Form Handling)
- [ ] **Збір даних:** Зчитування значень із полів (`Task title`, `Description`, `Project`, `Status`, `Priority`, `Due date`, `Tags`)[cite: 2].
- [ ] **Перевірка (Валідація):** Перевірка обов'язкового поля `Task title` (заборона порожніх заголовків)[cite: 3, 4].
- [ ] **Генерація ID:** Створення унікального ідентифікатора задачі (наприклад, `BL-026` або через `crypto.randomUUID()`)[cite: 3, 4].

### 1.3. Динамічний Рендеринг Карток (DOM Manipulation)
- [ ] **Створення картки:** Формування HTML-структури нової картки задачі з урахуванням обраних стилів, тегів та пріоритету[cite: 2].
- [ ] **Маршрутизація в колонки:** Автоматичне додавання картки у відповідну колонку (*In Plan / To Do*, *In Progress*, або *Done*)[cite: 1, 4].
- [ ] **Оновлення лічильників:** Динамічний перерахунок кількості задач у заголовках колонок та загальній шапці[cite: 1].
- [ ] **Розрахунок прогресу:** Автоматичне обчислення відсотка та стилізація прогрес-барів у картках із чеклістами[cite: 1, 2].

### 1.4. Фільтрація та Сортування (UI State)
- [ ] **Фільтри категорій:** Перемикання вкладок (*All tasks*, *Dev*, *Study*) з приховуванням невідповідних карток[cite: 1, 4].
- [ ] **Пошук та сортування:** Сортування задач за пріоритетом або дедлайном[cite: 3, 4].

---

## 🗓️ ЕТАП 2: Персональна фішка (Streak, Plant & Contribution Grid)
*Головна мета:* Реалізувати інтерактивну бізнес-логіку для відстеження щоденного прогресу[cite: 1, 3].

### 2.1. Віртуальна Рослинка (Plant Companion)
- [ ] **Статуси росту:** Зміна стану та іконки рослинки (*Seedling* 🌰 ➔ *Sprout* 🌱 ➔ *Bush* 🌿 ➔ *Flower* 🌸) залежно від виконаних задач[cite: 3].
- [ ] **Сповіщення:** Оновлення тексту статусу (наприклад, *Thrives and grows*)[cite: 3].

### 2.2. Лічильник Серії (Streak Counter 🔥)
- [ ] **Підрахунок днів:** Перевірка, чи була виконана хоча б одна задача за сьогодні[cite: 3].
- [ ] **Оновлення / Скидання:** Збільшення лічильника днів або його скидання у разі пропущеного дня[cite: 3].

### 2.3. Сітка Активності (Contribution Grid)
- [ ] **Автоматична відмітка:** Зафарбовування відповідного квадратика зеленим кольором (#00b894) при переведенні задачі в статус *Done*[cite: 1, 3].

---

## 🗓️ ЕТАП 3: Серверна частина та Збереження (Node.js Backend / Persistence)
*Головна мета:* Забезпечити надійне збереження даних між перезапусками програми[cite: 3, 4].

### 3.1. Модуль Роботи з Файлами (`storageService.js`)
- [ ] **Зчитування:** Завантаження масиву задач із файлу `data/tasks.json` при старті[cite: 4].
- [ ] **Атомарне збереження (Atomic Writes):** Запис даних у тимчасовий файл `tasks.json.tmp` з наступним безпечним перейменуванням у `tasks.json` (захист від збоїв)[cite: 3, 4].

### 3.2. CRUD Сервіс Задач (`taskService.js`)
- [ ] `getAllTasks()` — Отримання повного списку задач[cite: 4].
- [ ] `createTask(data)` — Валідація та створення нової задачі[cite: 3, 4].
- [ ] `updateTask(id, patchData)` — Зміна статусу, пріоритету або опису[cite: 3, 4].
- [ ] `deleteTask(id)` — Видалення задачі за ідентифікатором[cite: 3, 4].

### 3.3. API Маршрути / REST Endpoints (Express.js)
- [ ] `GET /api/tasks` — Отримання всіх задач[cite: 3].
- [ ] `POST /api/tasks` — Створення нової задачі[cite: 3].
- [ ] `PATCH /api/tasks/:id` — Оновлення даних[cite: 3, 4].
- [ ] `DELETE /api/tasks/:id` — Видалення задачі[cite: 3, 4].

---

## 🗓️ ЕТАП 4: Документація та Фіналізація
- [ ] **Тестування:** Перевірка всіх сценаріїв використання на чистому середовищі[cite: 3].
- [ ] **Документація (`README.md`):** Опис архітектури, інструкція із запуску Node.js сервера та скріншоти[cite: 3].


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
  