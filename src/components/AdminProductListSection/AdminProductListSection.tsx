import React, { useEffect, useState } from "react";
import useSortableHeader from "../../hooks/useSortableHeader";
import SortableHeader from "../SortableHeader/SortableHeader";
import Pagination from "../Pagination/Pagination";
import { Link } from "react-router-dom";
import { useGrpcApi } from "../../hooks/useGrpcApi";
import { getProductsClient } from "../../api/grpc/client";
import { ProductAdmin } from "../../../pb/product/product";
import { formatPriceToIDR } from "../../utils/number";
import Swal from "sweetalert2";

function AdminProductListSection() {
  const productApi = useGrpcApi();
  const { handleSort, sortConfig } = useSortableHeader();
  const sort: { field: string; order: string }[] = [];

  const [products, setProducts] = useState<ProductAdmin[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const deleteHandler = (id: string) => {
    Swal.fire({
      title: "Apakah Anda yakin ingin menghapus produk ini?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya",
      cancelButtonText: "Tidak",
    }).then((result) => {
      if (result.isConfirmed) {
        productApi.apiCall(
          getProductsClient().deleteProduct({
            id: id,
          })
        );
        Swal.fire({
          title: "Berhasil menghapus produk",
          icon: "success",
          confirmButtonText: "OK",
        }).then(() => {
          window.location.reload();
        });
      }
    });
  };

  useEffect(() => {
     sort.push({
       field: "deleted_at",
       order: "asc", // Sesuaikan valuenya dengan kebutuhan API Anda
     });
    if (sortConfig.key && sortConfig.direction) {
      sort.push({
        field: sortConfig.key,
        order: sortConfig.direction === "asc" ? "ASC" : "DESC", // Sesuaikan valuenya dengan kebutuhan API Anda
      });
    }
    const fetchProducts = async () => {
      setIsLoading(true);
      setError(null);
      const res = await productApi.apiCall(
        getProductsClient().listProductsAdmin(
          {
            pagination: {
              page: currentPage,
              limit: 2,
              sort: sort,
            },
          },
          {
            useDefaultError: false,
            // eslint-disable-next-line
            defaultError(e: any) {
              setError(e.response.base?.message);
            },
          }
        )
      );
      setProducts(res.response.products || []);
      setTotalPages(res.response.pagination?.totalPages || 0);
      setIsLoading(false);
      setError(null);
    };

    fetchProducts();
    console.log(totalPages);
  }, [currentPage, sortConfig]);

  const renderTableBody = () => {
    if (isLoading) {
      return (
        <tr>
          <td colSpan={5} className="text-center py-5">
            Memuat data...
          </td>
        </tr>
      );
    }

    if (error) {
      return (
        <tr>
          <td colSpan={5} className="text-center py-5 text-danger">
            {error}
          </td>
        </tr>
      );
    }

    if (products.length === 0) {
      return (
        <tr>
          <td colSpan={5} className="text-center py-5">
            Tidak ada produk yang ditemukan.
          </td>
        </tr>
      );
    }

    return products.map((product) => (
      <tr key={product.id}>
        <td>
          <img
            src={product.imageUrl || "/images/product-1.png"}
            width="50"
            alt={product.name}
          />
        </td>
        <td className="fw-bold">{product.name}</td>
        <td>{formatPriceToIDR(product.price)}</td>
        <td>
          {product.description.length > 70
            ? `${product.description.substring(0, 70)}...`
            : product.description}
        </td>
        <td>
          <Link
            to={`/admin/products/${product.id}/edit`}
            className="btn btn-secondary me-2"
          >
            Edit
          </Link>
          {!product.isDeleted && (
            <button
              onClick={() => deleteHandler(product.id)}
              className="btn btn-danger"
            >
              Delete
            </button>
          )}
        </td>
      </tr>
    ));
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="section-title">Produk</h2>
        <Link to="/admin/products/create">
          <button className="btn btn-primary">Tambah Produk</button>
        </Link>
      </div>
      <div className="table-responsive">
        <table className="table site-blocks-table">
          <thead>
            <tr>
              <th>Gambar</th>
              <SortableHeader
                label="Nama Produk"
                sortKey="name"
                currentSort={sortConfig}
                onSort={handleSort}
              />
              <SortableHeader
                label="Harga"
                sortKey="price"
                currentSort={sortConfig}
                onSort={handleSort}
              />
              <SortableHeader
                label="Deskripsi"
                sortKey="description"
                currentSort={sortConfig}
                onSort={handleSort}
              />
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {/* {products.map((product) => (
                <tr key={product.id}>
                  <td>
                    <img src="/images/product-1.png" width="50" alt="Produk" />
                  </td>
                  <td>{product.name}</td>
                  <td>{product.price}</td>
                  <td>
                    {product.description.length > 20
                      ? product.description.slice(0, 20) + "..."
                      : product.description}
                  </td>
                  <td>
                    <button className="btn btn-secondary me-2">Edit</button>
                    <button className="btn">Hapus</button>
                  </td>
                </tr>
              ))} */}
            {renderTableBody()}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
}

export default AdminProductListSection;
