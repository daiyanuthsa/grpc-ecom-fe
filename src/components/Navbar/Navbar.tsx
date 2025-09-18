import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/auth";
import { getAuthClient } from "../../api/grpc/client";
import Swal from "sweetalert2";

function Navbar() {
  const { pathname } = useLocation();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);

  const cartUrl = isAuthenticated ? "/cart" : "/login";
  const profileUrl = isAuthenticated ? "/profile/change-password" : "/login";

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
    <nav
      className="custom-navbar navbar navbar navbar-expand-md navbar-dark bg-dark"
      aria-label="Furni navigation bar"
    >
      <div className="container">
        <Link className="navbar-brand" to="/">
          Furni<span>.</span>
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarsFurni"
          aria-controls="navbarsFurni"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarsFurni">
          <ul className="custom-navbar-nav navbar-nav ms-auto mb-2 mb-md-0">
            <li className={`nav-item ${pathname === "/" ? "active" : ""}`}>
              <Link className="nav-link" to="/">
                Home
              </Link>
            </li>
            <li className={`nav-item ${pathname === "/shop" ? "active" : ""}`}>
              <Link className="nav-link" to="/shop">
                Belanja
              </Link>
            </li>
            <li
              className={`nav-item ${pathname === "/services" ? "active" : ""}`}
            >
              <Link className="nav-link" to="/services">
                Layanan
              </Link>
            </li>
          </ul>

          <ul className="custom-navbar-cta navbar-nav mb-2 mb-md-0 ms-5">
            <li className="margin-right">
              <Link className="nav-link" to={cartUrl}>
                <img src="/images/cart.svg" alt="Cart" />
              </Link>
            </li>

            <li className="margin-right">
              <Link className="nav-link" to={profileUrl}>
                <img src="/images/user.svg" alt="User" />
              </Link>
            </li>

            {isAuthenticated && (
              <li className="margin-right nav-link" onClick={logOutHandler}>
                <img src="/images/sign-out.svg" alt="Logout" />
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
