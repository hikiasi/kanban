import React, { useState, useEffect } from 'react';
import { DndContext, PointerSensor, useSensor, useSensors, useDroppable } from '@dnd-kit/core';
import { SortableContext, useSortable, arrayMove } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const initialTasks = [
    // --- МЕНЕДЖМЕНТ И АНАЛИТИКА (DONE / IN-PROGRESS) ---
    { id: 't1', status: 'done', title: 'Сбор требований к проекту', desc: 'Провести брейншторм, выявить основную проблему (выбор одежды при смене погоды).', tag: 'Менеджмент', color: 'slate', assignees: ['Волков', 'Илимбакиев'] },
    { id: 't2', status: 'done', title: 'Написание Технического Задания (ТЗ)', desc: 'Сформировать итоговый PDF-документ с описанием логики, стека и пользовательского пути.', tag: 'Менеджмент', color: 'slate', assignees: ['Волков', 'Илимбакиев'] },
    { id: 't3', status: 'done', title: 'Выбор стека технологий', desc: 'Утвердить использование Next.js, Tailwind CSS, shadcn/ui и Framer Motion.', tag: 'Менеджмент', color: 'slate', assignees: ['Волков'] },
    { id: 't4', status: 'done', title: 'Распределение ролей в команде', desc: 'Волков: Frontend, API, Архитектура. Илимбакиев: QA, Дизайн, Контент, Документация.', tag: 'Менеджмент', color: 'slate', assignees: ['Волков', 'Илимбакиев'] },
    { id: 't5', status: 'done', title: 'Настройка Канбан-доски', desc: 'Создать структуру задач, продумать теги и статусы для трекинга прогресса.', tag: 'Менеджмент', color: 'slate', assignees: ['Волков'] },

    // --- ИНФРАСТРУКТУРА (DONE) ---
    { id: 't6', status: 'done', title: 'Инициализация Next.js', desc: 'Развернуть базовый проект через create-next-app, удалить лишний бойлерплейт.', tag: 'Инфраструктура', color: 'blue', assignees: ['Волков'] },
    { id: 't7', status: 'done', title: 'Настройка Tailwind CSS', desc: 'Подключить Tailwind, настроить theme (шрифты sans, базовые цвета slate).', tag: 'Инфраструктура', color: 'blue', assignees: ['Волков'] },
    { id: 't8', status: 'done', title: 'Установка shadcn/ui CLI', desc: 'Инициализировать shadcn через npx, настроить components.json.', tag: 'Инфраструктура', color: 'blue', assignees: ['Волков'] },
    { id: 't9', status: 'done', title: 'Настройка ESLint и Prettier', desc: 'Добавить правила линтинга кода для поддержания единого стиля в команде.', tag: 'Инфраструктура', color: 'blue', assignees: ['Волков'] },
    { id: 't10', status: 'done', title: 'Создание репозитория GitHub', desc: 'Инициализировать Git, сделать initial commit, добавить .gitignore.', tag: 'Инфраструктура', color: 'blue', assignees: ['Волков'] },
    { id: 't11', status: 'todo', title: 'Настройка CI/CD (Vercel)', desc: 'Подключить GitHub к Vercel для автоматического деплоя при пуше в ветку main.', tag: 'Инфраструктура', color: 'blue', assignees: ['Волков'] },

    // --- ДИЗАЙН И КОНТЕНТ (DONE / IN-PROGRESS) ---
    { id: 't12', status: 'done', title: 'Выбор цветовой палитры', desc: 'Утвердить спокойные цвета: светлый фон (slate-50), темный текст, синеватый оттенок для холода.', tag: 'Дизайн', color: 'orange', assignees: ['Илимбакиев'] },
    { id: 't13', status: 'done', title: 'Подбор иконок погоды (Lucide)', desc: 'Найти svg-иконки: sun, cloud, cloud-rain, cloud-lightning, snowflake.', tag: 'Дизайн', color: 'orange', assignees: ['Илимбакиев'] },
    { id: 't14', status: 'done', title: 'Подбор иконок одежды (Lucide)', desc: 'Найти иконки: shirt (футболка), jacket (куртка), pants (брюки), umbrella (зонт).', tag: 'Дизайн', color: 'orange', assignees: ['Илимбакиев'] },
    { id: 't15', status: 'done', title: 'Проектирование Layout-а', desc: 'Набросать схему: заголовок -> поиск -> 3 карточки в ряд (desktop) / в столбик (mobile).', tag: 'Дизайн', color: 'orange', assignees: ['Илимбакиев'] },
    { id: 't16', status: 'in-progress', title: 'Копирайтинг: Короткие описания', desc: 'Составить шаблоны строк: "Солнечно, ветер 15 км/ч", "Ощущается как -5°C".', tag: 'Дизайн', color: 'orange', assignees: ['Илимбакиев'] },
    { id: 't17', status: 'in-progress', title: 'Копирайтинг: Названия одежды', desc: 'Собрать базу текстовых названий (демисезонная куртка, термобелье, легкие шорты).', tag: 'Дизайн', color: 'orange', assignees: ['Илимбакиев'] },

    // --- API И БЭКЕНД (IN-PROGRESS / TODO) ---
    { id: 't18', status: 'done', title: 'Регистрация в OpenWeatherMap', desc: 'Создать аккаунт, получить секретный API ключ для One Call API 3.0.', tag: 'API', color: 'purple', assignees: ['Волков'] },
    { id: 't19', status: 'in-progress', title: 'Разработка серверного API Route', desc: 'Создать /api/weather в Next.js для скрытия секретного ключа от клиента.', tag: 'API', color: 'purple', assignees: ['Волков'] },
    { id: 't20', status: 'in-progress', title: 'Интеграция Geocoding API', desc: 'Реализовать преобразование названия города ("Москва") в координаты (lat, lon).', tag: 'API', color: 'purple', assignees: ['Волков'] },
    { id: 't21', status: 'todo', title: 'Парсинг ответа OpenWeatherMap', desc: 'Извлечь из 48-часового массива данные строго для 8:00, 14:00 и 20:00.', tag: 'API', color: 'purple', assignees: ['Волков'] },
    { id: 't22', status: 'todo', title: 'Кэширование данных о погоде', desc: 'Настроить ISR / fetch cache в Next.js, чтобы не расходовать 1000 запросов/день.', tag: 'API', color: 'purple', assignees: ['Волков'] },
    { id: 't23', status: 'todo', title: 'Обработка ошибки 404 (API)', desc: 'Проброс ошибки "Город не найден", если Geocoding API вернул пустой массив.', tag: 'API', color: 'purple', assignees: ['Волков'] },
    { id: 't24', status: 'todo', title: 'Обработка ошибки 429 (API)', desc: 'Обработка статуса "Слишком много запросов" (исчерпан лимит OpenWeatherMap).', tag: 'API', color: 'purple', assignees: ['Волков'] },

    // --- ИНТЕРФЕЙС / UI КОМПОНЕНТЫ (IN-PROGRESS / TODO) ---
    { id: 't25', status: 'in-progress', title: 'Верстка шапки (Header)', desc: 'Создать минималистичный заголовок "Что надеть?" и подзаголовок.', tag: 'Интерфейс', color: 'blue', assignees: ['Волков'] },
    { id: 't26', status: 'in-progress', title: 'Компонент: Input (Поиск)', desc: 'Установить shadcn Input, стилизовать поле "Введите ваш город".', tag: 'Интерфейс', color: 'blue', assignees: ['Волков'] },
    { id: 't27', status: 'in-progress', title: 'Компонент: Button (Геолокация)', desc: 'Создать круглую кнопку с иконкой прицела (Target) для автоопределения места.', tag: 'Интерфейс', color: 'blue', assignees: ['Волков'] },
    { id: 't28', status: 'todo', title: 'Компонент: Карточка (Card)', desc: 'Сверстать базовую белую карточку (bg-white rounded-xl shadow-lg).', tag: 'Интерфейс', color: 'blue', assignees: ['Волков'] },
    { id: 't29', status: 'todo', title: 'Внутренности карточки: Заголовок', desc: 'Добавить надписи УТРО, ДЕНЬ, ВЕЧЕР крупным шрифтом.', tag: 'Интерфейс', color: 'blue', assignees: ['Волков'] },
    { id: 't30', status: 'todo', title: 'Внутренности карточки: Температура', desc: 'Блок с большой иконкой погоды и крупными цифрами температуры.', tag: 'Интерфейс', color: 'blue', assignees: ['Волков'] },
    { id: 't31', status: 'todo', title: 'Внутренности карточки: "Ощущается как"', desc: 'Добавить серый текст меньшего размера под основной температурой.', tag: 'Интерфейс', color: 'blue', assignees: ['Волков'] },
    { id: 't32', status: 'todo', title: 'Список рекомендаций одежды (UI)', desc: 'Сверстать ul-список с иконкой одежды слева и названием справа.', tag: 'Интерфейс', color: 'blue', assignees: ['Волков'] },
    { id: 't33', status: 'todo', title: 'Подвал карточки (Мини-иконки)', desc: 'Сверстать блок внизу для значков-модификаторов (зонтик, ветер, очки).', tag: 'Интерфейс', color: 'blue', assignees: ['Волков'] },
    { id: 't34', status: 'todo', title: 'Компонент: Скелетоны (Skeleton)', desc: 'Установить shadcn Skeleton для мерцающих заглушек при загрузке.', tag: 'Интерфейс', color: 'blue', assignees: ['Волков'] },
    { id: 't35', status: 'todo', title: 'Цветовая индикация карточек', desc: 'Добавить динамический CSS класс: синеватый фон при t < 0, желтоватый при t > 20.', tag: 'Интерфейс', color: 'blue', assignees: ['Волков'] },

    // --- UX И АНИМАЦИИ (TODO) ---
    { id: 't36', status: 'todo', title: 'Установка Framer Motion', desc: 'Добавить библиотеку анимаций в зависимости проекта (npm i framer-motion).', tag: 'Интерфейс', color: 'blue', assignees: ['Волков'] },
    { id: 't37', status: 'todo', title: 'Анимация: Появление карточек', desc: 'Настроить staggered children: карточки появляются по очереди слева направо.', tag: 'Интерфейс', color: 'blue', assignees: ['Волков'] },
    { id: 't38', status: 'todo', title: 'Анимация: Hover эффект', desc: 'Слегка приподнимать карточку (translate-y) при наведении мыши.', tag: 'Интерфейс', color: 'blue', assignees: ['Волков'] },
    { id: 't39', status: 'todo', title: 'Анимация: Смена города', desc: 'Плавное исчезновение старых карточек и появление новых (AnimatePresence).', tag: 'Интерфейс', color: 'blue', assignees: ['Волков'] },

    // --- ЛОГИКА (JS / АЛГОРИТМЫ) ---
    { id: 't40', status: 'in-progress', title: 'Логика: Формула Wind Chill', desc: 'Написать JS-функцию расчета ветро-холодового индекса по формуле из ТЗ.', tag: 'Логика', color: 'green', assignees: ['Волков'] },
    { id: 't41', status: 'todo', title: 'Логика: Зона 1 (Сильный мороз)', desc: 'Реализовать массив одежды для ощущаемой t < -10°C (пуховик, термобелье).', tag: 'Логика', color: 'green', assignees: ['Волков'] },
    { id: 't42', status: 'todo', title: 'Логика: Зона 2 (Мороз)', desc: 'Реализовать массив одежды для ощущаемой t от -10°C до 0°C.', tag: 'Логика', color: 'green', assignees: ['Волков'] },
    { id: 't43', status: 'todo', title: 'Логика: Зона 3 (Холодно)', desc: 'Реализовать массив одежды для ощущаемой t от 0°C до +10°C (весенняя погода).', tag: 'Логика', color: 'green', assignees: ['Волков'] },
    { id: 't44', status: 'todo', title: 'Логика: Зона 4 (Прохладно)', desc: 'Реализовать массив одежды для ощущаемой t от +10°C до +18°C.', tag: 'Логика', color: 'green', assignees: ['Волков'] },
    { id: 't45', status: 'todo', title: 'Логика: Зона 5 (Тепло)', desc: 'Реализовать массив одежды для ощущаемой t от +18°C до +25°C.', tag: 'Логика', color: 'green', assignees: ['Волков'] },
    { id: 't46', status: 'todo', title: 'Логика: Зона 6 (Жарко)', desc: 'Реализовать массив одежды для ощущаемой t > +25°C (шорты, майка).', tag: 'Логика', color: 'green', assignees: ['Волков'] },
    
    // --- МОДИФИКАТОРЫ (Логика Илимбакиева) ---
    { id: 't47', status: 'todo', title: 'Модификатор: Дождь', desc: 'Условие: если pop (probability of precipitation) > 30%, добавить "Зонт" в массив.', tag: 'Логика', color: 'green', assignees: ['Илимбакиев'] },
    { id: 't48', status: 'todo', title: 'Модификатор: Дождь + Обувь', desc: 'Заменять "кроссовки" на "резиновые сапоги / кожаную обувь" при сильном дожде.', tag: 'Логика', color: 'green', assignees: ['Илимбакиев'] },
    { id: 't49', status: 'todo', title: 'Модификатор: Сильный ветер', desc: 'Условие: если wind_speed > 15 км/ч, добавить "Ветровка" вместо кофты.', tag: 'Логика', color: 'green', assignees: ['Илимбакиев'] },
    { id: 't50', status: 'todo', title: 'Модификатор: Сильное солнце', desc: 'Условие: если uvi (УФ-индекс) > 3, добавить очки и кепку/панаму.', tag: 'Логика', color: 'green', assignees: ['Илимбакиев'] },
    { id: 't51', status: 'todo', title: 'Модификатор: Высокая влажность', desc: 'Условие: если жарко и влажность > 70%, рекомендовать одежду из льна/хлопка.', tag: 'Логика', color: 'green', assignees: ['Илимбакиев'] },

    // --- ФУНКЦИОНАЛ БРАУЗЕРА ---
    { id: 't52', status: 'todo', title: 'API Браузера: Geolocation', desc: 'Привязать функцию navigator.geolocation.getCurrentPosition к кнопке локации.', tag: 'API', color: 'purple', assignees: ['Волков'] },
    { id: 't53', status: 'todo', title: 'Автокомплит городов', desc: 'Подключить dropdown для подсказки городов ("Калининград, область") во избежание опечаток.', tag: 'Интерфейс', color: 'blue', assignees: ['Волков'] },
    
    // --- ТЕСТИРОВАНИЕ (QA) ---
    { id: 't54', status: 'testing', title: 'Тест: Ввод с опечаткой', desc: 'Проверить появление сообщения "Город не найден. Проверьте название".', tag: 'QA', color: 'teal', assignees: ['Илимбакиев'] },
    { id: 't55', status: 'testing', title: 'Тест: Отключение интернета', desc: 'Включить Offline в DevTools, проверить вывод ошибки "Проверьте интернет-соединение".', tag: 'QA', color: 'teal', assignees: ['Илимбакиев'] },
    { id: 't56', status: 'testing', title: 'Тест: Запрет геолокации', desc: 'Нажать "Блокировать" при запросе геоданных, проверить fallback сообщение.', tag: 'QA', color: 'teal', assignees: ['Илимбакиев'] },
    { id: 't57', status: 'todo', title: 'Тест: Адаптив (iPhone SE)', desc: 'Проверить вёрстку на минимальном разрешении экрана (320px).', tag: 'QA', color: 'teal', assignees: ['Илимбакиев'] },
    { id: 't58', status: 'todo', title: 'Тест: Адаптив (Планшет)', desc: 'Проверить отображение на iPad (карточки должны сжиматься или переноситься).', tag: 'QA', color: 'teal', assignees: ['Илимбакиев'] },
    { id: 't59', status: 'todo', title: 'Кроссбраузерное тестирование', desc: 'Убедиться, что сайт корректно работает в Chrome, Safari и Firefox.', tag: 'QA', color: 'teal', assignees: ['Илимбакиев'] },
    { id: 't60', status: 'todo', title: 'Тест: Смена часовых поясов', desc: 'Проверить, что время (8:00, 14:00) берется по местному времени выбранного города.', tag: 'QA', color: 'teal', assignees: ['Илимбакиев'] },
    { id: 't61', status: 'todo', title: 'Тест: Скелетоны', desc: 'Установить 3G throttling в браузере, чтобы убедиться, что скелетоны красиво мерцают.', tag: 'QA', color: 'teal', assignees: ['Илимбакиев'] },

    // --- ДОКУМЕНТАЦИЯ И ОТЧЕТЫ (TODO / TESTING) ---
    { id: 't62', status: 'todo', title: 'Оформление README.md', desc: 'Описать проект, инструкции по запуску (npm run dev) и стек на GitHub.', tag: 'Документация', color: 'yellow', assignees: ['Илимбакиев'] },
    { id: 't63', status: 'testing', title: 'Отчет: Раздел "Актуальность"', desc: 'Описать ежедневную проблему выбора одежды при переменчивой погоде.', tag: 'Документация', color: 'yellow', assignees: ['Илимбакиев'] },
    { id: 't64', status: 'todo', title: 'Отчет: Раздел "Архитектура"', desc: 'Описать работу клиент-серверной архитектуры на базе Next.js.', tag: 'Документация', color: 'yellow', assignees: ['Волков', 'Илимбакиев'] },
    { id: 't65', status: 'todo', title: 'Отчет: Раздел "Интеграция API"', desc: 'Описать, какие данные мы тянем из OpenWeatherMap.', tag: 'Документация', color: 'yellow', assignees: ['Волков'] },
    { id: 't66', status: 'todo', title: 'Отчет: Блок-схема алгоритма', desc: 'Нарисовать диаграмму (Flowchart) выбора одежды по температуре и ветру.', tag: 'Документация', color: 'yellow', assignees: ['Илимбакиев'] },
    { id: 't67', status: 'todo', title: 'Скриншоты интерфейса', desc: 'Сделать красивые мокапы (скриншоты) готового приложения для вставки в отчет.', tag: 'Документация', color: 'yellow', assignees: ['Илимбакиев'] },
    { id: 't68', status: 'todo', title: 'Создание презентации (Слайды)', desc: 'Сделать 8-10 слайдов для финальной защиты курсового/дипломного проекта.', tag: 'Документация', color: 'yellow', assignees: ['Илимбакиев'] },
    { id: 't69', status: 'todo', title: 'Подготовка текста для защиты', desc: 'Написать речь на 5-7 минут, распределить, кто о чем будет говорить.', tag: 'Документация', color: 'yellow', assignees: ['Волков', 'Илимбакиев'] },

    // --- ПЛАНЫ НА БУДУЩЕЕ / BACKLOG (TODO) ---
    { id: 't70', status: 'todo', title: 'Фича (v2.0): Выбор активности', desc: 'Спроектировать UI переключателя: Прогулка / Пробежка / Работа.', tag: 'Дизайн', color: 'orange', assignees: ['Илимбакиев'] },
    { id: 't71', status: 'todo', title: 'Логика (v2.0): Смещение температур', desc: 'Для "Пробежки" применять логику: ощущаемая температура + 10 градусов.', tag: 'Логика', color: 'green', assignees: ['Волков'] },
    { id: 't72', status: 'todo', title: 'Фича (v2.0): Избранные города', desc: 'Добавить сохранение списка городов в localStorage пользователя.', tag: 'Интерфейс', color: 'blue', assignees: ['Волков'] },
    { id: 't73', status: 'todo', title: 'Фича (v2.0): Вкладка "Завтра"', desc: 'Добавить UI вкладки (tabs) для переключения прогноза на следующий день.', tag: 'Интерфейс', color: 'blue', assignees: ['Волков'] },
    { id: 't74', status: 'todo', title: 'Настройка (v2.0): "Я мерзляк"', desc: 'Добавить ползунок теплолюбивости для индивидуальной подстройки советов.', tag: 'Логика', color: 'green', assignees: ['Волков', 'Илимбакиев'] },
    { id: 't75', status: 'done', title: 'Вычитка ТЗ преподавателем', desc: 'Получить апрув (согласование) от научного руководителя по текущему списку фич.', tag: 'Менеджмент', color: 'slate', assignees: ['Волков', 'Илимбакиев'] }
];

