export interface CheckboxProps {
  state: boolean | "indeterminate";
  required?: boolean | undefined;
  disabled?: boolean | undefined;
  name?: string | undefined;
  value?: string | undefined;
}
