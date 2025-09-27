import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { getAuthClient } from "../../api/grpc/client";
import FormInput from "../FormInput/FormInput";
import Swal from "sweetalert2";
import { useGrpcApi } from "../../hooks/useGrpcApi";
interface ChangePasswordValues {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const changePasswordSchema = yup.object().shape({
  oldPassword: yup.string().required("Kata sandi saat ini wajib diisi"),
  newPassword: yup
    .string()
    .min(6, "Kata sandi minimal 6 karakter")
    .required("Kata sandi wajib diisi"),
  confirmPassword: yup
    .string()
    .required("Konfirmasi kata sandi wajib diisi")
    .oneOf([yup.ref("newPassword")], "Kata sandi tidak sesuai"),
});

function ChangePasswordSection() {
    const submitApi = useGrpcApi();
  const form = useForm<ChangePasswordValues>({
    resolver: yupResolver(changePasswordSchema),
  });
  const submitHandler = async (values: ChangePasswordValues) => {
    await submitApi.apiCall(getAuthClient().changePassword({
      oldPassword: values.oldPassword,
      newPassword: values.newPassword,
      newConfirmPassword: values.confirmPassword,
    }),{
        defaultError: (res) => {
            if (res.response.base?.message === "Incorrect old password") {
                Swal.fire({
                    icon: "error",
                    title:  "Kata sandi saat ini salah",
                });
            }
        },
        useDefaultError: false,
    });
    
    form.reset();
    Swal.fire({
      icon: "success",
      title: "Berhasil memperbarui kata sandi",
      confirmButtonText: "OK",
    });
  };
  return (
    <div className="p-4 p-lg-5 border bg-white">
      <form onSubmit={form.handleSubmit(submitHandler)}>
        <h2 className="h3 mb-3 text-black">Ubah Kata Sandi</h2>
        <label className="text-black" htmlFor="current_password">
          Kata Sandi Saat Ini
        </label>
        <FormInput<ChangePasswordValues>
          type="password"
          placeholder="Kata Sandi"
          register={form.register}
          errors={form.formState.errors}
          name="oldPassword"
        />

        <div className="form-group">
          <label className="text-black" htmlFor="new_password">
            Kata Sandi Baru
          </label>
          <FormInput<ChangePasswordValues>
            type="password"
            placeholder="Kata Sandi"
            register={form.register}
            errors={form.formState.errors}
            name="newPassword"
          />
        </div>
        <div className="form-group mb-3">
          <label className="text-black" htmlFor="confirm_password">
            Konfirmasi Kata Sandi Baru
          </label>
          <FormInput<ChangePasswordValues>
            type="password"
            placeholder="Kata Sandi"
            register={form.register}
            errors={form.formState.errors}
            name="confirmPassword"
          />
        </div>
        <button
          className="btn btn-primary"
          type="submit"
          disabled={submitApi.isLoading}
        >
          Perbarui Kata Sandi
        </button>
      </form>
    </div>
  );
}

export default ChangePasswordSection;
