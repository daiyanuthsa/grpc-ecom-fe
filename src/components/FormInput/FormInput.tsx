import React from "react";
import { FieldErrors, Path, UseFormRegister } from "react-hook-form";

// eslint-disable-next-line
interface FormInputProps<T extends Record<string, any>> {
  type?: string;
  placeholder?: string;
  register: UseFormRegister<T>;
  errors: FieldErrors<T>;
  name: Path<T>;
}
// eslint-disable-next-line
function FormInput<T extends Record<string, any>>(props: FormInputProps<T>) {
  return (
    <div className="form-group mb-4">
      <input
        type={props.type}
        className={`form-control ${props.errors[props.name] ? '' : 'is-invalid'}`}
        placeholder={props.placeholder}
        {...props.register(props.name)}
      />
      <div className={`text-danger ${props.errors[props.name] ? '' : 'hidden'}`} style={{ height:8 }}>
        <small>{(props.errors[props.name]?.message as string | null) ?? ''}</small>
      </div>
    </div>
  );
};

export default FormInput;