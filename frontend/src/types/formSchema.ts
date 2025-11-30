export type FieldType =
  | "text"
  | "number"
  | "select"
  | "multiselect"
  | "date"
  | "textarea"
  | "switch";

export interface FieldOption {
  label: string;
  value: string;
}

export interface FieldValidation {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  regex?: string;
  min?: number;
  max?: number;
  minDate?: string; 
  minSelected?: number;
  maxSelected?: number;
}

export interface FormField {
  name: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  options?: FieldOption[];
  validation?: FieldValidation;
}

export interface FormSchema {
  title: string;
  description?: string;
  fields: FormField[];
}
