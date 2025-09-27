import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { getAuthClient } from "../../api/grpc/client";
import FormInput from "../../components/FormInput/FormInput";
import Swal from "sweetalert2";
import { useGrpcApi } from "../../hooks/useGrpcApi";

interface RegisterFormValues {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const registerSchema = yup.object().shape({
  name: yup.string().required("Nama lengkap wajib diisi"),
  email: yup.string().email("Email tidak valid").required("Email wajib diisi"),
  password: yup
    .string()
    .min(6, "Kata sandi minimal 6 karakter")
    .required("Kata sandi wajib diisi"),
  confirmPassword: yup
    .string()
    .required("Konfirmasi kata sandi wajib diisi")
    .oneOf([yup.ref("password")], "Kata sandi tidak sesuai"),
});

const Register = () => {
  const navigate = useNavigate();
  const form = useForm<RegisterFormValues>({
    resolver: yupResolver(registerSchema),
  });
  const registerApi = useGrpcApi();



  const submitHandler = async (values: RegisterFormValues) => {
    await registerApi.apiCall(getAuthClient().register({
      fullName: values.name,
      email: values.email,
      password: values.password,
      confirmPassword: values.confirmPassword,
    }),{
      useDefaultError: false,
      defaultError(e) {
          Swal.fire({
              icon: "error",
              title: "Gagal mendaftar",
              text: e.response.base?.message || "Terjadi kesalahan",
              confirmButtonText: "OK",
          });
      },
    });

    Swal.fire({
      icon: "success",
      title: "Berhasil mendaftar",
      confirmButtonText: "OK",
    });
    navigate("/login");
  };
  return (
    <div className="login-section">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-5">
            <div className="login-wrap p-4">
              <h2 className="section-title text-center mb-5">Daftar</h2>
              <form
                onSubmit={form.handleSubmit(submitHandler)}
                className="login-form"
              >
                <FormInput<RegisterFormValues>
                  type="text"
                  placeholder="Nama Lengkap"
                  register={form.register}
                  errors={form.formState.errors}
                  name="name"
                />
                <FormInput<RegisterFormValues>
                  type="email"
                  placeholder="email@example.com"
                  register={form.register}
                  errors={form.formState.errors}
                  name="email"
                />
                <FormInput<RegisterFormValues>
                  type="password"
                  placeholder="Kata Sandi"
                  register={form.register}
                  errors={form.formState.errors}
                  name="password"
                />
                <FormInput<RegisterFormValues>
                  type="password"
                  placeholder="Konfirmasi Kata Sandi"
                  register={form.register}
                  errors={form.formState.errors}
                  name="confirmPassword"
                />
                <div className="form-group">
                  <button
                    type="submit"
                    className="btn btn-primary btn-block"
                    disabled={registerApi.isLoading}
                  >
                    {registerApi.isLoading ? "Memproses..." : "Buat Akun"}
                  </button>
                </div>
                <div className="text-center mt-4">
                  <p>
                    Sudah punya akun?{" "}
                    <Link to="/login" className="text-primary">
                      Masuk di sini
                    </Link>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
