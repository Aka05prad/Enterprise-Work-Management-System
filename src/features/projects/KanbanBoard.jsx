import { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { useDispatch } from 'react-redux';
import { Plus } from 'lucide-react';
import { moveTask } from '../tasks/tasksSlice';
import TaskCard from '../tasks/TaskCard';
import TaskDetailModal from '../tasks/TaskDetailModal';
import TaskFormModal from '../tasks/TaskFormModal';
import { toast } from 'react-toastify';

const COLUMNS = [
  { id: 'todo',        label: 'To do',       color: 'bg-gray-400',    count_color: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400' },
  { id: 'in_progress', label: 'In progress', color: 'bg-blue-500',    count_color: 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' },
  { id: 'in_review',   label: 'In review',   color: 'bg-yellow-500',  count_color: 'bg-yellow-50 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400' },
  { id: 'done',        label: 'Done',        color: 'bg-green-500',   count_color: 'bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400' },
];

const KanbanBoard = ({ tasks, projectId }) => {
  const dispatch = useDispatch();
  const [selectedTask,  setSelectedTask]  = useState(null);
  const [editingTask,   setEditingTask]   = useState(null);
  const [detailOpen,    setDetailOpen]    = useState(false);
  const [formOpen,      setFormOpen]      = useState(false);
  const [newTaskStatus, setNewTaskStatus] = useState('todo');

  const tasksByStatus = (status) => tasks.filter((t) => t.status === status);

  const onDragEnd = (result) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    const newStatus = destination.droppableId;
    dispatch(moveTask({ id: draggableId, status: newStatus }));
    toast.success(`Task moved to ${COLUMNS.find((c) => c.id === newStatus)?.label}`);
  };

  const handleAddTask = (status) => {
    setNewTaskStatus(status);
    setEditingTask(null);
    setFormOpen(true);
  };

  const handleOpenDetail = (task) => {
    setSelectedTask(task);
    setDetailOpen(true);
  };

  const handleEditFromDetail = () => {
    setEditingTask(selectedTask);
    setDetailOpen(false);
    setFormOpen(true);
  };

  return (
    <>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex gap-4 overflow-x-auto pb-4 min-h-[600px]">
          {COLUMNS.map((col) => {
            const colTasks = tasksByStatus(col.id);
            return (
              <div key={col.id} className="flex flex-col shrink-0 w-72">
                {/* Column header */}
                <div className="flex items-center justify-between mb-3 px-1">
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${col.color}`} />
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                      {col.label}
                    </span>
                    <span className={`text-xs font-bold px-1.5 py-0.5 rounded-md ${col.count_color}`}>
                      {colTasks.length}
                    </span>
                  </div>
                  <button
                    onClick={() => handleAddTask(col.id)}
                    className="p-1 rounded-lg text-gray-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/30 transition-colors"
                    title={`Add task to ${col.label}`}
                  >
                    <Plus size={15} />
                  </button>
                </div>

                {/* Droppable column */}
                <Droppable droppableId={col.id}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`
                        flex-1 flex flex-col gap-2.5 p-2 rounded-xl min-h-[500px]
                        transition-colors duration-200
                        ${snapshot.isDraggingOver
                          ? 'bg-primary-50 dark:bg-primary-900/10 border-2 border-dashed border-primary-300 dark:border-primary-700'
                          : 'bg-gray-50 dark:bg-gray-800/50 border-2 border-transparent'
                        }
                      `}
                    >
                      {colTasks.map((task, index) => (
                        <Draggable key={task.id} draggableId={task.id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              <TaskCard
                                task={task}
                                onClick={() => handleOpenDetail(task)}
                                dragging={snapshot.isDragging}
                              />
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}

                      {/* Empty column prompt */}
                      {colTasks.length === 0 && !snapshot.isDraggingOver && (
                        <div className="flex flex-col items-center justify-center flex-1 py-8 text-gray-300 dark:text-gray-600 gap-2">
                          <div className={`w-8 h-8 rounded-full ${col.color} opacity-20`} />
                          <p className="text-xs">Drop tasks here</p>
                        </div>
                      )}
                    </div>
                  )}
                </Droppable>
              </div>
            );
          })}
        </div>
      </DragDropContext>

      {/* Task detail modal */}
      <TaskDetailModal
        isOpen={detailOpen}
        onClose={() => setDetailOpen(false)}
        task={selectedTask}
        onEdit={handleEditFromDetail}
      />

      {/* Task form modal */}
      <TaskFormModal
        isOpen={formOpen}
        onClose={() => setFormOpen(false)}
        task={editingTask}
        defaultProjectId={projectId || ''}
      />
    </>
  );
};

export default KanbanBoard;