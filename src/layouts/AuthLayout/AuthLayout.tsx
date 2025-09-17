import Navbar from '../../components/Navbar/Navbar';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/auth';
import { useEffect } from 'react';

function AuthLayout() {
    const isLoggedIn = useAuthStore((state) => state.isAuthenticated);
    const userRole = useAuthStore((state) => state.role);
    const navigate = useNavigate();

    useEffect(() => {
      if (isLoggedIn) {
        if (userRole === "admin") {
          navigate("/admin/dashboard");
        } else {
          navigate("/");
        }
      }
    }, [isLoggedIn, userRole, navigate]);
    return (
        <>
            <Navbar />

            <Outlet />
        </>
    );
}

export default AuthLayout;
