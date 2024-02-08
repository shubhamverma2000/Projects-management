import { Fragment } from "react";
import { BrowserRouter as Router} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
//import ProtectedRoute from "./ProtectedRoute/ProtectedRoute";
import PageRouter from "./components/PageRouter";

function App() {
  return (
    <>  
      <Router>
        <AuthProvider>
          <PageRouter/>
        </AuthProvider>
      </Router>
    </> 
  )
}

export default App
