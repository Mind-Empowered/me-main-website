import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '../services/supabase-client';

const ProtectedRoute = ({ children }) => {
  const [user, setUser] = useState(null); 
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };

    checkUser();
  }, []);

  if (loading) return <div>Loading...</div>;
  
  if (!user) return <Navigate to="/signin" />;
  
  return children;
};

export default ProtectedRoute;