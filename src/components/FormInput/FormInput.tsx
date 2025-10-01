import { InputHTMLAttributes, TextareaHTMLAttributes } from "react";
import { FieldErrors, Path, UseFormRegister } from "react-hook-form";

// Gabungkan atribut HTML input, textarea, dan file upload
type InputProps = InputHTMLAttributes<HTMLInputElement> &
  TextareaHTMLAttributes<HTMLTextAreaElement>;

// eslint-disable-next-line
interface FormInputProps<T extends Record<string, any>> {
  type?: InputProps["type"] | "textarea"; // Tambahkan 'textarea' sebagai tipe custom
  placeholder?: string;
  register: UseFormRegister<T>;
  errors: FieldErrors<T>;
  name: Path<T>;
  label?: string;
  required?: boolean;
  // Atribut spesifik untuk <textarea>
  rows?: number;
  // Atribut spesifik untuk input type="file"
  accept?: string;
}
// eslint-disable-next-line
function FormInput<T extends Record<string, any>>(props: FormInputProps<T>) {
  const {
    type,
    placeholder,
    register,
    errors,
    name,
    label,
    required,
    rows,
    accept,
  } = props;

  const isInvalid = errors[name] ? "is-invalid" : "";
  const errorMessage = (errors[name]?.message as string | null) ?? "";

  // 1. Tentukan elemen input atau textarea
  let inputElement;

  if (type === "textarea") {
    // Render <textarea>
    inputElement = (
      <textarea
        className={`form-control ${isInvalid}`}
        id={name as string}
        rows={rows || 4}
        placeholder={placeholder}
        {...register(name)}
      ></textarea>
    );
  } else if (type === "file") {
    // Render input type="file"
    inputElement = (
      <input
        type={type}
        className={`form-control ${isInvalid}`}
        id={name as string}
        placeholder={placeholder}
        multiple={false}
        accept={accept} // Menerima prop accept
        {...register(name)}
      />
    );
  } else {
    // Render input biasa
    inputElement = (
      <input
        type={type}
        className={`form-control ${isInvalid}`}
        id={name as string}
        placeholder={placeholder}
        {...register(name)}
      ></input>
    );
  }

  return (
    <div className="form-group mb-4">
      {label && (
        <label className="text-black" htmlFor={name as string}>
          {label} <span className="text-danger">{required ? "*" : ""}</span>
        </label>
      )}

      {/* Render elemen input/textarea yang sudah ditentukan */}
      {inputElement}

      <div
        className={`text-danger ${errors[name] ? "" : "hidden"}`}
        style={{ height: 8 }}
      >
        <small>{errorMessage}</small>
      </div>
    </div>
  );
}

export default FormInput;
