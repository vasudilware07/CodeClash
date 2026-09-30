import { useEffect, useContext } from 'react';
import AppRoutes from "./routes/AppRoutes";
import { stompService } from './core/sockets/stompClient';
import { AuthContext, type AuthContextType } from './core/context/AuthContext'; // 👈 Import your context and its type

const App = () => {
  // Use the context to get the authentication state
  const { isAuthenticated } = useContext(AuthContext) as AuthContextType;

  useEffect(() => {
    // This logic will now run whenever the user logs in or out
    if (isAuthenticated) {
      console.log("User is authenticated, connecting WebSocket...");
      stompService.connect();
    } else {
      console.log("User is not authenticated, disconnecting WebSocket...");
      stompService.disconnect();
    }

    // Disconnect when the component unmounts
    return () => {
      stompService.disconnect();
    };
  }, [isAuthenticated]); // Run this effect when the auth state changes

  return (
    <div className="bg-grid" style={{ background: 'var(--bg-base)', minHeight: '100vh' }}>
      <AppRoutes />
    </div>
  );
};

export default App;