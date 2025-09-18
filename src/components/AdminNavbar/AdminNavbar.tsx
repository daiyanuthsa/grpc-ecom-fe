import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/auth';
import Swal from 'sweetalert2';
import { getAuthClient } from '../../api/grpc/client';

function AdminNavbar() {
    const navigate = useNavigate();
    const logout = useAuthStore((state) => state.logout);

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
          const client = getAuthClient();
          // Perbaikan: Akses `base` langsung dari respons
          const res = await client.logout({});
    
          if (!res.response.base?.isError) {
            logout();
            localStorage.removeItem("access_token");
            Swal.fire({
              icon: "success",
              title: "Berhasil keluar",
              confirmButtonText: "OK",
            });
            // Perbaikan: Gunakan `useNavigate` untuk navigasi yang lebih baik
            navigate("/login");
          }
          alert(res.response.base?.message || "Terjadi kesalahan saat logout.");
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
