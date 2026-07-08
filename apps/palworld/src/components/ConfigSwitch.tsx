interface ConfigSwitchProps {
  label: string;
  description: string;
  keyName: string;
  value: boolean;
  onChange: (value: boolean) => void;
}

export const ConfigSwitch = ({ label, description, keyName, value, onChange }: ConfigSwitchProps) => {
  return (
    <div className="space-y-2">
      <div className="flex items-start justify-between gap-3">
        <label className="flex-1 text-sm font-medium text-pal-text truncate">{label}</label>
        <span className="shrink-0 text-xs text-pal-text-muted font-mono truncate max-w-[40%]">{keyName}</span>
      </div>
      {description && (
        <p className="text-xs text-pal-text-muted">{description}</p>
      )}
      <button
        onClick={() => onChange(!value)}
        className={`relative shrink-0 w-12 h-6 rounded-full transition-colors duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-inset focus:ring-pal-accent ${
          value ? 'bg-pal-accent' : 'bg-pal-border'
        }`}
      >
        <span
          className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 ease-in-out shadow-md ${
            value ? 'left-7' : 'left-1'
          }`}
        />
      </button>
    </div>
  );
};