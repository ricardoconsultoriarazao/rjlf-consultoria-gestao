type FormFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  example?: string;
  multiline?: boolean;
  full?: boolean;
};

export function FormField({
  label,
  value,
  onChange,
  placeholder,
  example,
  multiline = false,
  full = false
}: FormFieldProps) {
  const id = label.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className={`field ${full ? "full" : ""}`}>
      <label htmlFor={id}>{label}</label>
      {multiline ? (
        <textarea
          id={id}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          value={value}
        />
      ) : (
        <input
          id={id}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          value={value}
        />
      )}
      {example && <small>Exemplo: {example}</small>}
    </div>
  );
}
