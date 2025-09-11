#!/bin/bash

PROTO_ROOT="proto"
GEN_PATH="pb"

# Tentukan file-file proto yang ingin di-generate
PROTO_FILES=(
    "auth/auth.proto"
    "common/base_response.proto"
    # "product/product.proto"
)

# Hapus file hasil generate sebelumnya
rm -rf "$GEN_PATH"
mkdir -p "$GEN_PATH"

# Jalankan protoc dengan semua file dari array
npx protoc \
    --proto_path="$PROTO_ROOT" \
    --ts_out="$GEN_PATH" \
    "${PROTO_FILES[@]}"

echo "Finished generating protobuf code."