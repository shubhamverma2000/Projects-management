import { useEffect, useState, useRef, useContext} from "react"
import axios from "axios";
import Urls from "../api/baseUrl";
import Modal from "./Modal";
import { UserContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const TasksList = () => {
  const [tasks, setTasks] = useState([]);

  //pagination
  const [currentPage, setCurrentPage] = useState(1);
  //state used for manage if any task is found on date change.
  const [foundTask, setFoundTask] = useState(true);


  const [filterDate, setfilterDate] = useState(getTodayDateString());

  const [editedTaskId, setEditedtaskId] = useState(null);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedDescription, setEditedDescription] = useState('');

  //modal
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] =useState(null);
  const itemsPerPage = 4;

  //refresh in 5 seconds
  const [refresh, setRefresh] = useState(false);

  // setInterval(()=>{
  //   setRefresh(!refresh);
  //   console.log(refresh);
  // },5000);

  //user-context
  const {currentUser, logout} = useContext(UserContext);
  const navigate = useNavigate();   
  useEffect(()=>{
    //fetchTasks(); 
    if(currentUser){
      fetchTasksByDate();
    }
    // setDateRange();
  },[filterDate, tasks, editedTaskId, currentUser]);

  //fetch all task
  const fetchTasks = async()=>{
    try{
      const response = await axios.get(`${Urls.baseUrl}/api/todos`);

      //since we recieve the list of duplicate objects because of seperate todoDay and dayId,
      //so the approach is to reduce the list into unique todos as we push the objects of dayId and day
      //in the days field

      //console.log(response.data);
      const aggregateTodos = aggregationOfTodos(response);

      //console.log(response.data);
      //console.log(aggregateTodos);

      setTasks(aggregateTodos);  
    }catch(error){
      console.error("Error in fetching the tasks --" + error);
    }
  }


  //wrapping up of the data after fetching
  const aggregationOfTodos = (response)=>{

    const aggregateTodos = response.data.reduce((acc, todo)=>{
        const existingTodoIndex = acc.findIndex(item => item.todoId === todo.todoId);
        if(existingTodoIndex !== -1){
          acc[existingTodoIndex].days.push({dayId:todo.dayId , day: todo.day});
        }
        //if the index is not present
        else{
          acc.push({
            todoId: todo.todoId,
            name: todo.name,
            title: todo.title,
            description: todo.description,
            email: todo.email,
            phoneNumber: todo.phoneNumber,
            date: todo.date,
            priority: todo.priority,
            days: [{ dayId: todo.dayId, day: todo.day }],
            file: todo.file,
            time: todo.time
          })
        }
        return acc;
      },[]);

      return aggregateTodos;
  }

  //deleting tasks
  const deleteTask = async(todoId)=>{
    try{
      const response= axios.delete(`${Urls.baseUrl}/api/todos/${todoId}`);
    }catch(error){
      console.error("Error in deleting the task");
    }
  }

  //date filter functionality
  function getTodayDateString() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  const fetchTasksByDate = async() =>{
    try{
      const response = await axios.get(`${Urls.baseUrl}/api/todos/${currentUser}/${filterDate}`);
      if(response.data.length !== 0){
        
        //console.log(response.data);
        const aggregateTodos = aggregationOfTodos(response);

        //console.log(aggregateTodos);
        //setTasks([]);
        //console.log(tasks);
        setTasks(aggregateTodos);
        setFoundTask(true);
      }else{
        //console.log(response.data);
        setFoundTask(false);
        //throw error;
      }
    }catch(error){
      console.error("Error in fetching the tasks by the date: " + error);
    }
  }

  const handleDateChange = async(e) =>{
    setfilterDate(e.target.value);
    //console.log(date);
  }

  //update functionality
  const handleEditClick = (task) =>{
    setEditedtaskId(task.todoId);
    setEditedTitle(task.title);
    setEditedDescription(task.description);
  }

  const updateTask = async(todoId) =>{
    try{

      const data = new URLSearchParams();
      data.append('title', editedTitle);
      data.append('description', editedDescription);

      //console.log(updatedTask);
      await axios.put(`${Urls.baseUrl}/api/todos/${todoId}`, data);
      setEditedtaskId(null);
    }catch(error){
      alert("Error in updating the task" + error);
    }
  }


  //handlemodal
  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const handleModalItem = (task) =>{
    setSelectedItem(task);
    openModal();
  }

  //pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTodos =  tasks.slice(indexOfFirstItem, indexOfLastItem);

  //function for changing the page
  const paginate = pageNumber =>setCurrentPage(pageNumber);

  const logoutSession = async() =>{
    await logout();
    navigate('/');
  }

  return (
    <div className='Tasks'>
      <div className="tasks_header">
         <p>Your Tasks</p>
         <input
            type="date"
            name="date"
            value={filterDate}
            onChange={handleDateChange}
        />
        <div className="nav">
          <button onClick={()=>navigate('/addtask')}>Add Task</button>
          <button onClick={logoutSession}>Logout</button>
        </div>
      </div>
      {foundTask ? <div className="taskContainer">
          <ul className="list">
              { currentTodos.map((task)=>(
                <li key={task.todoId} className="todo-item">

                  { editedTaskId === task.todoId ? (

                    <div className="item">
                      <input type="text" 
                        value={editedTitle}
                        onChange={(e)=> setEditedTitle(e.target.value)}
                      />
                      <input type="text" 
                        value={editedDescription}
                        onChange={(e)=> setEditedDescription(e.target.value)}
                      />

                      <ul className="days">{task.days.map((item)=>(
                          <li key={item.dayId}>{item.day}</li>
                      ))}</ul>

                      <div className="actions">
                        <button className="update"
                          onClick={()=>{
                            updateTask(task.todoId)
                          }}
                        >
                          Save
                        </button>
                        <button className="delete" onClick={()=>deleteTask(task.todoId)}>Delete</button>
                      </div>
                    </div>

                  ) : (
                      <div className="item" onClick={()=>handleModalItem(task)}> 
                        <p className="title">{ task.title}</p>
                        <p className="description">{task.description}</p>
                        <ul className="days">{task.days.map((item)=>(
                            <li key={item.dayId}>{item.day}</li>
                        ))}</ul>
                        <div className="actions">
                          <button className="update"
                            onClick={()=>handleEditClick(task)}
                          > Update
                          </button>
                          <button className="delete" onClick={()=>deleteTask(task.todoId)}>Delete</button>
                        </div>
                      </div>   
                  )}
                  
                </li>
              ))}
              {modalOpen && <Modal item={selectedItem} onClose={closeModal} />}
          </ul>
        </div> : <div className="item">
                      <p>No tasks for this day!</p>
                 </div>
      }
      
      {/* Pagination div */}
      <div className="paginationContainer">
        <ul className="pagination">
          {Array.from({length:Math.ceil(tasks.length/itemsPerPage) }, (_, index)=>(
            <li key={index} className={currentPage === index+1 ? 'active': ''}>
              <button onClick={()=> paginate(index+1)}>{index+1}</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default TasksList;
