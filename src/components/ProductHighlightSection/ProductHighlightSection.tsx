import { Link } from "react-router-dom";
import { useGrpcApi } from "../../hooks/useGrpcApi";
import { useEffect, useState } from "react";
import { Product } from "../../../pb/product/product";
import { getProductsClient } from "../../api/grpc/client";
import { formatPriceToIDR } from "../../utils/number";

interface ProductHighlightSectionProps {
  beforeFooter?: boolean;
}

function ProductHighlightSection(props: ProductHighlightSectionProps) {
  const productApi = useGrpcApi();
  const [products, setProducts] = useState<Product[]>([]);

  const fetchProducts = async () => {
    const res = await productApi.apiCall(
      getProductsClient().highlightProducts({})
    );

    setProducts(res.response.products || []);
  };
  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line
  }, []);

  return (
    <div
      className={`product-section ${
        props.beforeFooter ? "before-footer-section" : ""
      }`}
    >
      <div className="container">
        <div className="row">
          <div className="col-md-12 col-lg-3 mb-5 mb-lg-0">
            <h2 className="mb-4 section-title">
              Dibuat dengan material terbaik.
            </h2>
            <p className="mb-4">
              Rasakan perpaduan sempurna antara keahlian dan daya tahan.
              Furnitur kami dibuat dengan material premium untuk meningkatkan
              estetika dan kenyamanan ruang Anda.
            </p>
            <p>
              <Link to="/shop" className="btn">
                Jelajahi
              </Link>
            </p>
          </div>

          {/* Product Items */}
          {products.map((product) => (
            <div key={product.id} className="col-12 col-md-4 col-lg-3 mb-5 mb-md-0">
              <Link className="product-item" to="/cart">
                <img
                  src={product.imageUrl}
                  className="img-fluid product-thumbnail"
                  alt="Nordic Chair"
                />
                <h3 className="product-title">{product.name}</h3>
                <strong className="product-price">
                  {formatPriceToIDR(product.price)}
                </strong>
                <span className="icon-cross">
                  <img
                    src="/images/cross.svg"
                    className="img-fluid"
                    alt="Cross"
                  />
                </span>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ProductHighlightSection;
