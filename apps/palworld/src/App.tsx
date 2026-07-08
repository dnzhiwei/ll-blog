import { useState, useEffect, useRef } from 'react';
import {
  Settings,
  Server,
  Network,
  RefreshCw,
  HardDrive,
  Pause,
  FileText,
  Gamepad2,
  User,
  Sparkles,
  Building2,
  Package,
  Swords,
  Sliders,
  Cpu,
  Menu,
  X,
  Search,
  Upload,
} from 'lucide-react';
import { ConfigCard } from './components/ConfigCard';
import { ExportPanel } from './components/ExportPanel';
import { configCategories, defaultConfigItems } from './data/defaultConfig';
import { useConfigStore } from './hooks/useConfigStore';

const iconMap: Record<string, React.ReactNode> = {
  Settings: <Settings className="w-4 h-4 text-pal-text-muted" />,
  Server: <Server className="w-4 h-4 text-pal-text-muted" />,
  Network: <Network className="w-4 h-4 text-pal-text-muted" />,
  RefreshCw: <RefreshCw className="w-4 h-4 text-pal-text-muted" />,
  HardDrive: <HardDrive className="w-4 h-4 text-pal-text-muted" />,
  Pause: <Pause className="w-4 h-4 text-pal-text-muted" />,
  FileText: <FileText className="w-4 h-4 text-pal-text-muted" />,
  Gamepad2: <Gamepad2 className="w-4 h-4 text-pal-text-muted" />,
  User: <User className="w-4 h-4 text-pal-text-muted" />,
  Sparkles: <Sparkles className="w-4 h-4 text-pal-text-muted" />,
  Building2: <Building2 className="w-4 h-4 text-pal-text-muted" />,
  Package: <Package className="w-4 h-4 text-pal-text-muted" />,
  Swords: <Swords className="w-4 h-4 text-pal-text-muted" />,
  Sliders: <Sliders className="w-4 h-4 text-pal-text-muted" />,
  Cpu: <Cpu className="w-4 h-4 text-pal-text-muted" />,
};

function App() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [importSuccess, setImportSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { importConfig } = useConfigStore();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (importSuccess) {
      const timer = setTimeout(() => setImportSuccess(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [importSuccess]);

  const getCategoryItems = (categoryId: string) => {
    return defaultConfigItems.filter((item) => item.category === categoryId);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      importConfig(content);
      setImportSuccess(true);
    };
    reader.readAsText(file);
  };

  const hasSearchResults = () => {
    if (!searchQuery) return true;
    return defaultConfigItems.some(
      (item) =>
        item.key.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  return (
    <div className="min-h-screen pb-36 bg-pal-bg">
      <header className="sticky top-0 bg-pal-surface border-b border-pal-border z-40">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-lg font-semibold text-pal-text">幻兽帕鲁配置工具</h1>
              <p className="text-sm text-pal-text-muted">编辑专用服务器 .env 配置</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 px-3 py-2 text-sm border border-pal-border bg-pal-surface text-pal-text rounded hover:bg-pal-muted"
              >
                <Upload className="w-4 h-4" />
                <span className="hidden sm:inline">导入 .env</span>
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
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 text-pal-text-muted hover:text-pal-text border border-pal-border rounded"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {importSuccess && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 bg-pal-surface border border-pal-border text-pal-text px-4 py-2 rounded text-sm z-50">
          配置文件导入成功
        </div>
      )}

      <div className="flex max-w-7xl mx-auto">
        <aside
          className={`fixed lg:sticky lg:top-[65px] top-[65px] left-0 bottom-36 w-64 bg-pal-surface border-r border-pal-border lg:h-[calc(100vh-65px-144px)] overflow-y-auto transition-transform duration-200 z-30 ${
            mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          }`}
        >
          <div className="p-3 space-y-1">
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-pal-text-muted" />
              <input
                type="text"
                placeholder="搜索配置项..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm bg-pal-surface border border-pal-border rounded text-pal-text placeholder-pal-text-muted"
              />
            </div>

            <button
              type="button"
              onClick={() => {
                setSelectedCategory(null);
                setMobileMenuOpen(false);
              }}
              className={`w-full px-3 py-2 rounded text-sm text-left flex items-center gap-2 ${
                !selectedCategory
                  ? 'bg-pal-muted text-pal-text font-medium border border-pal-border'
                  : 'text-pal-text-muted hover:bg-pal-muted'
              }`}
            >
              <Sliders className="w-4 h-4" />
              全部配置
            </button>

            {configCategories.map((category) => {
              const hasMatchingItems =
                !searchQuery ||
                getCategoryItems(category.id).some(
                  (item) =>
                    item.key.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    item.description.toLowerCase().includes(searchQuery.toLowerCase())
                );
              if (!hasMatchingItems) return null;

              return (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => {
                    setSelectedCategory(category.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full px-3 py-2 rounded text-sm text-left flex items-center gap-2 ${
                    selectedCategory === category.id
                      ? 'bg-pal-muted text-pal-text font-medium border border-pal-border'
                      : 'text-pal-text-muted hover:bg-pal-muted'
                  }`}
                >
                  {iconMap[category.icon]}
                  <span className="flex-1">{category.name}</span>
                  <span className="text-xs text-pal-text-muted">
                    {getCategoryItems(category.id).length}
                  </span>
                </button>
              );
            })}
          </div>
        </aside>

        {mobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black/20 z-20 lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}

        <main className="flex-1 min-w-0 px-4 py-5">
          <div className="mb-5">
            <h2 className="text-xl font-semibold text-pal-text mb-1">
              {selectedCategory
                ? configCategories.find((c) => c.id === selectedCategory)?.name
                : '全部配置'}
            </h2>
            <p className="text-sm text-pal-text-muted">
              修改配置后，在页面底部导出 .env 文件
            </p>
          </div>

          {searchQuery && !hasSearchResults() ? (
            <div className="text-center py-12 text-pal-text-muted text-sm">
              未找到匹配的配置项
            </div>
          ) : selectedCategory ? (
            <div className="space-y-4">
              <ConfigCard
                title={configCategories.find((c) => c.id === selectedCategory)?.name || ''}
                icon={iconMap[configCategories.find((c) => c.id === selectedCategory)?.icon || 'Settings']}
                items={getCategoryItems(selectedCategory)}
                searchQuery={searchQuery}
                defaultExpanded={true}
              />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 items-start">
              {configCategories.map((category) => {
                const items = getCategoryItems(category.id);
                const hasMatchingItems =
                  !searchQuery ||
                  items.some(
                    (item) =>
                      item.key.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      item.description.toLowerCase().includes(searchQuery.toLowerCase())
                  );
                if (!hasMatchingItems) return null;

                return (
                  <ConfigCard
                    key={category.id}
                    title={category.name}
                    icon={iconMap[category.icon]}
                    items={items}
                    searchQuery={searchQuery}
                    defaultExpanded={false}
                  />
                );
              })}
            </div>
          )}
        </main>
      </div>

      <ExportPanel />
    </div>
  );
}

export default App;
