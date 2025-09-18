import { RpcInterceptor } from "@protobuf-ts/runtime-rpc";

export const authInterceptor: RpcInterceptor = {
  interceptUnary(next, method, input, options) {
      const token = localStorage.getItem("access_token") ;
      if (token) {
          options.meta = {
            ...options.meta,
            authorization: `Bearer ${token}`
          };
        //   options.meta['Authorization'] = `Bearer ${token}`;
      }

      return next(method, input, options);
  },
}