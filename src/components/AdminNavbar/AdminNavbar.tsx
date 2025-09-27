import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/auth';
import Swal from 'sweetalert2';
import { getAuthClient } from '../../api/grpc/client';
import { useGrpcApi } from '../../hooks/useGrpcApi';

function AdminNavbar() {
    const navigate = useNavigate();
    const logout = useAuthStore((state) => state.logout);
    const logoutApi = useGrpcApi();

    const logOutHandler = async () => {
        const result = await Swal.fire({
       
          title: "Yakin ingin keluar?",
          showCancelButton: true,
          cancelButtonText: "Batal",
          confirmButtonText: "OK",
        });
        if (!result.isConfirmed) {
          return;
        }
        try {
          await logoutApi.apiCall(getAuthClient().logout({}));
            logout();
            localStorage.removeItem("access_token");
            Swal.fire({
              icon: "success",
              title: "Berhasil keluar",
              confirmButtonText: "OK",
            });
            navigate("/login");
          return;
        } catch (error) {
          console.error("Logout failed:", error);
          alert("Terjadi kesalahan jaringan atau server.");
        }
      };
    return (
        <nav className="custom-navbar navbar navbar-expand-md navbar-dark bg-dark" aria-label="Admin navigation bar">
            <div className="container">
                <Link className="navbar-brand" to="/admin">
                    Furni<span>.</span> Admin
                </Link>

                <div className="d-flex align-items-center">
                    <ul className="custom-navbar-cta navbar-nav mb-2 mb-md-0">
                        <li className="nav-item margin-right">
                            <Link className="nav-link" to="/admin/profile/change-password">
                                <img src="/images/user.svg" alt="Admin Profile" />
                            </Link>
                        </li>
                        <li className="nav-item">
                            <button
                                className="nav-link border-0 bg-transparent"
                                onClick={logOutHandler}
                            >
                                <img src="/images/sign-out.svg" alt="Logout" />
                            </button>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    )
}

export default AdminNavbar;
