import React, { useState, useEffect } from "react";
import axios from 'axios';
import '../components/styles.css';
import Header from './Header.jsx';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import FileDownloadDoneIcon from '@mui/icons-material/FileDownloadDone';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
function TaskList(){
  const [tasks,setTasks]=useState([]);
  const [newTask,setNewTask]=useState({title:'',description:'',due_date:'' });
  const [editableTask,setEditableTask]=useState(null);
  const [filteredTasks,setFilteredTasks]=useState([]);
  const backendURL="http://localhost:5000";
  async function getTasks(){
    try{
      const result=await axios.get(`${backendURL}/api/tasks`);
      setTasks(result.data);
      setFilteredTasks(result.data);
    }catch{
      console.error("Error fetching tasks:", error);
      alert("Failed to fetch tasks. Please check the console for details.");
    }
    
  }
  async function addTask(e){
    e.preventDefault();
    const result=await axios.post(`${backendURL}/api/tasks`, newTask);
    setTasks((prevTasks)=>[...prevTasks,result.data]);
    setNewTask({title:'',description:'',due_date: ''});
    setFilteredTasks((prevFilteredTasks)=>[...prevFilteredTasks,result.data]);
  }
  async function deleteTask(id){
    await axios.delete(`${backendURL}/api/tasks/${id}`);
    setTasks(tasks.filter((task)=>task.id!== id));
    setFilteredTasks(filteredTasks.filter((task)=>task.id!==id));
  }
  async function updateTask(id){
    const result=await axios.put(`${backendURL}/api/tasks/${id}`, editableTask);
    setTasks((prevTasks)=>prevTasks.map((task)=>task.id===id ? result.data:task));
    setFilteredTasks((prevFilteredTasks)=>prevFilteredTasks.map((task)=>task.id===id?result.data:task));
    setEditableTask(null);
  }

  useEffect(() => {
    getTasks();
  },[]);
  function handleUpdateClick(task) {
    setEditableTask({...task});
  }
  function handleEditableChange(e) {
    const { name,value }=e.target;
    setEditableTask((prev) =>({ ...prev,[name]: value }));
  }
  function formatDate(dateString) {
    const options={year:'numeric',month:'long',day:'numeric'};
    const date=new Date(dateString);
    return date.toLocaleDateString(undefined, options);
  }
  async function toggleTaskCompletion(id,currentStatus){
    try{
      const updatedTask={
        is_completed:!currentStatus
      }
      console.log("Sending update:", updatedTask); 
      const result=await axios.put(`${backendURL}/api/tasks/complete/${id}`,updatedTask);
      console.log("Update successful:", result.data);
      setTasks((prevTasks)=>prevTasks.map((task)=>task.id===id?result.data:task));
      setFilteredTasks((prevFilteredTasks)=>prevFilteredTasks.map((task)=>task.id===id?result.data:task));
    }catch(error){
      console.error("Error updating task completion:", error);
      alert("Failed to update task. Please check the console for details.");
    }
  }
  function handleFilter(criteria){
    const currentDate=new Date();
    let filtered=tasks;
    if(criteria==="completed"){
      filtered=tasks.filter((task)=>task.is_completed);
    }else if(criteria==="pending"){
      filtered=tasks.filter((task)=>!task.is_completed);
    }else if(criteria==="overdue"){
      filtered=tasks.filter((task)=>new Date(task.due_date) < currentDate);
    }else{
      filtered=tasks;
    }
    setFilteredTasks(filtered);
  }
  async function handleSearch(title){
    try{
      const result=await axios.get(`${backendURL}/api/tasks/search`,{params:{title},
      });
      if(result.data.length==0){
        alert("no task found");
      }else{
        setFilteredTasks(result.data);
      }
    }catch(error){
      console.error("error searching the tasks",error.message);
      res.status(404).json({message:'task not found'});
    }
  }
  return(
    <div>
      <Header
        onFilter={handleFilter}
        onSearch={handleSearch}
        onHome={()=>setFilteredTasks(tasks)}
      />
      <form onSubmit={addTask}>
        <label>Title</label>
        <input
          type="text"
          value={newTask.title}
          onChange={(e)=>setNewTask({...newTask,title:e.target.value})}
          required
        />
        <label>Description</label>
        <input
          type="text"
          value={newTask.description}
          onChange={(e)=>setNewTask({...newTask,description:e.target.value})}
          required
        />
        <label>Due Date</label>
        <input
          type="date"
          value={newTask.due_date}
          onChange={(e)=>setNewTask({...newTask,due_date:e.target.value })}
          required
        />
        <button type="submit">
            <AddIcon/>
        </button>
      </form>
      <div className="task-list">
        {filteredTasks.map((task)=>(
          <div key={task.id} className="task-item">
            {editableTask && task.id===editableTask.id ?(
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
                <button className="update" onClick={()=> updateTask(task.id)}><FileDownloadDoneIcon/></button>
                <button className="delete" onClick={()=> setEditableTask(null)}><CancelIcon /></button>
              </div>
            ):(
              <div className="task-content">
                <div className="task-title"><strong>Title:</strong> {task.title}</div>
                <div className="task-description"><strong>Description:</strong> {task.description}</div>
                <div className="task-due"><strong>Due Date:</strong> {formatDate(task.due_date)}</div>
                <div className="task-created"><strong>Created at:</strong> {formatDate(task.created_at)}</div>
                <div className="task-actions">
                  <button className="update" onClick={()=>handleUpdateClick(task)}><EditIcon/></button>
                  <button className="delete" onClick={()=>deleteTask(task.id)}><DeleteIcon/></button>
                  <button className="complete"  onClick={()=>toggleTaskCompletion(task.id,task.is_completed)}>
                    {task.is_completed?(
                      <CheckCircleIcon style={{color:'green'}} />
                    ):(
                      <CheckCircleIcon style={{color:'gray'}} />
                    )}
                  </button>
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
