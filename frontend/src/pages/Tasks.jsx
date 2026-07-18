import { useState } from 'react';
import { FiPlus } from 'react-icons/fi';
import Layout from '../components/Layout';
import SearchBar from '../components/SearchBar';
import FilterDropdown from '../components/FilterDropdown';
import SortDropdown from '../components/SortDropdown';
import TaskCard from '../components/TaskCard';
import TaskFormModal from '../components/TaskFormModal';
import DeleteConfirmModal from '../components/DeleteConfirmModal';
import EmptyState from '../components/EmptyState';
import Spinner from '../components/Spinner';
import { useTasks } from '../context/TaskContext';
import { useTaskFilters } from '../hooks/useTaskFilters';

const Tasks = () => {
  const { tasks, loading, createTask, updateTask, deleteTask, updateStatus } = useTasks();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [sort, setSort] = useState('Latest');
  const [formTask, setFormTask] = useState(undefined); // undefined = closed, null = create, object = edit
  const [deleteTarget, setDeleteTarget] = useState(null);

  const filteredTasks = useTaskFilters(tasks, { search, filter, sort });

  const handleToggleStatus = (task) => {
    updateStatus(task.id, task.status === 'Completed' ? 'Pending' : 'Completed');
  };

  return (
    <Layout>
      <div className="page-header">
        <h1 className="page-title">Tasks</h1>
        <button className="btn btn-primary" onClick={() => setFormTask(null)}>
          <FiPlus /> Add Task
        </button>
      </div>

      <div className="toolbar">
        <SearchBar value={search} onChange={setSearch} />
        <FilterDropdown value={filter} onChange={setFilter} />
        <SortDropdown value={sort} onChange={setSort} />
      </div>

      {loading ? (
        <Spinner />
      ) : filteredTasks.length === 0 ? (
        <EmptyState
          message="No tasks match your criteria"
          action={
            <button className="btn btn-primary" onClick={() => setFormTask(null)}>
              <FiPlus /> Create your first task
            </button>
          }
        />
      ) : (
        <div className="task-grid">
          {filteredTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={setFormTask}
              onDelete={setDeleteTarget}
              onToggleStatus={handleToggleStatus}
            />
          ))}
        </div>
      )}

      {formTask !== undefined && (
        <TaskFormModal
          task={formTask}
          onClose={() => setFormTask(undefined)}
          onSubmit={(data) => (formTask ? updateTask(formTask.id, data) : createTask(data))}
        />
      )}

      {deleteTarget && (
        <DeleteConfirmModal
          task={deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onConfirm={deleteTask}
        />
      )}
    </Layout>
  );
};

export default Tasks;
