import { useState } from 'react';
import { Download, Copy, RefreshCw, Check } from 'lucide-react';
import { useConfigStore } from '../hooks/useConfigStore';

export const ExportPanel = () => {
  const { exportConfig, resetToDefault } = useConfigStore();
  const [copied, setCopied] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const configContent = exportConfig();

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

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-pal-surface border-t border-pal-border p-4 z-50">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3">
          <div className="flex-1 min-h-[72px] bg-pal-muted border border-pal-border rounded p-3 overflow-hidden">
            <pre className="text-xs text-pal-text-muted overflow-x-auto whitespace-pre-wrap font-sans">
              {configContent.split('\n').slice(0, 5).join('\n')}
              {configContent.split('\n').length > 5 ? '...' : ''}
            </pre>
            <div className="text-xs text-pal-text-muted mt-1">
              共 {configContent.split('\n').length} 项配置
            </div>
          </div>

          <div className="flex flex-wrap gap-2 justify-center lg:justify-end">
            <button
              type="button"
              onClick={() => setShowResetConfirm(true)}
              className="flex items-center gap-2 px-4 py-2 text-sm border border-pal-border bg-pal-surface text-pal-text-muted hover:bg-pal-muted rounded"
            >
              <RefreshCw className="w-4 h-4" />
              重置
            </button>

            <button
              type="button"
              onClick={handleCopy}
              className="flex items-center gap-2 px-4 py-2 text-sm border border-pal-border bg-pal-surface text-pal-text hover:bg-pal-muted rounded"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  已复制
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  复制
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleDownload}
              className="flex items-center gap-2 px-5 py-2 text-sm bg-pal-accent hover:bg-pal-accent-hover text-white rounded"
            >
              <Download className="w-4 h-4" />
              导出 .env
            </button>
          </div>
        </div>
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
    </div>
  );
};
