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
  const helpText =
    example ||
    placeholder ||
    "Responda com exemplos praticos, situações reais e combinados que já acontecem ou que devem acontecer na empresa.";

  return (
    <div className={`field ${full ? "full" : ""}`}>
      <div className="field-label-row">
        <label htmlFor={id}>{label}</label>
        <details className="field-help">
          <summary aria-label={`Ajuda para ${label}`}>i</summary>
          <div>{helpText}</div>
        </details>
      </div>
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
    </div>
  );
}
