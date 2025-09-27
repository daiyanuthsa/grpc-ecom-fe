import { useEffect, useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import PlainHeroSection from '../../components/PlainHeroSection/PlainHeroSection';
import { GetProfileResponse } from '../../../pb/auth/auth';
import { getAuthClient } from '../../api/grpc/client';
import { Timestamp } from '../../../pb/google/protobuf/timestamp';
import { useGrpcApi } from "../../hooks/useGrpcApi";

function Profile() {
  const location = useLocation();
  const navigate = useNavigate();

  // State untuk menyimpan data profil
  const [profileData, setProfileData] = useState<GetProfileResponse | null>(
    null
  );

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

const profileApi= useGrpcApi();

  useEffect(() => {
    async function fetchProfile() {
        const res = await profileApi.apiCall(getAuthClient().getProfile({}));
     setProfileData(res?.response ?? null);
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
                      {profileApi.isLoading ? (
                        <div className="form-control-plaintext">Memuat...</div>
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
                      {profileApi.isLoading ? (
                        <div className="form-control-plaintext">Memuat...</div>
                      ) : (
                        <div className="form-control-plaintext">
                          {profileData?.email}
                        </div>
                      )}
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