const TaskCard = ({ task, openTaskModal }) => {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task.id });
    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    const colorClasses = {
        'blue': 'bg-blue-100 text-blue-700', 'purple': 'bg-purple-100 text-purple-700', 'green': 'bg-green-100 text-green-700',
        'orange': 'bg-orange-100 text-orange-700', 'yellow': 'bg-yellow-100 text-yellow-700', 'teal': 'bg-teal-100 text-teal-700',
        'slate': 'bg-slate-200 text-slate-700'
    };
    const theme = colorClasses[task.color] || colorClasses['slate'];

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}
             className="task-card bg-white p-4 rounded-lg shadow-sm border border-slate-200 cursor-grab active:cursor-grabbing relative group">
            <div className="flex justify-between items-start mb-2">
                <span className={`task-tag text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded ${theme}`}>{task.tag}</span>
                <button onClick={() => openTaskModal(task.id)} className="text-slate-400 hover:text-slate-700 opacity-0 group-hover:opacity-100 transition-opacity">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>
                </button>
            </div>
            <h3 className="task-title font-medium text-sm mb-1">{task.title}</h3>
            <p className="task-desc text-xs text-slate-500 mb-3">{task.desc}</p>
            <div className="task-assignees text-xs font-semibold text-slate-600 flex gap-1 flex-wrap">
                {task.assignees.map(name => <span key={name} className="bg-slate-100 px-2 py-0.5 rounded border border-slate-200">{name}</span>)}
                {task.assignees.length === 0 && <span className="text-slate-400">Нет исполнителя</span>}
            </div>
        </div>
    );
};

