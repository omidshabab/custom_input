export interface CustomInputProps {
  id?: string;
  type?: "text" | "email" | "multiline";
  placeholder?: string;
  label: string;
  disabled?: boolean;
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
}
