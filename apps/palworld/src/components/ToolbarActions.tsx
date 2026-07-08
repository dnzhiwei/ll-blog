import { useRef, useState } from 'react';
import { Download, Copy, RefreshCw, Check, Upload } from 'lucide-react';
import { useConfigStore } from '../hooks/useConfigStore';

interface ToolbarActionsProps {
  onImportSuccess?: () => void;
}

export const ToolbarActions = ({ onImportSuccess }: ToolbarActionsProps) => {
  const { exportConfig, resetToDefault, importConfig } = useConfigStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [copied, setCopied] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const configContent = exportConfig();

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      importConfig(content);
      onImportSuccess?.();
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(configContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([configContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = '.env';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleReset = () => {
    resetToDefault();
    setShowResetConfirm(false);
  };

  const btnClass =
    'flex items-center gap-1.5 px-3 py-2 text-sm border border-pal-border bg-pal-surface text-pal-text rounded hover:bg-pal-muted';

  return (
    <>
      <div className="flex items-center gap-2 flex-wrap justify-end">
        <button type="button" onClick={() => setShowResetConfirm(true)} className={btnClass}>
          <RefreshCw className="w-4 h-4" />
          <span className="hidden sm:inline">重置</span>
        </button>

        <button type="button" onClick={handleCopy} className={btnClass}>
          {copied ? (
            <>
              <Check className="w-4 h-4" />
              <span className="hidden sm:inline">已复制</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              <span className="hidden sm:inline">复制</span>
            </>
          )}
        </button>

        <button type="button" onClick={() => fileInputRef.current?.click()} className={btnClass}>
          <Upload className="w-4 h-4" />
          <span className="hidden sm:inline">导入</span>
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".env"
          onChange={handleFileUpload}
          className="hidden"
        />

        <button
          type="button"
          onClick={handleDownload}
          className="flex items-center gap-1.5 px-3 py-2 text-sm bg-pal-accent hover:bg-pal-accent-hover text-white rounded"
        >
          <Download className="w-4 h-4" />
          <span className="hidden sm:inline">导出 .env</span>
        </button>
      </div>

      {showResetConfirm && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-pal-surface border border-pal-border rounded p-5 max-w-sm w-full mx-4">
            <h3 className="text-base font-semibold text-pal-text mb-2">确认重置</h3>
            <p className="text-sm text-pal-text-muted mb-4">
              确定要将所有配置恢复到默认值吗？此操作无法撤销。
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 px-4 py-2 text-sm border border-pal-border bg-pal-surface text-pal-text-muted hover:bg-pal-muted rounded"
              >
                取消
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="flex-1 px-4 py-2 text-sm bg-red-600 hover:bg-red-700 text-white rounded"
              >
                确认重置
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
