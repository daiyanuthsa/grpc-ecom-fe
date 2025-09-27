import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import FormInput from "../../components/FormInput/FormInput";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { getAuthClient } from "../../api/grpc/client";
import { useAuthStore } from "../../store/auth";
import Swal from "sweetalert2";
import { useGrpcApi } from "../../hooks/useGrpcApi";

const loginschema = yup.object().shape({
  email: yup.string().email("Email tidak valid").required("Email wajib diisi"),
  password: yup
    .string()
    .required("Kata sandi wajib diisi")
    .min(6, "Kata sandi minimal 6 karakter"),
});

interface LoginFromValues {
  email: string;
  password: string;
}

const Login = () => {
  const form = useForm<LoginFromValues>({
    resolver: yupResolver(loginschema),
  });
  const navigate = useNavigate();
  const authClient = useAuthStore(state=>state.login);
  const loginApi = useGrpcApi();

  const submitHandler = async (values: LoginFromValues) => {
    const res = await loginApi.apiCall(getAuthClient().login({
      email: values.email,
      password: values.password,
    }),{
        useDefaultAuthError: false,
        defaultAuthError: () => {
            Swal.fire({
                icon: "error",
                title: "Gagal masuk",
                text: "Email atau kata sandi salah",
                confirmButtonText: "OK",
            });
        },

    });
    localStorage.setItem("access_token", res.response.accessToken);
    authClient(res.response.accessToken);
    Swal.fire({
      icon: "success",
      title: "Berhasil masuk",
      confirmButtonText: "OK",
    });
    if (useAuthStore.getState().role === "admin") {
      navigate('/admin');
    } else {
      navigate('/');
    }
    
  };

  return (
    <div className="login-section">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-5">
            <div className="login-wrap p-4">
              <h2 className="section-title text-center mb-5">Masuk</h2>
              <form
                onSubmit={form.handleSubmit(submitHandler)}
                className="login-form"
              >
                <FormInput<LoginFromValues>
                  type="email"
                  placeholder="Alamat Email"
                  register={form.register}
                  errors={form.formState.errors}
                  name="email"
                />
                <FormInput<LoginFromValues>
                  type="password"
                  placeholder="Kata Sandi"
                  register={form.register}
                  errors={form.formState.errors}
                  name="password"
                />
                <div className="form-group">
                  <button type="submit" className="btn btn-primary btn-block">
                    Masuk
                  </button>
                </div>
                <div className="text-center mt-4">
                  <p>
                    Belum punya akun?{" "}
                    <Link to="/register" className="text-primary">
                      Daftar di sini
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

export default Login;
