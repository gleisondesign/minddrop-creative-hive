
import Icon from './Icon';
import { Button } from './ui/button';
import { DropType } from '@/types';

interface HeaderProps {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  onSearch: (term: string) => void;
  onFilter: (type: DropType | 'all') => void;
  onExport: (format: 'txt') => void;
}

const Header = ({ theme, toggleTheme, onSearch, onFilter, onExport }: HeaderProps) => {
  const filterOptions: {value: DropType | 'all', label: string, icon: any}[] = [
    { value: 'all', label: 'Todos', icon: 'LayoutGrid' },
    { value: 'text', label: 'Texto', icon: 'FileText' },
    { value: 'link', label: 'Link', icon: 'Link' },
    { value: 'image', label: 'Imagem', icon: 'Image' },
    { value: 'audio', label: 'Áudio', icon: 'AudioLines' },
  ]
  return (
    <header className="py-6 mb-8">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <Icon name="Droplets" className="w-6 h-6 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">MindDrop</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={toggleTheme} variant="ghost" size="icon">
            <Icon name={theme === 'light' ? 'Moon' : 'Sun'} className="w-6 h-6" />
          </Button>
          <Button onClick={() => onExport('txt')} variant="outline">
            Exportar .txt
          </Button>
        </div>
      </div>
      <div className="mt-6 flex flex-col md:flex-row gap-4">
        <div className="relative flex-grow">
          <Icon name="Search" className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar por palavra-chave..."
            onChange={(e) => onSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-md bg-card border"
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {filterOptions.map(opt => (
            <Button key={opt.value} variant="outline" onClick={() => onFilter(opt.value)} className="flex items-center gap-2 shrink-0">
               <Icon name={opt.icon} className="w-4 h-4"/>
               {opt.label}
            </Button>
          ))}
        </div>
      </div>
    </header>
  );
};

export default Header;
