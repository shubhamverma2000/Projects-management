import React, { useContext } from 'react';
import { Route, Navigate } from 'react-router-dom';
import { UserContext } from'../context/AuthContext';

const ProtectedRoute = ({element, ...props}) => {
    const {currentUser} = useContext(UserContext);

    return (
        <Route
            {...props}
            element={currentUser ? element : <Navigate to="/" />}
            />
    )
}

export default ProtectedRoute;