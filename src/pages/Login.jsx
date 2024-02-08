import '../assets/styles/loginRegister.scss';
import { useNavigate } from 'react-router-dom';
import { useState, useContext} from 'react';
import { UserContext } from '../context/AuthContext';
import Urls from '../api/baseUrl';
import axios from 'axios';



const Login = () => {
  const [loginUser, setLoginUser] = useState({
    email:'',
    password: ''
  });
  const {login} = useContext(UserContext);
  const navigate = useNavigate();
  const [errors, setErrors]=useState({});

  //handleChange
  const handleChange =(e)=>{
    const {name, value} = e.target;
    setLoginUser((prevData) =>({
        ...prevData,
        [name] : value,
    }));
  }
  
  const validateForm = ()=>{
    let errors ={};

    if(!loginUser.email){
        errors.email = 'Email is required';
    }else if (!/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(loginUser.email)){
        errors.email = 'Invalid email address';
    }

    if(!loginUser.password){
        errors.password = 'Password is required';
    }

    setErrors(errors);  
    return Object.keys(errors).length===0;
  }

  const handleSubmit = async (e) =>{
    e.preventDefault();
    let response;
    try{
        if(validateForm()){
            // const formData = new FormData();
            // const loginUserJson = JSON.stringify(loginUser);
            // formData.append('login' , loginUserJson);
            await axios.post(`${Urls.baseUrl}/user/login` , loginUser);
            await login(loginUser.email);
            navigate('/addTask');
            setLoginUser({
                email:'',
                password:''
              });
        }   
        else{
            console.log("Error in the validation");
        }
    }catch(error){
        setErrors({...errors, submitError: "Failed to LogIn. Try Again."});
        console.log("Error in login:" +error);
    }
  }

  return (
    <div className='login'>
        <div className="loginCard">
            <div className="heading">
                <p>Login</p>
            </div>
            {errors && <div style={{ color: 'red' }}>{errors.submitError}</div>}
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    name="email"
                    placeholder="Enter Email"
                    onChange={handleChange}
                    value={loginUser.email}
                />
                {errors.email && <div style={{color:"red"}}>{errors.email}</div>}
                <input
                    type="password"
                    name="password"
                    placeholder="Enter Password"
                    onChange={handleChange}
                    value={loginUser.password}
                />
                {errors.password && <div style={{color:"red"}}>{errors.password}</div>}
                <button type="submit">Submit</button>
            </form>
            <span>New here? <a href="/register">Register</a></span>
        </div>
    </div>
  )
}

export default Login