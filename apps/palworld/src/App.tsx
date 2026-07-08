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
  Settings: <Settings className="w-5 h-5 text-pal-accent" />,
  Server: <Server className="w-5 h-5 text-pal-accent" />,
  Network: <Network className="w-5 h-5 text-pal-accent" />,
  RefreshCw: <RefreshCw className="w-5 h-5 text-pal-accent" />,
  HardDrive: <HardDrive className="w-5 h-5 text-pal-accent" />,
  Pause: <Pause className="w-5 h-5 text-pal-accent" />,
  FileText: <FileText className="w-5 h-5 text-pal-accent" />,
  Gamepad2: <Gamepad2 className="w-5 h-5 text-pal-accent" />,
  User: <User className="w-5 h-5 text-pal-accent" />,
  Sparkles: <Sparkles className="w-5 h-5 text-pal-accent" />,
  Building2: <Building2 className="w-5 h-5 text-pal-accent" />,
  Package: <Package className="w-5 h-5 text-pal-accent" />,
  Swords: <Swords className="w-5 h-5 text-pal-accent" />,
  Sliders: <Sliders className="w-5 h-5 text-pal-accent" />,
  Cpu: <Cpu className="w-5 h-5 text-pal-accent" />,
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
    <div className="min-h-screen pb-32">
      <header className="fixed top-0 left-0 right-0 bg-pal-card/95 backdrop-blur-md border-b border-pal-border z-40">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-pal-accent to-blue-600 rounded-xl flex items-center justify-center shadow-glow">
                <Gamepad2 className="w-6 h-6 text-pal-darker" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-pal-text">Palworld Configurator</h1>
                <p className="text-xs text-pal-text-muted">服务器配置调整工具</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 px-4 py-2 bg-pal-secondary hover:bg-pal-secondary/80 text-pal-text rounded-lg transition-all duration-200"
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
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 text-pal-text-muted hover:text-pal-accent transition-colors"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {importSuccess && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-fade-in">
          配置文件导入成功！
        </div>
      )}

      <div className="flex pt-16">
        <aside className={`fixed lg:relative top-16 left-0 bottom-32 w-64 bg-pal-card/50 border-r border-pal-border lg:border-none lg:bg-transparent transition-transform duration-300 z-30 lg:z-0 ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
          <div className="p-4 space-y-1">
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-pal-text-muted" />
              <input
                type="text"
                placeholder="搜索配置项..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-pal-dark border border-pal-border rounded-lg text-pal-text placeholder-pal-text-muted focus:border-pal-accent transition-colors"
              />
            </div>

            <button
              onClick={() => {
                setSelectedCategory(null);
                setMobileMenuOpen(false);
              }}
              className={`w-full px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-200 ${
                !selectedCategory
                  ? 'bg-pal-accent/20 text-pal-accent font-medium'
                  : 'text-pal-text-muted hover:text-pal-text hover:bg-pal-primary/30'
              }`}
            >
              <Sliders className="w-4 h-4" />
              全部配置
            </button>

            {configCategories.map((category) => {
              const hasMatchingItems = !searchQuery || getCategoryItems(category.id).some(
                (item) =>
                  item.key.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  item.description.toLowerCase().includes(searchQuery.toLowerCase())
              );
              if (!hasMatchingItems) return null;

              return (
                <button
                  key={category.id}
                  onClick={() => {
                    setSelectedCategory(category.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-200 ${
                    selectedCategory === category.id
                      ? 'bg-pal-accent/20 text-pal-accent font-medium'
                      : 'text-pal-text-muted hover:text-pal-text hover:bg-pal-primary/30'
                  }`}
                >
                  {iconMap[category.icon]}
                  <span className="text-sm">{category.name}</span>
                  <span className="ml-auto text-xs bg-pal-primary/50 px-2 py-0.5 rounded-full">
                    {getCategoryItems(category.id).length}
                  </span>
                </button>
              );
            })}
          </div>
        </aside>

        {mobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-20 lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}

        <main className="flex-1 px-4 py-6 max-w-6xl mx-auto">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-pal-text mb-2">
              {selectedCategory
                ? configCategories.find((c) => c.id === selectedCategory)?.name
                : '全部配置'}
            </h2>
            <p className="text-pal-text-muted">
              调整服务器配置，完成后点击下方按钮导出 .env 文件
            </p>
          </div>

          {searchQuery && !hasSearchResults() ? (
            <div className="text-center py-12">
              <Search className="w-12 h-12 text-pal-text-muted mx-auto mb-4" />
              <p className="text-pal-text-muted">未找到匹配的配置项</p>
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
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 items-start">
              {configCategories.map((category) => {
                const items = getCategoryItems(category.id);
                const hasMatchingItems = !searchQuery || items.some(
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