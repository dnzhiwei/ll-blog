interface ConfigSwitchProps {
  label: string;
  description: string;
  keyName: string;
  value: boolean;
  onChange: (value: boolean) => void;
}

export const ConfigSwitch = ({ label, description, keyName, value, onChange }: ConfigSwitchProps) => {
  return (
    <div className="space-y-1.5">
      <div className="flex items-start justify-between gap-3">
        <label className="flex-1 text-sm text-pal-text">{label}</label>
        <span className="shrink-0 text-xs text-pal-text-muted truncate max-w-[40%]">{keyName}</span>
      </div>
      {description && <p className="text-xs text-pal-text-muted">{description}</p>}
      <label className="inline-flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={value}
          onChange={(e) => onChange(e.target.checked)}
          className="w-4 h-4 rounded border-pal-border text-pal-accent focus:ring-pal-accent"
        />
        <span className="text-sm text-pal-text-muted">{value ? '开启' : '关闭'}</span>
      </label>
    </div>
  );
};
