import { create } from 'zustand';
import { getDefaultSettings, defaultConfigItems } from '../data/defaultConfig';

interface ConfigState {
  settings: Record<string, string | number | boolean>;
  updateSetting: (key: string, value: string | number | boolean) => void;
  resetToDefault: () => void;
  exportConfig: () => string;
  importConfig: (content: string) => void;
}

const parseValue = (key: string, value: string): string | number | boolean => {
  const item = defaultConfigItems.find((i) => i.key === key);
  
  if (item?.type === 'boolean') {
    const lowerValue = value.toLowerCase().trim();
    if (lowerValue === 'true' || lowerValue === '1') return true;
    if (lowerValue === 'false' || lowerValue === '0') return false;
  }
  
  if (item?.type === 'number') {
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) return numValue;
  }
  
  return value;
};

export const useConfigStore = create<ConfigState>((set, get) => ({
  settings: getDefaultSettings(),

  updateSetting: (key, value) => {
    set((state) => ({
      settings: {
        ...state.settings,
        [key]: value,
      },
    }));
  },

  resetToDefault: () => {
    set({ settings: getDefaultSettings() });
  },

  exportConfig: () => {
    const { settings } = get();
    const lines: string[] = [];

    defaultConfigItems.forEach((item) => {
      const value = settings[item.key];
      if (value === '' || value === undefined || value === null) {
        return;
      }

      if (typeof value === 'boolean') {
        lines.push(`${item.key}=${value ? 'True' : 'False'}`);
      } else {
        lines.push(`${item.key}=${value}`);
      }
    });

    return lines.join('\n');
  },

  importConfig: (content: string) => {
    const newSettings = { ...getDefaultSettings() };
    const lines = content.split('\n');

    lines.forEach((line) => {
      const trimmedLine = line.trim();
      if (!trimmedLine || trimmedLine.startsWith('#')) {
        return;
      }

      const [key, ...valueParts] = trimmedLine.split('=');
      if (!key) return;

      const value = valueParts.join('=').trim();
      const item = defaultConfigItems.find((i) => i.key === key);
      if (item) {
        newSettings[key] = parseValue(key, value);
      }
    });

    set({ settings: newSettings });
  },
}));