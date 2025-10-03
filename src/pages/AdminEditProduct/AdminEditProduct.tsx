import Swal from "sweetalert2";
import { getProductsClient } from "../../api/grpc/client";
import ProductForm from "../../components/ProductForm/ProductForm";
import { useGrpcApi } from "../../hooks/useGrpcApi";
import { ProductFormValues } from "../../types/product";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";

const REST_UPLOAD_URL = "http://127.0.0.1:9000/product/upload";


function AdminEditProduct() {
  const { id } = useParams<{ id: string }>(); // 1. Ambil ID dari URL
  const productApi = useGrpcApi();
  const navigate = useNavigate();

  const [initialValues, setInitialValues] = useState<ProductFormValues | undefined>(
    undefined
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isUpLoading, setIsUpLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setError("ID Produk tidak ditemukan.");
      setIsLoading(false);
      return;
    }

    const fetchProduct = async () => {
      try {
        const res = await productApi.apiCall(
          getProductsClient().detailProduct({ id })
        );
        setInitialValues({
          name: res.response.name,
          price: res.response.price,
          description: res.response.description,
          image: new DataTransfer().files,
          imageUrl: res.response.imageUrl,
        });
      } catch (e) {
        setError("Gagal memuat data produk.");
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
    // eslint-disable-next-line
  }, [id]);

  // 4. Handler untuk submit form (logika update)
  const submitHandler = async (values: ProductFormValues) => {
    setIsUpLoading(true);

    if (!id) {
      setIsUpLoading(false); 
      return;
    }

    // Hanya upload jika ada file gambar baru yang dipilih
    if (values.image.length > 0) {
      try {
        const formData = new FormData();
        formData.append("image", values.image?.[0]);
        const uploadRes = await axios.post(REST_UPLOAD_URL, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        values.imageUrl = uploadRes.data.key;
        if (!values.imageUrl) {
          throw new Error("Server tidak mengembalikan file key yang valid.");
        }
        setIsUpLoading(false);
      } catch (error) {
        const errorMessage =
          axios.isAxiosError(error) && error.response?.data?.message
            ? error.response.data.message
            : "Gagal mengunggah file gambar baru.";
        Swal.fire({ icon: "error", title: "Gagal Unggah", text: errorMessage });
        return;
      }
    }else{
      const imageUrl = initialValues?.imageUrl; // -> "https://.../product_...jpg"


      if (imageUrl) {

        const imageKey = imageUrl.split("/").pop(); // -> "product_...jpg"
        values.imageUrl = "products/" + imageKey;
      }
    }

    // Panggil updateProduct
    await productApi.apiCall(
      getProductsClient().updateProduct({
        id: id, 
        name: values.name,
        price: values.price,
        description: values.description ?? "",
        imageFileName:  values.imageUrl ?? "",
      }),
      {
        useDefaultError: false,
        defaultError(e) {
          Swal.fire({
            icon: "error",
            title: "Gagal Memperbarui Produk",
            text: e.response.base?.message ?? "Terjadi kesalahan.",
          });
        },
      }
    );

    Swal.fire({
      title: "Berhasil Memperbarui Produk",
      icon: "success",
      confirmButtonText: "OK",
    });

    navigate("/admin/products");
  };

  if (isLoading) {
    return <div className="text-center p-5">Memuat data produk...</div>;
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="section-title">Edit Produk</h2>
      </div>

      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-12 col-12 col-lg-12">
            {/* 5. Kirim initialValues ke ProductForm */}
            {initialValues && (
              <ProductForm
                onSubmit={submitHandler}
                defaultValues={initialValues}
                disabled={isLoading || isUpLoading}
                isEdit={true}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default AdminEditProduct;