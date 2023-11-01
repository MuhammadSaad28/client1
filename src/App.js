import { Typography } from '@mui/material'
import { useState } from 'react'
import axios from 'axios'

const App = () => {

  const [input, setInput] = useState("");
  const [updateInput , setUpdateInput] = useState("");
  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);

  const post = () => {
    axios.post("http://localhost:2200/api/save", { task: input })
      .then(function (response) {
        setInput("");
        console.log(response.data);

      })
      .catch(function (error) {
        console.log(error.message);
      })
  }

  function getTasks() {

    axios.get(`http://localhost:2200/api/get`)
      .then((response) => {
        setTasks(response.data);
      })
      .catch((err) => { console.log(err) })
  }

  const editTask = (taskId) => {
    axios.get(`http://localhost:2200/api/get/${taskId}`)
      .then((response) => {
        setEditingTask({
          taskId,
          taskToEdit: response.data.task,
        });
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const updateTask = (event, taskId) => {
    event.preventDefault();
    axios.put(`http://localhost:2200/api/update/${taskId}`, { task: updateInput })
      .then(() => {
        setEditingTask(null);
        getTasks();
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const deleteTask = (taskId) => {
    axios.delete(`http://localhost:2200/api/delete/${taskId}`)
      .then(() => {
        getTasks();
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const deleteAllTasks = () => {
    axios.delete('http://localhost:2200/api/delete')
      .then(() => {
        getTasks();
      })
      .catch((error) => {
        console.error(error);
      });
  };


  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <Typography variant='h4' width='100vw' fontWeight="500" display="flex" justifyContent="center" sx={{ background: "#45A049" }}>
        To-Do List
      </Typography>

      <form onSubmit={post} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '55px', flexWrap: 'wrap' }}>

        <label style={{ paddingRight: '8px' }}>
          <Typography fontWeight='bold'>
            Enter Task
          </Typography>
        </label>
        <input type='text' placeholder='Enter Task' style={{ padding: "8px", marginRight: '8px', border: '1px solid black' }} onChange={(e) => { setInput(e.target.value) }} />

        <button type='submit' style={{ padding: '8px 12px', background: '#4CAF50', border: 'none', color: 'white', cursor: 'pointer' }} >Submit</button>

      </form>

      <button type='submit' style={{ padding: '8px 12px', background: '#4CAF50', border: 'none', color: 'white', cursor: 'pointer', marginTop: '30px' }} onClick={getTasks} >Show All Tasks</button>

      <div style={{ margin: '10px' }}>
      <div id="getAllTasks">
        {tasks.map((task, index) => (
          <div key={task._id} style={{fontWeight: '500' , fontSize: '20px'}}>
            {index + 1}) {task.task}
            {editingTask && editingTask.taskId === task._id ? (
              <form onSubmit={(e) => updateTask(e, task._id)}>
                <label style={{ paddingRight: '8px' , fontWeight: 'bold' , fontSize: '17px' }} >Update Task</label>
                <input type="text" name="taskInput1" placeholder="Enter Updated Task" defaultValue={editingTask.taskToEdit} style={{ padding: "8px", marginRight: '8px', border: '1px solid black' }} onChange={(e)=>{setUpdateInput(e.target.value)}} />
                <button type="submit" style={{ padding: '8px 12px', background: '#4CAF50', border: 'none', color: 'white', cursor: 'pointer' }} >Update</button>
              </form>
            ) : (
              <>
                <button onClick={() => editTask(task._id)} style={{margin: '0 4px'}}  >✏️</button>
                <button onClick={() => deleteTask(task._id)}>🗑️</button>
              </>
            )}
          </div>
        ))}
      </div>
      </div>


      <button type='submit' style={{ padding: '8px 12px', background: '#4CAF50', border: 'none', color: 'white', cursor: 'pointer', marginTop: '30px' }} onClick={deleteAllTasks} >Delete All Tasks</button>

    </div>
  )
}

export default App