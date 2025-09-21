import { useEffect, useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import PlainHeroSection from '../../components/PlainHeroSection/PlainHeroSection';
import { GetProfileResponse } from '../../../pb/auth/auth';
import { getAuthClient } from '../../api/grpc/client';
import { Timestamp } from '../../../pb/google/protobuf/timestamp';
import Swal from 'sweetalert2';
import { RpcError } from '@protobuf-ts/runtime-rpc';

function Profile() {
  const location = useLocation();
  const navigate = useNavigate();

  // State untuk menyimpan data profil
  const [profileData, setProfileData] = useState<GetProfileResponse | null>(
    null
  );
  // State untuk menangani status loading
  const [isLoading, setIsLoading] = useState(true);
  // State untuk menangani error
  const [error, setError] = useState<string | null>(null);

interface FormatDate {
    (timestamp?: Timestamp): string;
}

const formatDate: FormatDate = (timestamp) => {
    if (!timestamp) return "N/A";
    const date = new Date(Number(timestamp.seconds) * 1000);
    return date.toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "long",
        year: "numeric",
    });
};

  useEffect(() => {
    async function fetchProfile() {
      try {
        const client = getAuthClient();
        const res = await client.getProfile({});

        // Menyimpan data profil dari response
        if (res.response.base?.isError ?? true) {
          Swal.fire({
            title: res.response.base?.message || "Terjadi kesalahan",
            icon: "error",
            text: "Gagal mengambil data profil.",
          });
        }
        setProfileData(res.response);
        setError(null); // Menghapus status error jika sebelumnya ada
      } catch (err) {
        if (err instanceof RpcError){
            if (err.code === 'UNAUTHENTICATED') {
                // Unauthorized error, redirect to login
                Swal.fire({
                  title: "Sesi habis, silakan masuk kembali.",
                  icon: "warning",
                  confirmButtonText: "OK",
                });
                localStorage.removeItem("access_token");
                navigate("/login");
                return;
            }
        }
        console.error("Failed to fetch profile:", err);
        setError("Gagal mengambil data profil.");
      } finally {
        setIsLoading(false); // Mengubah status loading menjadi false setelah selesai
      }
    }

    fetchProfile();
  }, []);

  useEffect(() => {
    if (location.pathname === "/profile") {
      navigate("/profile/change-password");
    }
  }, [navigate, location.pathname]);

  return (
    <>
      <PlainHeroSection title="Profil Saya" />

      <div className="untree_co-section before-footer-section">
        <div className="container">
          <div className="row mb-5">
            <div className="col-12">
              <div className="p-4 p-lg-5 border bg-white">
                <div className="row">
                  <div className="col-md-4">
                    <div className="form-group">
                      <label className="text-black">Nama Lengkap</label>{" "}
                      {isLoading ? (
                        <div className="form-control-plaintext">Memuat...</div>
                      ) : error ? (
                        <div className="form-control-plaintext text-danger">
                          {error}
                        </div>
                      ) : (
                        <div className="form-control-plaintext">
                          {profileData?.fullName}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="form-group">
                      <label className="text-black">Alamat Email</label>
                      <div className="form-control-plaintext">
                        {profileData?.email}
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="form-group">
                      <label className="text-black">Anggota Sejak</label>{" "}
                      {/* Assuming creation date is available in profileData */}
                      <div className="form-control-plaintext">
                        {profileData?.memberSince
                          ? formatDate(profileData?.memberSince)
                          : "N/A"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-md-3">
              <div className="nav flex-column nav-pills">
                <Link
                  to="/profile/change-password"
                  className={`nav-link ${
                    location.pathname === "/profile/change-password"
                      ? "active"
                      : ""
                  }`}
                >
                  Ubah Kata Sandi
                </Link>
                <Link
                  to="/profile/orders"
                  className={`nav-link ${
                    location.pathname === "/profile/orders" ? "active" : ""
                  }`}
                >
                  Riwayat Pesanan
                </Link>
              </div>
            </div>
            <div className="col-md-9">
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Profile;
