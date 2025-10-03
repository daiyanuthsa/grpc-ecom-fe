import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import FormInput from "../FormInput/FormInput";
import CurrencyInput from "../CurrencyInput/CurrencyInput";
import { ProductFormValues } from "../../types/product";
import { useEffect } from "react";

const productschema = yup.object().shape({
  name: yup.string().required("Nama produk wajib diisi"),
  price: yup
    .number()
    .typeError("Harga harus berupa angka")
    .positive("Harga harus bilangan positif")
    .required("Harga wajib diisi"),
  image: yup
    .mixed<FileList>()
    .test("required", "Gambar produk wajib diisi", (value) => {
      return value && value.length > 0;
    })
    .test("fileSize", "Ukuran gambar terlalu besar", (value) => {
      return value && value[0] && value[0].size <= 5 * 1024 * 1024;
    })
    .test("fileType", "Format gambar tidak didukung", (value) => {
      return (
        value && value[0] && ["image/jpeg", "image/png"].includes(value[0].type)
      );
    })
    .required("Gambar produk wajib diisi"),
  description: yup.string().optional(),
});
const editschema = yup.object().shape({
  name: yup.string().required("Nama produk wajib diisi"),
  price: yup
    .number()
    .typeError("Harga harus berupa angka")
    .positive("Harga harus bilangan positif")
    .required("Harga wajib diisi"),
  image: yup
    .mixed<FileList>()
    .required("Gambar produk wajib diisi")
    .test("fileSize", "Ukuran gambar terlalu besar", (value) => {
      return value && value[0] ? value[0].size <= 5 * 1024 * 1024 : true;
    })
    .test("fileType", "Format gambar tidak didukung", (value) => {
      return value && value.length > 0
        ? ["image/jpeg", "image/png"].includes(value[0].type)
        : true;
    }),
  description: yup.string().optional(),
});

interface ProductFormProps {
  onSubmit: (values: ProductFormValues) => Promise<void>;
  disabled?: boolean;
  defaultValues?: ProductFormValues;
  isEdit?: boolean;
}

function ProductForm(props: ProductFormProps) {
  const form = useForm<ProductFormValues>({
    resolver: yupResolver(props.isEdit ? editschema :productschema),
    defaultValues: props.defaultValues,
  });

  const createProduct = async (values: ProductFormValues) => {
    props.onSubmit(values);
  };

  useEffect(() => {
    if (props.defaultValues) {
      form.reset(props.defaultValues);
    }
    // eslint-disable-next-line
  }, [props.defaultValues]);


  return (
    <form
      onSubmit={form.handleSubmit(createProduct)}
      className="p-4 p-lg-5 border bg-white"
    >
      <FormInput<ProductFormValues>
        type="text"
        label="Nama Produk"
        placeholder="Nama Produk"
        name="name"
        register={form.register}
        errors={form.formState.errors}
        required
      />
      <CurrencyInput<ProductFormValues>
        label="Harga"
        placeholder="Harga Produk"
        required
        name="price"
        // Pass control dan errors sebagai props
        control={form.control} // 👈 Wajib
        errors={form.formState.errors} // 👈 Wajib
      />
      {props.defaultValues?.imageUrl && (
        <img
          className="w-100 rounded-5"
          src={props.defaultValues?.imageUrl}
          alt="Gambar Produk"
        />
      )}
      <FormInput<ProductFormValues>
        type="file"
        label="Gambar Produk"
        name="image"
        register={form.register}
        errors={form.formState.errors}
        accept="image/*"
        required
      />
      <FormInput<ProductFormValues>
        type="textarea"
        label="Deskripsi"
        placeholder="Deskripsi produk..."
        name="description"
        register={form.register}
        errors={form.formState.errors}
      />

      <div className="form-group">
        <button
          disabled={props.disabled}
          type="submit"
          className="btn btn-primary"
        >
          {props.disabled ? (
            <>
              Menyimpan...
              <span
                className="spinner-border spinner-border-sm ms-2"
                role="status"
                aria-hidden="true"
              ></span>
            </>
          ) : (
            "Simpan Produk"
          )}
        </button>
      </div>
    </form>
  );
}

export default ProductForm;
