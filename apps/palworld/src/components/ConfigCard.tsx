import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { ConfigItem } from '../data/defaultConfig';
import { useConfigStore } from '../hooks/useConfigStore';
import { ConfigInput } from './ConfigInput';
import { ConfigSwitch } from './ConfigSwitch';
import { ConfigSelect } from './ConfigSelect';

interface ConfigCardProps {
  title: string;
  icon: React.ReactNode;
  items: ConfigItem[];
  searchQuery?: string;
  defaultExpanded?: boolean;
}

export const ConfigCard = ({ title, icon, items, searchQuery = '', defaultExpanded = false }: ConfigCardProps) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const { settings, updateSetting } = useConfigStore();

  const filteredItems = searchQuery
    ? items.filter(
        (item) =>
          item.key.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : items;

  if (searchQuery && filteredItems.length === 0) {
    return null;
  }

  const renderConfigItem = (item: ConfigItem) => {
    const value = settings[item.key];

    switch (item.type) {
      case 'boolean':
        return (
          <div key={item.key} className="py-3 border-b border-pal-border last:border-0">
            <ConfigSwitch
              label={item.label}
              description={item.description}
              keyName={item.key}
              value={value as boolean}
              onChange={(v) => updateSetting(item.key, v)}
            />
          </div>
        );
      case 'select':
        return (
          <div key={item.key} className="py-3 border-b border-pal-border last:border-0">
            <ConfigSelect
              label={item.label}
              description={item.description}
              keyName={item.key}
              value={value as string}
              options={item.options || []}
              onChange={(v) => updateSetting(item.key, v)}
            />
          </div>
        );
      case 'number':
        return (
          <div key={item.key} className="py-3 border-b border-pal-border last:border-0">
            <ConfigInput
              label={item.label}
              description={item.description}
              keyName={item.key}
              value={value as number}
              type="number"
              onChange={(v) => updateSetting(item.key, v)}
              min={item.min}
              max={item.max}
              step={item.step}
            />
          </div>
        );
      default:
        return (
          <div key={item.key} className="py-3 border-b border-pal-border last:border-0">
            <ConfigInput
              label={item.label}
              description={item.description}
              keyName={item.key}
              value={value as string}
              type="string"
              onChange={(v) => updateSetting(item.key, v)}
            />
          </div>
        );
    }
  };

  return (
    <div className="bg-pal-surface border border-pal-border rounded overflow-hidden">
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-3 flex items-center justify-between bg-pal-muted hover:bg-[#f0f0f0] border-b border-pal-border"
      >
        <div className="flex items-center gap-2">
          {icon}
          <span className="font-medium text-pal-text text-sm">{title}</span>
          {searchQuery && (
            <span className="text-xs text-pal-text-muted bg-pal-surface border border-pal-border px-2 py-0.5 rounded">
              {filteredItems.length}
            </span>
          )}
        </div>
        {isExpanded ? (
          <ChevronUp className="w-4 h-4 text-pal-text-muted" />
        ) : (
          <ChevronDown className="w-4 h-4 text-pal-text-muted" />
        )}
      </button>
      {isExpanded && <div className="p-4">{filteredItems.map(renderConfigItem)}</div>}
    </div>
  );
};
