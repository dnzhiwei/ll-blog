interface ConfigSelectProps {
  label: string;
  description: string;
  keyName: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
}

export const ConfigSelect = ({ label, description, keyName, value, options, onChange }: ConfigSelectProps) => {
  return (
    <div className="space-y-2">
      <div className="flex items-start justify-between gap-3">
        <label className="flex-1 text-sm font-medium text-pal-text truncate">{label}</label>
        <span className="shrink-0 text-xs text-pal-text-muted font-mono truncate max-w-[40%]">{keyName}</span>
      </div>
      {description && (
        <p className="text-xs text-pal-text-muted">{description}</p>
      )}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 bg-pal-dark border border-pal-border rounded-lg text-pal-text focus:border-pal-accent transition-colors duration-200 cursor-pointer"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};