import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Edit3, Plus, ChevronDown, ChevronRight } from 'lucide-react';
import Background from './Background';
import { DndContext, PointerSensor, TouchSensor, KeyboardSensor, useSensor, useSensors, useDroppable } from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
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

const TaskCard = ({ task, openTaskModal, deleteTaskById }) => {
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
        <motion.div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            whileHover={{ y: -5, scale: 1.02, boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)' }}
            className="task-card bg-white/70 backdrop-blur-md p-5 rounded-2xl shadow-sm border border-white/50 cursor-grab active:cursor-grabbing relative group"
        >
            <div className="flex justify-between items-start mb-2">
                <span className={`task-tag text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded ${theme}`}>{task.tag}</span>
                <div className="flex gap-1">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            openTaskModal(task.id);
                        }}
                        className="text-slate-400 hover:text-blue-600 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all p-1.5 hover:bg-blue-50 rounded-lg"
                        title="Редактировать"
                    >
                        <Edit3 size={14} />
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            deleteTaskById(task.id);
                        }}
                        className="text-slate-400 hover:text-red-600 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all p-1.5 hover:bg-red-50 rounded-lg"
                        title="Удалить"
                    >
                        <Trash2 size={14} />
                    </button>
                </div>
            </div>
            <h3 className="task-title font-medium text-sm mb-1">{task.title}</h3>
            <p className="task-desc text-xs text-slate-500 mb-3">{task.desc}</p>
            <div className="task-assignees text-xs font-semibold text-slate-600 flex gap-1 flex-wrap">
                {task.assignees.map(name => <span key={name} className="bg-slate-100 px-2 py-0.5 rounded border border-slate-200">{name}</span>)}
                {task.assignees.length === 0 && <span className="text-slate-400">Нет исполнителя</span>}
            </div>
        </motion.div>
    );
};

