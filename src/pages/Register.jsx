import { useState } from 'react';
import '../assets/styles/loginRegister.scss';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Urls from '../api/baseUrl';

const Register = () => {
  const [user, setUser] = useState({
    name:'',
    email:'',
    phoneNumber: '',
    password:'',
    role:''
  });
  const navigate = useNavigate();

  const [confirmPassword, setComfirmPassword] = useState('');
  const [errors, setErrors]=useState({});

  //handleChange
  const handleChange =(e)=>{
    const {name, value, type, checked, files} = e.target;
    setUser((prevData) =>({
        ...prevData,
        [name] : value,
    }));
  }
  
  const validateForm = ()=>{
    let errors ={};

    if(!user.name){
        errors.name = "Name is required";
    }else if(!/^.{0,50}$/.test(user.name)){
        errors.name ="Title can only contain 50 characters or less"
    }

    if(!user.email){
        errors.email = 'Email is required';
    }else if (!/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(user.email)){
        errors.email = 'Invalid email address';
    }

    if(!user.phoneNumber){
        errors.phoneNumber = 'Phone number is required';
    } else if (!/^[789]\d{9}$/.test(user.phoneNumber)){
        errors.phoneNumber = 'Invalid Phone Number';
    }

    if(!user.password){
        errors.password = 'Password is required';
    } else if (user.password !== confirmPassword){
        errors.password = "The passwords don't match";
        setComfirmPassword('');
    }
    console.log(errors);
    setErrors(errors);  
    return Object.keys(errors).length===0;
  }

  const handleSubmit = async (e) =>{
    e.preventDefault();
    try{
        if(validateForm()){
            const formData = new FormData();
            const userJson = JSON.stringify(user);
            formData.append('user' , userJson);
            
            await axios.post(`${Urls.baseUrl}/user/registration` , formData ,{
                headers: {
                    'Content-Type': 'form-data',
                },
            });
            console.log("Form submitted successfully");
            navigate('/');
            setUser({
                name:'',
                email:'',
                phoneNumber: '',
                password:'',
                role:''
              });
        }   
        else{
            console.log("Error in the validation");
        }
    }catch(error){
        setErrors({...errors, submitError: "Failed to Submit. Try Again."});
        console.log("Error in submission" +error);
    }
  }


  return (
    <div className='login'>
        <div className="registerCard">
            <div className="heading">
                <h1>Register</h1>
            </div>
            {errors && <div style={{ color: 'red' }}>{errors.submitError}</div>}
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    name="email"
                    placeholder="Enter Email"
                    onChange={handleChange}
                    value={user.email}
                />
                {errors.email && <div style={{color:"red"}}>{errors.email}</div>}
                <input
                    type="name"
                    name="name"
                    placeholder="Enter your name"
                    onChange={handleChange}
                    value={user.name}

                />
                {errors.name && <div style={{color:"red"}}>{errors.name}</div>}
                <select
                    name="role"
                    onChange={handleChange}
                    value={user.role}
                >
                    <option value="">Role</option>
                    <option value="manager">Manager </option>
                    <option value="employee">Employee</option>
                    <option value="admin">Admin</option>
                </select>
                {errors.role && <div style={{color:"red"}}>{errors.role}</div>}
                <input
                    type="tel"
                    name="phoneNumber"
                    placeholder="Phone Number"
                    onChange={handleChange}
                    value={user.phoneNumber}

                />
                {errors.phoneNumber && <div style={{color:"red"}}>{errors.phoneNumber}</div>}
                <input
                    type="password"
                    name="password"
                    placeholder="Enter Password"
                    onChange={handleChange}
                    value={user.password}
                />
                 <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e)=>setComfirmPassword(e.target.value)}
                />
                 {errors.password && <div style={{color:"red"}}>{errors.password}</div>}
                <button type="submit">Submit</button>
            </form>
            <span>Already a member? <a href="/">Login</a></span>
        </div>
    </div>
  )
}

export default Register

