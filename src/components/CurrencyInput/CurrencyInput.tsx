// src/components/CurrencyInput/CurrencyInput.tsx

import { NumericFormat } from "react-number-format";
import {
  Controller,
  Control, // Import Control dari react-hook-form
  Path,
  FieldErrors,
} from "react-hook-form";

// Gunakan tipe umum (T) untuk fleksibilitas
// eslint-disable-next-line
interface CurrencyInputProps<T extends Record<string, any>> {
  name: Path<T>;
  control: Control<T>; // Wajib menerima objek control
  label: string;
  placeholder: string;
  required?: boolean;
  errors: FieldErrors<T>;
}

// Component yang dibungkus
// eslint-disable-next-line
function CurrencyInput<T extends Record<string, any>>(
  props: CurrencyInputProps<T>
) {
  const { name, control, label, placeholder, required, errors } = props;

  // Dapatkan error state secara spesifik dari prop errors
  const error = errors[name];
  const isInvalid = !!error;
  const errorMessage = error?.message?.toString() || "";

  return (
    <div className="form-group mb-4">
      <label className="text-black" htmlFor={name as string}>
        {label} <span className="text-danger">{required ? "*" : ""}</span>
      </label>

      {/* Controller membungkus NumericFormat */}
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <NumericFormat
            className={`form-control ${isInvalid ? "is-invalid" : ""}`}
            placeholder={placeholder}
            // Konfigurasi Mata Uang Rupiah
            thousandSeparator="."
            decimalSeparator=","
            prefix="Rp"
            allowNegative={false}
            decimalScale={2}
            // Binding field.value dan field.onChange dari Controller
            value={field.value as string | number | null | undefined}
            onValueChange={(values) => {
              // Panggil field.onChange dengan nilai numerik mentah
              field.onChange(values.floatValue || 0);
            }}
            type="text"
          />
        )}
      />

      <div
        className={`text-danger ${isInvalid ? "" : "hidden"}`}
        style={{ height: 8 }}
      >
        <small>{errorMessage}</small>
      </div>
    </div>
  );
}

export default CurrencyInput;
