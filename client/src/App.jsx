import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  PlusCircle,
  Trash2,
  ListTodo,
  Layers,
  Sparkles
} from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://3.108.249.182';

function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'Medium',
    status: 'To Do'
  });

  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await axios.get(`${API_URL}/api/tasks`);

      setTasks(response.data.data || []);
    } catch (err) {
      console.error('Failed to fetch tasks:', err);
      setError('Unable to load tasks. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.title.trim()) {
      return;
    }

    try {
      setError('');

      await axios.post(`${API_URL}/api/tasks`, formData);

      setFormData({
        title: '',
        description: '',
        priority: 'Medium',
        status: 'To Do'
      });

      await fetchTasks();
    } catch (err) {
      console.error('Failed to create task:', err);
      setError('Unable to create task. Please try again.');
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      setError('');

      await axios.put(`${API_URL}/api/tasks/${id}`, {
        status: newStatus
      });

      await fetchTasks();
    } catch (err) {
      console.error('Failed to update status:', err);
      setError('Unable to update task status.');
    }
  };

  const handleDelete = async (id) => {
    try {
      setError('');

      await axios.delete(`${API_URL}/api/tasks/${id}`);

      await fetchTasks();
    } catch (err) {
      console.error('Failed to delete task:', err);
      setError('Unable to delete task.');
    }
  };

  const totalTasks = tasks.length;

  const todoCount = tasks.filter(
    (task) => task.status === 'To Do'
  ).length;

  const inProgressCount = tasks.filter(
    (task) => task.status === 'In Progress'
  ).length;

  const completedCount = tasks.filter(
    (task) => task.status === 'Completed'
  ).length;

  return (
    <div className="container">
      <header className="header">
        <div className="logo-group">
          <div className="logo-icon">
            <Sparkles size={24} color="#ffffff" />
          </div>

          <div>
            <h1 className="logo-title">Cloud Task Manager</h1>
            <p
              style={{
                fontSize: '0.85rem',
                color: '#94a3b8'
              }}
            >
              MERN + AWS DevOps Platform
            </p>
          </div>
        </div>
      </header>

      {error && (
        <div
          style={{
            color: '#f87171',
            background: 'rgba(248, 113, 113, 0.1)',
            padding: '0.75rem',
            borderRadius: '0.5rem',
            marginBottom: '1rem'
          }}
        >
          {error}
        </div>
      )}

      <div className="stats-grid">
        <div className="stat-card">
          <Layers color="#38bdf8" size={32} />
          <div>
            <div className="stat-val">{totalTasks}</div>
            <div className="stat-lbl">Total Tasks</div>
          </div>
        </div>

        <div className="stat-card">
          <Clock color="#fbbf24" size={32} />
          <div>
            <div className="stat-val">{todoCount}</div>
            <div className="stat-lbl">To Do</div>
          </div>
        </div>

        <div className="stat-card">
          <AlertCircle color="#818cf8" size={32} />
          <div>
            <div className="stat-val">{inProgressCount}</div>
            <div className="stat-lbl">In Progress</div>
          </div>
        </div>

        <div className="stat-card">
          <CheckCircle2 color="#34d399" size={32} />
          <div>
            <div className="stat-val">{completedCount}</div>
            <div className="stat-lbl">Completed</div>
          </div>
        </div>
      </div>

      <div className="main-grid">
        <div className="card">
          <h2 className="card-title">
            <PlusCircle size={20} color="#38bdf8" />
            Create New Task
          </h2>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Task Title *</label>

              <input
                type="text"
                name="title"
                className="form-input"
                placeholder="e.g. Set up Docker container"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Description</label>

              <textarea
                name="description"
                className="form-textarea"
                rows="3"
                placeholder="Details about this task..."
                value={formData.description}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Priority</label>

              <select
                name="priority"
                className="form-select"
                value={formData.priority}
                onChange={handleChange}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Initial Status</label>

              <select
                name="status"
                className="form-select"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="To Do">To Do</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            <button type="submit" className="btn-submit">
              <PlusCircle size={18} />
              Add Task
            </button>
          </form>
        </div>

        <div className="card">
          <h2 className="card-title">
            <ListTodo size={20} color="#38bdf8" />
            Task Directory ({tasks.length})
          </h2>

          {loading ? (
            <p
              style={{
                color: '#94a3b8',
                textAlign: 'center',
                padding: '2rem'
              }}
            >
              Loading tasks...
            </p>
          ) : tasks.length === 0 ? (
            <div
              style={{
                textAlign: 'center',
                padding: '3rem 1rem',
                color: '#94a3b8'
              }}
            >
              <Layers
                size={48}
                style={{
                  opacity: 0.3,
                  marginBottom: '1rem'
                }}
              />

              <p>
                No tasks found. Create your first task using the form!
              </p>
            </div>
          ) : (
            <div className="task-list">
              {tasks.map((task) => (
                <div key={task._id} className="task-card">
                  <div style={{ flex: 1 }}>
                    <div className="task-title">{task.title}</div>

                    {task.description && (
                      <div className="task-desc">
                        {task.description}
                      </div>
                    )}

                    <div className="badge-group">
                      <span
                        className={`badge badge-${task.status
                          .toLowerCase()
                          .replace(/\s+/g, '-')}`}
                      >
                        {task.status}
                      </span>

                      <span
                        className={`badge badge-${task.priority.toLowerCase()}`}
                      >
                        {task.priority} Priority
                      </span>
                    </div>
                  </div>

                  <div className="task-actions">
                    <select
                      className="form-select"
                      style={{
                        padding: '0.35rem 0.5rem',
                        fontSize: '0.8rem',
                        width: 'auto'
                      }}
                      value={task.status}
                      onChange={(event) =>
                        handleStatusChange(
                          task._id,
                          event.target.value
                        )
                      }
                    >
                      <option value="To Do">To Do</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                    </select>

                    <button
                      type="button"
                      className="action-btn delete"
                      onClick={() => handleDelete(task._id)}
                      title="Delete task"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;