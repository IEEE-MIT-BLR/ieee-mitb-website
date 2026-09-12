"use client";

import { useFormStatus } from "react-dom";
import type { ActionState } from "@/lib/actions/types";

const inputClass =
  "w-full rounded-[3px] border border-(--line-strong) bg-(--surface-2) px-3 py-2 text-(--ink) placeholder-(--faint) focus:border-(--accent) focus:outline-none focus:ring-1 focus:ring-(--accent)";

const labelClass = "mb-1 block text-sm font-medium text-(--ink-2)";

function Required() {
  return <span className="text-red-400"> *</span>;
}

/** Summary banner: general error + any per-field validation messages. */
export function FormBanner({ state }: { state: ActionState }) {
  const fieldMsgs = state.fieldErrors
    ? Object.entries(state.fieldErrors).flatMap(([key, msgs]) =>
        (msgs ?? []).map((m) => `${key}: ${m}`),
      )
    : [];
  if (!state.error && fieldMsgs.length === 0) return null;
  return (
    <div className="rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-300">
      {state.error && <p className="font-medium">{state.error}</p>}
      {fieldMsgs.length > 0 && (
        <ul className="mt-1 list-disc pl-5">
          {fieldMsgs.map((m, i) => (
            <li key={i}>{m}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function TextField({
  label,
  name,
  defaultValue,
  type = "text",
  required,
  placeholder,
}: {
  label: string;
  name: string;
  defaultValue?: string | null;
  type?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className={labelClass}>
        {label}
        {required && <Required />}
      </span>
      <input
        name={name}
        type={type}
        defaultValue={defaultValue ?? ""}
        required={required}
        placeholder={placeholder}
        className={inputClass}
      />
    </label>
  );
}

export function TextAreaField({
  label,
  name,
  defaultValue,
  rows = 4,
  required,
}: {
  label: string;
  name: string;
  defaultValue?: string | null;
  rows?: number;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className={labelClass}>
        {label}
        {required && <Required />}
      </span>
      <textarea
        name={name}
        defaultValue={defaultValue ?? ""}
        rows={rows}
        required={required}
        className={inputClass}
      />
    </label>
  );
}

export function SelectField({
  label,
  name,
  defaultValue,
  options,
  blankLabel,
  required,
}: {
  label: string;
  name: string;
  defaultValue?: string | null;
  options: { value: string; label: string }[];
  blankLabel?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className={labelClass}>
        {label}
        {required && <Required />}
      </span>
      <select
        name={name}
        defaultValue={defaultValue ?? ""}
        className={inputClass}
      >
        {blankLabel !== undefined && <option value="">{blankLabel}</option>}
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export function CheckboxField({
  label,
  name,
  defaultChecked,
}: {
  label: string;
  name: string;
  defaultChecked?: boolean;
}) {
  return (
    <label className="flex items-center gap-2 text-sm text-(--ink-2)">
      <input
        type="checkbox"
        name={name}
        defaultChecked={defaultChecked}
        className="h-4 w-4 rounded border-(--line-strong) bg-(--surface-2) accent-(--accent)"
      />
      {label}
    </label>
  );
}

/**
 * Image input: upload a file (`imageFile`) OR keep/paste a URL (`imageUrl`).
 * The action prefers the uploaded file, else the URL text.
 */
export function ImageField({
  label = "Image",
  currentUrl,
  name = "imageUrl",
}: {
  label?: string;
  currentUrl?: string | null;
  name?: string;
}) {
  return (
    <fieldset className="rounded-[3px] border border-(--line-strong) p-3">
      <legend className="px-1 text-sm font-medium text-(--ink-2)">
        {label}
      </legend>
      <input
        type="file"
        name="imageFile"
        accept="image/*"
        className="block w-full text-sm text-(--muted) file:mr-3 file:rounded file:border-0 file:bg-(--accent) file:px-3 file:py-1.5 file:text-(--on-accent) hover:file:bg-(--accent-bright)"
      />
      <input
        type="url"
        name={name}
        defaultValue={currentUrl ?? ""}
        placeholder="…or paste an image URL"
        className={`mt-2 ${inputClass}`}
      />
    </fieldset>
  );
}

export function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-[3px] bg-(--accent) px-5 py-2.5 font-semibold text-(--on-accent) transition-colors hover:bg-(--accent-bright) disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? "Saving…" : label}
    </button>
  );
}
