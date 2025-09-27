import {
  FinishedUnaryCall,
  RpcError,
  type UnaryCall,
} from "@protobuf-ts/runtime-rpc";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useAuthStore } from "../store/auth";
import { BaseResponse } from "../../pb/common/base_response";

interface callApiArgs<T extends object, U extends GrpcBaseResponse> {
  useDefaultError?: boolean;
  defaultError?: (e: FinishedUnaryCall<T, U>) => void;
  useDefaultAuthError?: boolean;
 defaultAuthError?: (e: RpcError) => void;
}

interface GrpcBaseResponse {
  base?: BaseResponse;
}

export function useGrpcApi() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const logoutUser = useAuthStore((state) => state.logout);
  const apiCall = async <T extends object, U extends GrpcBaseResponse>(
    api: UnaryCall<T, U>,
    args?: callApiArgs<T, U>
  ) => {
    try {
      setIsLoading(true);

      const res = await api;
      if (res.response.base?.isError ?? true) {
        throw res;
      }

      return res;
    } catch (e) {
      if (e instanceof RpcError) {
        if (e.code === "UNAUTHENTICATED") {
            if (args?.useDefaultAuthError ?? true) {
                logoutUser();
                localStorage.removeItem("access_token");
                Swal.fire({
                  title: "Sesi habis, silakan masuk kembali.",
                  icon: "warning",
                  confirmButtonText: "OK",
                });
                navigate("/login");
            }
            if (args?.defaultAuthError) {
              args?.defaultAuthError(e);
            }
          throw e;
        }
      }

      if (typeof e === "object" && e !== null && "response" in e) {
        const err = e as FinishedUnaryCall<T, U>;
        if (args?.defaultError) {
          args.defaultError(err);
        }
      }

      if (args?.useDefaultError ?? true) {
        Swal.fire({
          icon: "error",
          title: "Terjadi kesalahan",
          text: "Silahkan coba lagi nanti",
        });
      }

      throw e;
    } finally {
      setIsLoading(false);
    }
  };
  return {
    isLoading,
    apiCall,
  };
}
