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
    <div className="fixed bottom-0 left-0 right-0 bg-pal-card/95 backdrop-blur-md border-t border-pal-border p-4 z-50">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-4">
          <div className="flex-1 min-h-[80px] bg-pal-dark border border-pal-border rounded-lg p-3 overflow-hidden">
            <pre className="text-xs font-mono text-pal-text-muted overflow-x-auto whitespace-pre-wrap">
              {configContent.split('\n').slice(0, 5).join('\n')}{configContent.split('\n').length > 5 ? '...' : ''}
            </pre>
            <div className="text-xs text-pal-text-muted mt-1">
              共 {configContent.split('\n').length} 项配置
            </div>
          </div>

          <div className="flex flex-wrap gap-2 justify-center lg:justify-end">
            <button
              onClick={() => setShowResetConfirm(true)}
              className="flex items-center gap-2 px-4 py-2 bg-pal-border/50 hover:bg-pal-border text-pal-text-muted hover:text-pal-text rounded-lg transition-all duration-200"
            >
              <RefreshCw className="w-4 h-4" />
              重置
            </button>

            <button
              onClick={handleCopy}
              className={`flex items-center gap-2 px-4 py-2 bg-pal-secondary hover:bg-pal-secondary/80 text-pal-text rounded-lg transition-all duration-200 ${
                copied ? 'bg-green-600' : ''
              }`}
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
              onClick={handleDownload}
              className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-pal-accent to-blue-500 hover:from-pal-accent/80 hover:to-blue-500/80 text-pal-darker font-semibold rounded-lg transition-all duration-200 shadow-glow hover:shadow-glow-lg transform hover:scale-105"
            >
              <Download className="w-4 h-4" />
              导出 .env
            </button>
          </div>
        </div>
      </div>

      {showResetConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-pal-card border border-pal-border rounded-xl p-6 max-w-sm w-full mx-4">
            <h3 className="text-lg font-semibold text-pal-text mb-2">确认重置</h3>
            <p className="text-sm text-pal-text-muted mb-4">确定要将所有配置恢复到默认值吗？此操作无法撤销。</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 px-4 py-2 bg-pal-border/50 text-pal-text-muted hover:text-pal-text rounded-lg transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleReset}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg transition-colors"
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