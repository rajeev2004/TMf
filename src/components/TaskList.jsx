import React, { useState, useEffect } from "react";
import axios from 'axios';
import '../components/styles.css';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import FileDownloadDoneIcon from '@mui/icons-material/FileDownloadDone';
import CancelIcon from '@mui/icons-material/Cancel';
function TaskList() {
  const [tasks, setTasks] = useState([]); 
  const [newTask, setNewTask] = useState({ title: '', description: '', due_date: '' });
  const [editableTask, setEditableTask] = useState(null);
  const backendURL = "https://task-management-backend-pink.vercel.app";
  async function getTasks() {
    try{
      const result = await axios.get(`${backendURL}/api/tasks`);
      setTasks(result.data);
    }catch{
      console.error("Error fetching tasks:", error);
      alert("Failed to fetch tasks. Please check the console for details.");
    }
    
  }
  async function addTask(e) {
    e.preventDefault();
    const result = await axios.post(`${backendURL}/api/tasks`, newTask);
    setTasks((prevTasks) => [...prevTasks, result.data]);
    setNewTask({ title: '', description: '', due_date: '' });
  }
  async function deleteTask(id) {
    await axios.delete(`${backendURL}/api/tasks/${id}`);
    setTasks(tasks.filter((task) => task.id !== id));
  }
  async function updateTask(id) {
    const result = await axios.put(`${backendURL}/api/tasks/${id}`, editableTask);
    setTasks((prevTasks) => prevTasks.map((task) => task.id === id ? result.data : task));
    setEditableTask(null);
  }

  useEffect(() => {
    getTasks();
  }, []);
  function handleUpdateClick(task) {
    setEditableTask({ ...task });
  }
  function handleEditableChange(e) {
    const { name, value } = e.target;
    setEditableTask((prev) => ({ ...prev, [name]: value }));
  }
  function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, options);
  }

  return (
    <div>
      <h2>Task List</h2>
      <form onSubmit={addTask}>
        <label>Title</label>
        <input
          type="text"
          value={newTask.title}
          onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
          required
        />
        <label>Description</label>
        <input
          type="text"
          value={newTask.description}
          onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
          required
        />
        <label>Due Date</label>
        <input
          type="date"
          value={newTask.due_date}
          onChange={(e) => setNewTask({ ...newTask, due_date: e.target.value })}
          required
        />
        <button type="submit">
            <AddIcon style={{ marginRight: '5px' }} />
        </button>
      </form>
      <div className="task-list">
        {tasks.map((task) => (
          <div key={task.id} className="task-item">
            {editableTask && task.id === editableTask.id ? (
              <div className="editable-task">
                <input
                  type="text"
                  name="title"
                  placeholder="Title"
                  value={editableTask.title}
                  onChange={handleEditableChange}
                  required
                />
                <input
                  type="text"
                  name="description"
                  placeholder="Description"
                  value={editableTask.description}
                  onChange={handleEditableChange}
                  required
                />
                <input
                  type="date"
                  name="due_date"
                  placeholder="Due Date"
                  value={editableTask.due_date}
                  onChange={handleEditableChange}
                  required
                />
                <button className="update" onClick={() => updateTask(task.id)}><FileDownloadDoneIcon style={{ marginRight: '5px' }} /></button>
                <button className="delete" onClick={() => setEditableTask(null)}><CancelIcon style={{ marginRight: '5px' }} /></button>
              </div>
            ) : (
              <div className="task-content">
                <div className="task-title"><strong>Title:</strong> {task.title}</div>
                <div className="task-description"><strong>Description:</strong> {task.description}</div>
                <div className="task-due"><strong>Due Date:</strong> {formatDate(task.due_date)}</div>
                <div className="task-created"><strong>Created at:</strong> {formatDate(task.created_at)}</div>
                <div className="task-actions">
                  <button className="update" onClick={() => handleUpdateClick(task)}><EditIcon style={{ marginRight: '5px' }} /></button>
                  <button className="delete" onClick={() => deleteTask(task.id)}><DeleteIcon style={{ marginRight: '5px' }} /></button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default TaskList;