const Column = ({ id, title, tasks, openTaskModal, deleteTaskById, isCollapsed, toggleCollapse }) => {
    const { setNodeRef } = useDroppable({ id });

    return (
        <motion.div
            ref={setNodeRef}
            layout
            className={`flex-1 bg-slate-400/5 backdrop-blur-xl rounded-3xl p-5 border border-white/20 shadow-xl flex flex-col transition-all duration-300 ${isCollapsed ? 'min-w-[80px] w-[80px] flex-none' : 'min-w-[340px]'}`}
        >
            <div className={`flex items-center justify-between mb-5 px-1 ${isCollapsed ? 'flex-col gap-6' : ''}`}>
                <div className={`flex items-center gap-2 ${isCollapsed ? 'rotate-90 origin-center translate-y-12 whitespace-nowrap' : ''}`}>
                    <h2 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                        {title}
                        {!isCollapsed && (
                            <span className="task-count bg-slate-200/50 backdrop-blur-sm text-slate-600 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-tighter ring-1 ring-slate-900/5">{tasks.length}</span>
                        )}
                    </h2>
                </div>

                <div className={`flex items-center gap-1 ${isCollapsed ? 'flex-col' : ''}`}>
                    {!isCollapsed && (
                        <button
                            onClick={() => openTaskModal(null, id)}
                            className="p-1.5 hover:bg-white/50 rounded-full transition-colors text-slate-500 hover:text-slate-900"
                            title="Добавить в эту колонку"
                        >
                            <Plus size={18} />
                        </button>
                    )}
                    <button
                        onClick={() => toggleCollapse(id)}
                        className="p-1.5 hover:bg-white/50 rounded-full transition-colors text-slate-500 hover:text-slate-900"
                        title={isCollapsed ? "Развернуть" : "Свернуть"}
                    >
                        {isCollapsed ? <ChevronRight size={18} /> : <ChevronDown size={18} />}
                    </button>
                </div>
            </div>

            <AnimatePresence mode="wait">
                {!isCollapsed && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                    >
                        <SortableContext id={id} items={tasks.map(t => t.id)}>
                            <div className="column-drop-zone flex flex-col gap-3 min-h-[200px] pb-4">
                                <AnimatePresence mode="popLayout">
                                    {tasks.map(task => (
                                        <TaskCard key={task.id} task={task} openTaskModal={openTaskModal} deleteTaskById={deleteTaskById} />
                                    ))}
                                </AnimatePresence>
                            </div>
                        </SortableContext>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

const KanbanBoard = () => {
    const [tasks, setTasks] = useState(() => {
        const savedTasks = localStorage.getItem('tasks');
        return savedTasks ? JSON.parse(savedTasks) : initialTasks;
    });
    const [modal, setModal] = useState({ isOpen: false, taskId: null, targetStatus: null });
    const [collapsedColumns, setCollapsedColumns] = useState([]);
    
    useEffect(() => { localStorage.setItem('tasks', JSON.stringify(tasks)); }, [tasks]);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        }),
        useSensor(TouchSensor, {
            activationConstraint: {
                delay: 250,
                tolerance: 5,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

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
    
    const openTaskModal = (taskId = null, targetStatus = null) => setModal({ isOpen: true, taskId, targetStatus });
    const closeModal = () => setModal({ isOpen: false, taskId: null, targetStatus: null });

    const toggleCollapse = (columnId) => {
        setCollapsedColumns(prev =>
            prev.includes(columnId)
                ? prev.filter(id => id !== columnId)
                : [...prev, columnId]
        );
    };

    const saveTask = (e) => {
        e.preventDefault();
        const { title, desc, tag, status, assigneeVolkov, assigneeIlimbakiev } = e.target.elements;
        const [tagText, color] = tag.value.split('|');
        const selectedStatus = status.value;

        let assignees = [];
        if (assigneeVolkov.checked) assignees.push('Волков');
        if (assigneeIlimbakiev.checked) assignees.push('Илимбакиев');

        if (!title.value.trim()) return alert('Введите название задачи!');

        if (modal.taskId) {
            setTasks(tasks.map(task =>
                task.id === modal.taskId
                    ? { ...task, title: title.value, desc: desc.value, tag: tagText, color, status: selectedStatus, assignees }
                    : task
            ));
        } else {
            setTasks([...tasks, {
                id: 'task_' + Date.now(),
                status: selectedStatus || modal.targetStatus || 'todo',
                title: title.value,
                desc: desc.value,
                tag: tagText,
                color,
                assignees
            }]);
        }
        closeModal();
    };

    const deleteTask = () => {
        if (confirm('Точно удалить задачу?')) {
            setTasks(tasks.filter(task => task.id !== modal.taskId));
            closeModal();
        }
    };

    const deleteTaskById = (id) => {
        if (confirm('Точно удалить задачу?')) {
            setTasks(tasks.filter(task => task.id !== id));
        }
    };
    
    const columns = [ { id: 'todo', title: 'К выполнению' }, { id: 'in-progress', title: 'В работе' }, { id: 'testing', title: 'Тестирование (QA)' }, { id: 'done', title: 'Готово' }];
    const getTaskById = (id) => tasks.find(task => task.id === id);

    return (
        <div className="text-slate-900 font-sans p-4 md:p-8 min-h-screen relative overflow-hidden">
            <Background />
            <div className="max-w-[1400px] mx-auto relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
                    <div>
                        <motion.h1
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="text-4xl font-black mb-2 tracking-tight text-slate-900"
                        >
                            Проект «Что надеть?»
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-slate-500 text-sm md:text-base font-medium"
                        >
                            Управление задачами • Next.js + Tailwind CSS
                        </motion.p>
                    </div>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => openTaskModal()}
                        className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors shadow-lg shadow-slate-900/20 flex items-center gap-2"
                    >
                        <Plus size={18} />
                        Добавить задачу
                    </motion.button>
                </div>
                <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
                    <div className="flex flex-col md:flex-row gap-6 overflow-x-auto pb-8 items-start">
                        {columns.map(column => (
                            <Column
                                key={column.id}
                                id={column.id}
                                title={column.title}
                                tasks={tasks.filter(t => t.status === column.id)}
                                openTaskModal={openTaskModal}
                                deleteTaskById={deleteTaskById}
                                isCollapsed={collapsedColumns.includes(column.id)}
                                toggleCollapse={toggleCollapse}
                            />
                        ))}
                    </div>
                </DndContext>
            </div>
            <AnimatePresence>
                {modal.isOpen && <TaskModal modal={modal} closeModal={closeModal} saveTask={saveTask} deleteTask={deleteTask} getTaskById={getTaskById} />}
            </AnimatePresence>
        </div>
    );
};

const TaskModal = ({ modal, closeModal, saveTask, deleteTask, getTaskById }) => {
    const task = modal.taskId ? getTaskById(modal.taskId) : null;
    const isEdit = !!task;
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            id="taskModal"
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-md flex items-center justify-center z-50 p-4"
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                className="bg-white/90 backdrop-blur-2xl rounded-3xl shadow-2xl w-full max-w-md p-8 border border-white/20"
            >
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
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Категория</label>
                                <select name="tag" defaultValue={isEdit ? `${task.tag}|${task.color}`: ""} className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm">
                                    <option value="Инфраструктура|blue">Инфраструктура</option> <option value="API|purple">API / Бэкенд</option> <option value="Логика|green">Логика / JS</option>
                                    <option value="Интерфейс|blue">Интерфейс / UI</option> <option value="Дизайн|orange">Дизайн / Контент</option> <option value="Документация|yellow">Документация</option>
                                    <option value="QA|teal">Тестирование</option> <option value="Менеджмент|slate">Менеджмент</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Колонка</label>
                                <select name="status" defaultValue={task?.status || modal.targetStatus || "todo"} className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm">
                                    <option value="todo">К выполнению</option>
                                    <option value="in-progress">В работе</option>
                                    <option value="testing">Тестирование</option>
                                    <option value="done">Готово</option>
                                </select>
                            </div>
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
            </motion.div>
        </motion.div>
    );
};

export default KanbanBoard;