const Column = ({ id, title, tasks, openTaskModal }) => {
    const { setNodeRef } = useDroppable({ id });
    return (
        <div ref={setNodeRef} className="flex-1 bg-slate-100/70 rounded-xl p-4 min-w-[300px] border border-slate-200">
            <h2 className="font-semibold text-slate-700 mb-4 flex items-center justify-between">
                {title}
                <span className="task-count bg-slate-200 text-slate-600 px-2.5 py-0.5 rounded-full text-xs">{tasks.length}</span>
            </h2>
            <SortableContext id={id} items={tasks.map(t => t.id)}>
                <div className="column-drop-zone flex flex-col gap-3 min-h-[150px]">
                    {tasks.map(task => <TaskCard key={task.id} task={task} openTaskModal={openTaskModal} />)}
                </div>
            </SortableContext>
        </div>
    );
};

const KanbanBoard = () => {
    const [tasks, setTasks] = useState(() => {
        const savedTasks = localStorage.getItem('tasks');
        return savedTasks ? JSON.parse(savedTasks) : initialTasks;
    });
    const [modal, setModal] = useState({ isOpen: false, taskId: null });
    
    useEffect(() => { localStorage.setItem('tasks', JSON.stringify(tasks)); }, [tasks]);

    const sensors = useSensors(useSensor(PointerSensor));

    function handleDragEnd(event) {
        const { active, over } = event;
        if (!over) return;
        
        const activeId = active.id;
        const overId = over.id;

        setTasks((currentTasks) => {
            const activeIndex = currentTasks.findIndex((t) => t.id === activeId);
            let overIndex = currentTasks.findIndex((t) => t.id === overId);

            // Dropped over a column, not a task
            if (overIndex === -1) {
                const overIsColumn = columns.some(c => c.id === overId);
                if (overIsColumn) {
                    currentTasks[activeIndex].status = overId;
                    return [...currentTasks];
                }
                return currentTasks; // Not a valid drop target
            }

            // Dropped over another task
            if (currentTasks[activeIndex].status !== currentTasks[overIndex].status) {
                // Change status and move
                currentTasks[activeIndex].status = currentTasks[overIndex].status;
                return arrayMove(currentTasks, activeIndex, overIndex);
            }

            // Just reorder within the same column
            return arrayMove(currentTasks, activeIndex, overIndex);
        });
    }
    
    const openTaskModal = (taskId = null) => setModal({ isOpen: true, taskId });
    const closeModal = () => setModal({ isOpen: false, taskId: null });

    const saveTask = (formData, taskId) => {
        const [tagText, color] = formData.tag.split('|');
        if (!formData.title.trim()) return alert('Введите название задачи!');

        if (taskId) {
            setTasks(tasks => tasks.map(task => 
                task.id === taskId 
                ? { ...task, title: formData.title, desc: formData.desc, tag: tagText, color, assignees: formData.assignees } 
                : task
            ));
        } else {
            const newTask = {
                id: 'task_' + Date.now(),
                status: 'todo',
                title: formData.title,
                desc: formData.desc,
                tag: tagText,
                color,
                assignees: formData.assignees
            };
            setTasks(tasks => [...tasks, newTask]);
        }
        closeModal();
    };

    const deleteTask = () => {
        if (confirm('Точно удалить задачу?')) {
            setTasks(tasks => tasks.filter(task => task.id !== modal.taskId));
            closeModal();
        }
    };
    
    const columns = [ { id: 'todo', title: 'К выполнению' }, { id: 'in-progress', title: 'В работе' }, { id: 'testing', title: 'Тестирование (QA)' }, { id: 'done', title: 'Готово' }];
    const getTaskById = (id) => tasks.find(task => task.id === id);

    return (
        <div className="bg-slate-50 text-slate-900 font-sans p-4 md:p-8 min-h-screen">
            <div className="max-w-[1400px] mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold mb-2 tracking-tight">Канбан-доска проекта</h1>
                        <p className="text-slate-500 text-sm md:text-base">Разработка веб-приложения «Что надеть?» (Next.js, Tailwind, OpenWeatherMap)</p>
                    </div>
                    <button onClick={() => openTaskModal()} className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
                        Добавить задачу
                    </button>
                </div>
                <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
                    <div className="flex flex-col md:flex-row gap-6 overflow-x-auto pb-8 items-start">
                        {columns.map(column => (
                            <Column key={column.id} id={column.id} title={column.title} tasks={tasks.filter(t => t.status === column.id)} openTaskModal={openTaskModal} />
                        ))}
                    </div>
                </DndContext>
            </div>
            {modal.isOpen && <TaskModal modal={modal} closeModal={closeModal} saveTask={saveTask} deleteTask={deleteTask} getTaskById={getTaskById} />}
        </div>
    );
};

