import { useState } from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "@tanstack/react-form";
import type { FormSchema, FormField } from "../types/formSchema";

interface DynamicFormPageProps {
  onSubmitted?: () => void;
}

export default function DynamicFormPage({ onSubmitted }: DynamicFormPageProps) {
  const [serverMessage, setServerMessage] = useState<null | {
    type: "success" | "error";
    text: string;
  }>(null);

  const fetchFormSchema = async () => {
    const res = await axios.get<FormSchema>(
      "https://matbook-backend-1.onrender.com/api/form-schema"
    );
    return res.data;
  };

  const {
    data: schema,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["form-schema"],
    queryFn: fetchFormSchema,
  });

  const form = useForm({
    defaultValues: {} as Record<string, any>,
    onSubmit: async ({ value, formApi }) => {
      try {
        setServerMessage(null);

        await axios.post(
          "https://matbook-backend-1.onrender.com/api/submissions",
          value
        );

        setServerMessage({
          type: "success",
          text: "Form submitted successfully!",
        });

        formApi.reset();

        onSubmitted?.();
      } catch (err: any) {
        setServerMessage({
          type: "error",
          text: err?.response?.data?.message ?? "Failed to submit form",
        });
      }
    },
  });

  if (isLoading) return <p>Loading form...</p>;
  if (isError || !schema) return <p>Error loading schema</p>;

  const validateField = (field: FormField, value: any) => {
    const empty =
      value === "" ||
      value === undefined ||
      value === null ||
      (Array.isArray(value) && value.length === 0);

    if (field.required && empty) return `${field.label} is required`;

    return undefined;
  };

  const renderField = (field: FormField) => (
    <form.Field
      key={field.name}
      name={field.name}
      validators={{
        onChange: ({ value }) => validateField(field, value),
      }}
    >
      {(fieldApi) => {
        const { value, meta } = fieldApi.state;

        const error = meta.errors?.[0];
        const baseClasses =
          "border p-2 w-full rounded focus:ring focus:ring-blue-300";

        return (
          <div className="mb-4">
            {field.type !== "switch" && (
              <label className="block text-sm font-medium mb-1">
                {field.label}{" "}
                {field.required && <span className="text-red-500">*</span>}
              </label>
            )}

            {field.type === "text" && (
              <input
                type="text"
                className={baseClasses}
                placeholder={field.placeholder}
                value={value || ""}
                onChange={(e) => fieldApi.handleChange(() => e.target.value)}
                onBlur={fieldApi.handleBlur}
              />
            )}

            {field.type === "number" && (
              <input
                type="number"
                className={baseClasses}
                placeholder={field.placeholder}
                value={value ?? ""}
                onChange={(e) =>
                  fieldApi.handleChange(() => Number(e.target.value))
                }
                onBlur={fieldApi.handleBlur}
              />
            )}

            {field.type === "select" && (
              <select
                className={baseClasses}
                value={value ?? ""}
                onChange={(e) => fieldApi.handleChange(() => e.target.value)}
                onBlur={fieldApi.handleBlur}
              >
                <option value="">{field.placeholder}</option>
                {field.options?.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            )}

            {field.type === "multi-select" && (
              <select
                multiple
                className={baseClasses}
                value={value ?? []}
                onChange={(e) =>
                  fieldApi.handleChange(() =>
                    Array.from(e.target.selectedOptions).map((o) => o.value)
                  )
                }
                onBlur={fieldApi.handleBlur}
              >
                {field.options?.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            )}

            {field.type === "date" && (
              <input
                type="date"
                className={baseClasses}
                value={value ?? ""}
                onChange={(e) => fieldApi.handleChange(() => e.target.value)}
                onBlur={fieldApi.handleBlur}
              />
            )}

            {field.type === "textarea" && (
              <textarea
                rows={4}
                className={baseClasses}
                placeholder={field.placeholder}
                value={(value as string) ?? ""}
                onChange={(e) => fieldApi.handleChange(() => e.target.value)}
                onBlur={fieldApi.handleBlur}
              />
            )}

            {field.type === "switch" && (
              <label className="inline-flex gap-2 items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={!!value}
                  onChange={(e) =>
                    fieldApi.handleChange(() => e.target.checked)
                  }
                  onBlur={fieldApi.handleBlur}
                />
                <span>{field.label}</span>
              </label>
            )}

            {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
          </div>
        );
      }}
    </form.Field>
  );

  return (
    <div className="max-w-xl mx-auto bg-white shadow p-6 rounded">
      <h1 className="text-xl font-semibold">{schema.title}</h1>

      {serverMessage && (
        <p
          className={`mt-3 p-2 rounded ${
            serverMessage.type === "success"
              ? "text-green-700 bg-green-100"
              : "text-red-700 bg-red-100"
          }`}
        >
          {serverMessage.text}
        </p>
      )}

      <form
        className="space-y-4 mt-6"
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
      >
        {schema.fields.map(renderField)}

        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
        >
          {([canSubmit, isSubmitting]) => (
            <button
              type="submit"
              disabled={!canSubmit}
              className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </button>
          )}
        </form.Subscribe>
      </form>
    </div>
  );
}
