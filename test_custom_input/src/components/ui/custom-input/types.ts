export interface CustomInputProps {
  id: string;
  label: string;
  placeholder?: string;
  type?: "text" | "email" | "multiline";
  disabled?: boolean;
  errorMessage?: string;
  defaultValue?: string;
  allowNewLine?: boolean;
  onChange?: (value: string) => void;
  onBlur?: (value: string) => void;
}
