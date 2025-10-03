import { useEffect, useState } from "react";
import Pagination from "../Pagination/Pagination";
import { useGrpcApi } from "../../hooks/useGrpcApi";
import { Product } from "../../../pb/product/product";
import { getProductsClient } from "../../api/grpc/client";
import { formatPriceToIDR } from "../../utils/number";

function ProductListSection() {
  const productApi = useGrpcApi();
  const [products, setProducts] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchProducts = async () => {
    const res = await productApi.apiCall(
      getProductsClient().listProducts({
        pagination: {
          page: currentPage,
          limit: 4,
          sort: [
            {
              field: "price",
              order: "desc",
            },
          ],
        },
      })
    );

    setProducts(res.response.products || []);
    setCurrentPage(res.response.pagination?.page || 1);
    setTotalPages(res.response.pagination?.totalPages || 1);
  };
  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="untree_co-section product-section before-footer-section">
      <div className="container">
        <div className="row">
          {products.map((p) => (
            <div className="col-12 col-md-4 col-lg-3 mb-5">
              <a className="product-item" href="#">
                <img
                  src={p.imageUrl}
                  alt={p.imageUrl}
                  className="img-fluid product-thumbnail"
                />
                <h3 className="product-title">{p.name}</h3>
                <strong className="product-price">{formatPriceToIDR(p.price)}</strong>

                <span className="icon-cross">
                  <img src="images/cross.svg" className="img-fluid" />
                </span>
              </a>
            </div>
          ))}
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
}

export default ProductListSection;
