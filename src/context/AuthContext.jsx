import { useState, useEffect, createContext } from "react";

const UserContext = createContext();


const AuthProvider =({children}) =>{
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(()=>{
    const auth = localStorage.getItem('currentUser');
    if(auth){
      setCurrentUser(JSON.parse(auth));
    }
  },[]);


  const login = (user)=>{
    setCurrentUser(user);
    localStorage.setItem('currentUser', JSON.stringify(user));
  }

  const logout = ()=>{
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
  }


  return (
    <UserContext.Provider value={{currentUser, login, logout}} >
      {children}
    </UserContext.Provider>
  )
}

export {UserContext, AuthProvider};