const TaskModal = ({ modal, closeModal, saveTask, deleteTask, getTaskById }) => {
    const taskToEdit = modal.taskId ? getTaskById(modal.taskId) : null;
    const isEdit = !!taskToEdit;

    const [formData, setFormData] = useState({
        title: taskToEdit?.title || '',
        desc: taskToEdit?.desc || '',
        tag: taskToEdit ? `${taskToEdit.tag}|${taskToEdit.color}` : 'Инфраструктура|blue',
        assignees: taskToEdit?.assignees || [],
    });

    // Effect to reset form when a new task is opened for editing
    useEffect(() => {
        const task = modal.taskId ? getTaskById(modal.taskId) : null;
        setFormData({
            title: task?.title || '',
            desc: task?.desc || '',
            tag: task ? `${task.tag}|${task.color}` : 'Инфраструктура|blue',
            assignees: task?.assignees || [],
        });
    }, [modal.taskId, getTaskById]);


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    
    const handleAssigneeChange = (e) => {
        const { name, checked } = e.target;
        setFormData(prev => {
            const currentAssignees = prev.assignees;
            if (checked) {
                return { ...prev, assignees: [...currentAssignees, name] };
            } else {
                return { ...prev, assignees: currentAssignees.filter(a => a !== name) };
            }
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        saveTask(formData, modal.taskId);
    };

    return (
        <div id="taskModal" className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 border border-slate-200 m-4 transform scale-100 transition-transform" id="modalContent">
                <form onSubmit={handleSubmit}>
                    <div className="flex justify-between items-center mb-5">
                        <h3 className="text-lg font-bold">{isEdit ? 'Редактировать задачу' : 'Новая задача'}</h3>
                        <button type="button" onClick={closeModal} className="text-slate-400 hover:text-slate-700">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                        </button>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Название задачи</label>
                            <input type="text" name="title" value={formData.title} onChange={handleChange} placeholder="Например: Сверстать шапку" className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Описание</label>
                            <textarea name="desc" rows="3" value={formData.desc} onChange={handleChange} placeholder="Краткое описание задачи..." className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm resize-none"></textarea>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Категория (Тег)</label>
                            <select name="tag" value={formData.tag} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm">
                                <option value="Инфраструктура|blue">Инфраструктура (Синий)</option>
                                <option value="API|purple">API / Бэкенд (Фиолетовый)</option>
                                <option value="Логика|green">Логика / JS (Зеленый)</option>
                                <option value="Интерфейс|blue">Интерфейс / UI (Синий)</option>
                                <option value="Дизайн|orange">Дизайн / Контент (Оранжевый)</option>
                                <option value="Документация|yellow">Документация (Желтый)</option>
                                <option value="QA|teal">Тестирование (Бирюзовый)</option>
                                <option value="Менеджмент|slate">Менеджмент (Серый)</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Исполнители</label>
                            <div className="flex gap-4">
                                <label className="flex items-center gap-2 text-sm cursor-pointer">
                                    <input type="checkbox" name="Волков" checked={formData.assignees.includes('Волков')} onChange={handleAssigneeChange} className="rounded text-blue-600 focus:ring-blue-500 border-slate-300 w-4 h-4" /> Волков
                                </label>
                                <label className="flex items-center gap-2 text-sm cursor-pointer">
                                    <input type="checkbox" name="Илимбакиев" checked={formData.assignees.includes('Илимбакиев')} onChange={handleAssigneeChange} className="rounded text-emerald-600 focus:ring-emerald-500 border-slate-300 w-4 h-4" /> Илимбакиев
                                </label>
                            </div>
                        </div>
                    </div>
                    <div className="mt-8 flex justify-between items-center">
                        {isEdit && <button type="button" onClick={deleteTask} className="text-sm text-red-600 hover:text-red-700 font-medium">Удалить</button>}
                        <div className="flex gap-3 ml-auto">
                            <button type="button" onClick={closeModal} className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors">Отмена</button>
                            <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors shadow-sm">Сохранить</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default KanbanBoard;
