import React, { useState, useEffect } from 'react';
import { DndContext, PointerSensor, useSensor, useSensors, useDroppable } from '@dnd-kit/core';
import { SortableContext, useSortable, arrayMove } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const initialTasks = [
    { id: 'task1', status: 'todo', title: 'Кэширование запросов (Next.js)', desc: 'Настроить кэш, чтобы экономить лимиты бесплатного API OpenWeatherMap (1000 запросов в день).', tag: 'API', color: 'purple', assignees: ['Волков'] },
    { id: 'task2', status: 'todo', title: 'Состояния ошибок (UI)', desc: 'Сверстать красивые плашки: "Город не найден", "Нет интернета", "Сервер недоступен".', tag: 'Интерфейс', color: 'blue', assignees: ['Волков'] },
    { id: 'task3', status: 'todo', title: 'Интеграция Geolocation API', desc: 'Написать скрипт запроса координат браузера и их конвертацию в название города.', tag: 'Логика', color: 'green', assignees: ['Волков'] },
    { id: 'task4', status: 'todo', title: 'Подбор компонентов shadcn/ui', desc: 'Выбрать и адаптировать стили для поля ввода (Input), кнопки (Button) и карточек (Card).', tag: 'Дизайн', color: 'orange', assignees: ['Илимбакиев'] },
    { id: 'task5', status: 'todo', title: 'Подготовка презентации', desc: 'Сделать слайды для защиты проекта (проблема, решение, технологии, интерфейс).', tag: 'Документация', color: 'yellow', assignees: ['Илимбакиев'] },
    { id: 'task6', status: 'todo', title: 'Планы на будущее: Выбор активности', desc: 'Продумать логику переключателя "Прогулка/Спорт", чтобы менять рекомендации (задел на версию 2.0).', tag: 'Логика', color: 'green', assignees: ['Волков', 'Илимбакиев'] },
    { id: 'task7', status: 'in-progress', title: 'Верстка главной страницы', desc: 'Строка поиска города, кнопка геолокации и три карточки (Утро, День, Вечер) на Tailwind CSS.', tag: 'Интерфейс', color: 'blue', assignees: ['Волков'] },
    { id: 'task8', status: 'in-progress', title: 'Настройка Framer Motion', desc: 'Плавное появление карточек, эффекты наведения и скелетоны (skeletons) при загрузке данных.', tag: 'Интерфейс', color: 'blue', assignees: ['Волков'] },
    { id: 'task9', status: 'in-progress', title: 'Формула Wind Chill (Ощущаемая t)', desc: 'Внедрение формулы ветро-холодового индекса и температурной таблицы (-10°C до +25°C).', tag: 'Логика', color: 'green', assignees: ['Волков'] },
    { id: 'task10', status: 'in-progress', title: 'Дополнительные факторы (Модификаторы)', desc: 'Прописать if/else условия: дождь > 30% = зонт, ветер > 15км/ч = ветровка, УФ > 3 = очки.', tag: 'Логика', color: 'green', assignees: ['Илимбакиев'] },
    { id: 'task11', status: 'testing', title: 'Ручное тестирование ошибок', desc: 'Ввести несуществующий город, отключить интернет в DevTools, запретить геолокацию.', tag: 'QA', color: 'teal', assignees: ['Илимбакиев'] },
    { id: 'task12', status: 'testing', title: 'Тестирование адаптивности', desc: 'Проверить, что 3 карточки выстраиваются одна под другой на телефонах (мобильная верстка).', tag: 'QA', color: 'teal', assignees: ['Илимбакиев'] },
    { id: 'task13', status: 'testing', title: 'Написание отчета по проекту', desc: 'Составление пояснительной записки: актуальность, описание работы API, скриншоты интерфейса.', tag: 'Документация', color: 'yellow', assignees: ['Волков', 'Илимбакиев'] },
    { id: 'task14', status: 'done', title: 'Составление ТЗ', desc: 'Разработка технического задания, разбивка на задачи, описание логики.', tag: 'Менеджмент', color: 'slate', assignees: ['Волков', 'Илимбакиев'] },
    { id: 'task15', status: 'done', title: 'Инициализация проекта', desc: 'Развертывание Next.js, установка Tailwind CSS и настройка репозитория на GitHub.', tag: 'Инфраструктура', color: 'blue', assignees: ['Волков'] },
    { id: 'task16', status: 'done', title: 'Сбор иконок Lucide', desc: 'Подобрать векторные иконки для погоды (солнце, тучи) и одежды (куртка, футболка, шорты).', tag: 'Дизайн', color: 'orange', assignees: ['Илимбакиев'] },
    { id: 'task17', status: 'done', title: 'Интеграция OpenWeatherMap', desc: 'Получение секретного ключа API и настройка базового запроса (One Call API 3.0).', tag: 'API', color: 'purple', assignees: ['Волков'] },
    { id: 'task18', status: 'done', title: 'Копирайтинг (Тексты)', desc: 'Написать короткие и понятные фразы-рекомендации по одежде для карточек UI.', tag: 'Дизайн', color: 'orange', assignees: ['Илимбакиев'] },
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

    const saveTask = (e) => {
        e.preventDefault();
        const { title, desc, tag, assigneeVolkov, assigneeIlimbakiev } = e.target.elements;
        const [tagText, color] = tag.value.split('|');
        let assignees = [];
        if (assigneeVolkov.checked) assignees.push('Волков');
        if (assigneeIlimbakiev.checked) assignees.push('Илимбакиев');
        if (!title.value.trim()) return alert('Введите название задачи!');
        if (modal.taskId) {
            setTasks(tasks.map(task => task.id === modal.taskId ? { ...task, title: title.value, desc: desc.value, tag: tagText, color, assignees } : task));
        } else {
            setTasks([...tasks, { id: 'task_' + Date.now(), status: 'todo', title: title.value, desc: desc.value, tag: tagText, color, assignees }]);
        }
        closeModal();
    };

    const deleteTask = () => {
        if (confirm('Точно удалить задачу?')) {
            setTasks(tasks.filter(task => task.id !== modal.taskId));
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
    const task = modal.taskId ? getTaskById(modal.taskId) : null;
    const isEdit = !!task;
    return (
        <div id="taskModal" className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 border border-slate-200 m-4 transform scale-100 transition-transform" id="modalContent">
                <form onSubmit={saveTask}>
                    <div className="flex justify-between items-center mb-5">
                        <h3 className="text-lg font-bold" id="modalTitle">{isEdit ? 'Редактировать задачу' : 'Новая задача'}</h3>
                        <button type="button" onClick={closeModal} className="text-slate-400 hover:text-slate-700">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                        </button>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Название задачи</label>
                            <input type="text" name="title" defaultValue={task?.title} placeholder="Например: Сверстать шапку" className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Описание</label>
                            <textarea name="desc" rows="3" defaultValue={task?.desc} placeholder="Краткое описание задачи..." className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm resize-none"></textarea>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Категория (Тег)</label>
                            <select name="tag" defaultValue={isEdit ? `${task.tag}|${task.color}`: ""} className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm">
                                <option value="Инфраструктура|blue">Инфраструктура (Синий)</option> <option value="API|purple">API / Бэкенд (Фиолетовый)</option> <option value="Логика|green">Логика / JS (Зеленый)</option>
                                <option value="Интерфейс|blue">Интерфейс / UI (Синий)</option> <option value="Дизайн|orange">Дизайн / Контент (Оранжевый)</option> <option value="Документация|yellow">Документация (Желтый)</option>
                                <option value="QA|teal">Тестирование (Бирюзовый)</option> <option value="Менеджмент|slate">Менеджмент (Серый)</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Исполнители</label>
                            <div className="flex gap-4">
                                <label className="flex items-center gap-2 text-sm cursor-pointer">
                                    <input type="checkbox" name="assigneeVolkov" defaultChecked={task?.assignees.includes('Волков')} className="rounded text-blue-600 focus:ring-blue-500 border-slate-300 w-4 h-4" /> Волков
                                </label>
                                <label className="flex items-center gap-2 text-sm cursor-pointer">
                                    <input type="checkbox" name="assigneeIlimbakiev" defaultChecked={task?.assignees.includes('Илимбакиев')} className="rounded text-emerald-600 focus:ring-emerald-500 border-slate-300 w-4 h-4" /> Илимбакиев
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
