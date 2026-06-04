import { Navigate } from 'react-router-dom';
import { getSession } from '../services/storage';

const PrivateRoute = ({ children }) => {
  const session = getSession();

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default PrivateRoute;
