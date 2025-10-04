import Swal from "sweetalert2";
import { getProductsClient } from "../../api/grpc/client";
import ProductForm from "../../components/ProductForm/ProductForm";
import { useGrpcApi } from "../../hooks/useGrpcApi";
import { ProductFormValues } from "../../types/product";
import { useNavigate } from "react-router-dom";
import axios from "axios";
const REST_UPLOAD_URL = import.meta.env.VITE_REST_UPLOAD_URL;
function AdminCreateProduct() {
  const productApi = useGrpcApi();
  const navigate = useNavigate();
  const submitHandler = async (values: ProductFormValues) => {
    const imageFile = values.image?.[0];
    let imageFileName: string = "";

    try {
      const formData = new FormData();
      formData.append("image", imageFile);
      const uploadRes = await axios.post(REST_UPLOAD_URL, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          // Autorisasi tidak perlu di sini jika handler Fiber publik,
          // namun autentikasi admin harus dilakukan di handler Fiber/Service.
        },
      });

      imageFileName = uploadRes.data.key;

      if (!imageFileName) {
        throw new Error("Server tidak mengembalikan file key yang valid.");
      }
    } catch (error) {
      console.error("File upload failed:", error);
      const errorMessage =
        axios.isAxiosError(error) && error.response?.data?.message
          ? error.response.data.message
          : "Gagal mengunggah file gambar ke server.";

      Swal.fire({
        icon: "error",
        title: "Gagal Unggah",
        text: errorMessage,
      });
      return; // Hentikan proses jika upload gagal
    }

    await productApi.apiCall(
      getProductsClient().createProduct({
        name: values.name,
        price: values.price,
        description: values.description ?? "",
        imageFileName: imageFileName,
      }),
      {
        useDefaultError: false,
        defaultError(e) {
          Swal.fire({
            icon: "error",
            title: "Gagal menambahkan produk",
            text: e.response.base?.message,
          });
          return;
        },
      }
    );
    Swal.fire({
      title: "Berhasil menambahkan produk",
      icon: "success",
      confirmButtonText: "OK",
    });

    navigate("/admin/products");
  };

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="section-title">Tambah Produk</h2>
      </div>

      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-12 col-12 col-lg-12">
            <ProductForm onSubmit={submitHandler} />
          </div>
        </div>
      </div>
    </>
  );
}

export default AdminCreateProduct;
