import { Fragment, useContext } from "react";
import { Route, Routes } from "react-router-dom";
import { UserContext } from "../context/AuthContext";
import AddTaskForm from "../pages/AddTaskForm";
import Todos from "../pages/Todos";
import NoPage from "../pages/NoPage";
import Login from "../pages/Login";
import Register from "../pages/Register";

const PageRouter = () => {
  const {currentUser} = useContext(UserContext);
  return(
    <Fragment>
        <Routes path="/">
            {!currentUser && (
                <Fragment>
                    <Route index element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/*" element={<Login/>} />
                </Fragment>
            )}
           
            {currentUser && (
                <Fragment>
                    <Route path="/addTask" element={<AddTaskForm/>} />
                    <Route path ="/todos" element ={<Todos/>}/>
                    <Route path="/*" element={<AddTaskForm/>} />
                </Fragment>
            )}
          </Routes>
    </Fragment>
  )
};
export default PageRouter;