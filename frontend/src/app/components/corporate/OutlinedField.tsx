import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";

type OutlinedFieldProps = {
  label: string;
  required?: boolean;
  optional?: boolean;
  htmlFor?: string;
  error?: string;
  className?: string;
  children: ReactNode;
};

export function OutlinedField({
  label,
  required,
  optional,
  htmlFor,
  error,
  className = "",
  children,
}: OutlinedFieldProps) {
  return (
    <div className={className}>
      <label
        htmlFor={htmlFor}
        className="mb-1.5 block text-xs font-medium text-slate-600"
      >
        {label}
        {required ? <span className="text-red-500">*</span> : null}
        {optional ? <span className="font-normal text-slate-400"> (optional)</span> : null}
      </label>
      {children}
      {error ? <p className="mt-1 text-xs text-red-600">{error}</p> : null}
    </div>
  );
}

export const formInputClass =
  "w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#0F2A5F] focus:ring-2 focus:ring-[#0F2A5F]/15";

export const formSelectClass = `${formInputClass} cursor-pointer`;

export const formTextareaClass = `${formInputClass} resize-none min-h-[100px]`;

export const formButtonClass =
  "w-full rounded-lg bg-[#0F2A5F] px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#163a7a] disabled:cursor-not-allowed disabled:opacity-70 sm:text-[15px]";

/** @deprecated Use formInputClass */
export const outlinedInputClass = formInputClass;

type PhoneFieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & {
  label?: string;
  required?: boolean;
  error?: string;
};

export function PhoneField({
  label = "Phone Number",
  required,
  error,
  id = "phone",
  className = "",
  ...inputProps
}: PhoneFieldProps) {
  return (
    <OutlinedField label={label} required={required} htmlFor={id} error={error}>
      <div
        className={`flex overflow-hidden rounded-lg border border-slate-300 focus-within:border-[#0F2A5F] focus-within:ring-2 focus-within:ring-[#0F2A5F]/15 ${
          error ? "border-red-400" : ""
        }`}
      >
        <span className="flex shrink-0 items-center border-r border-slate-300 bg-slate-50 px-3 text-sm font-medium text-slate-700">
          +91
        </span>
        <input
          id={id}
          type="tel"
          inputMode="numeric"
          maxLength={10}
          className={`min-w-0 flex-1 border-0 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none placeholder:text-slate-400 ${className}`}
          {...inputProps}
        />
      </div>
    </OutlinedField>
  );
}

type TextFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  required?: boolean;
  optional?: boolean;
  error?: string;
  fieldClassName?: string;
};

export function TextField({
  label,
  required,
  optional,
  error,
  id,
  fieldClassName = "",
  className,
  ...inputProps
}: TextFieldProps) {
  return (
    <OutlinedField
      label={label}
      required={required}
      optional={optional}
      htmlFor={id}
      error={error}
      className={fieldClassName}
    >
      <input id={id} className={`${formInputClass} ${className ?? ""}`} {...inputProps} />
    </OutlinedField>
  );
}

type SelectFieldProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
  required?: boolean;
  optional?: boolean;
  error?: string;
  fieldClassName?: string;
};

export function SelectField({
  label,
  required,
  optional,
  error,
  id,
  fieldClassName = "",
  className,
  children,
  ...selectProps
}: SelectFieldProps) {
  return (
    <OutlinedField
      label={label}
      required={required}
      optional={optional}
      htmlFor={id}
      error={error}
      className={fieldClassName}
    >
      <select id={id} className={`${formSelectClass} ${className ?? ""}`} {...selectProps}>
        {children}
      </select>
    </OutlinedField>
  );
}

type TextareaFieldProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string;
  required?: boolean;
  optional?: boolean;
  error?: string;
};

export function TextareaField({
  label,
  required,
  optional,
  error,
  id,
  className,
  ...textareaProps
}: TextareaFieldProps) {
  return (
    <OutlinedField label={label} required={required} optional={optional} htmlFor={id} error={error}>
      <textarea id={id} className={`${formTextareaClass} ${className ?? ""}`} {...textareaProps} />
    </OutlinedField>
  );
}
