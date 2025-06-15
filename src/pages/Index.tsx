
import { useState, useMemo, useCallback } from 'react';
import { useDrops } from '@/hooks/useDrops';
import { useTheme } from '@/hooks/useTheme';
import { Drop, DropType } from '@/types';
import Header from '@/components/Header';
import DropInputArea from '@/components/DropInputArea';
import DropGrid from '@/components/DropGrid';

const motivationalQuotes = [
  "Crie algo foda hoje!",
  "A inspiração vem da ação.",
  "Uma ideia pode mudar tudo.",
  "Feito é melhor que perfeito.",
  "Comece onde você está. Use o que você tem. Faça o que você pode."
];

const Index = () => {
  const [theme, toggleTheme] = useTheme();
  const { drops, addDrop, deleteDrop, setDrops } = useDrops();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<DropType | 'all'>('all');
  const [isDragging, setIsDragging] = useState(false);

  const filteredDrops = useMemo(() => {
    return drops
      .filter(drop => filterType === 'all' || drop.type === filterType)
      .filter(drop =>
        drop.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (drop.title && drop.title.toLowerCase().includes(searchTerm.toLowerCase()))
      );
  }, [drops, searchTerm, filterType]);
  
  const randomQuote = useMemo(() => motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)], []);

  const handleAddDrop = (newDrop: { type: DropType; content: string; title?: string }) => {
    addDrop(newDrop);
  };
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    const text = e.dataTransfer.getData('text/plain');

    if (files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (readEvent) => {
          if (readEvent.target?.result) {
            addDrop({ type: 'image', content: readEvent.target.result as string });
          }
        };
        reader.readAsDataURL(file);
      }
    } else if (text) {
      try {
        new URL(text);
        addDrop({ type: 'link', content: text });
      } catch (_) {
        addDrop({ type: 'text', content: text });
      }
    }
  };

  const exportDropsAsTxt = () => {
    const content = drops.map(drop => 
      `[${drop.type.toUpperCase()}] - ${new Date(drop.createdAt).toLocaleString()}\n${drop.title ? drop.title + '\n' : ''}${drop.content}\n\n`
    ).join('----------------------------------------\n');
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mind-drop-export-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div 
      className={`min-h-screen px-4 sm:px-6 lg:px-8 transition-colors duration-300 ${isDragging ? 'border-2 border-dashed border-primary bg-primary/10' : 'border-2 border-transparent'}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="max-w-7xl mx-auto">
        <Header 
          theme={theme} 
          toggleTheme={toggleTheme} 
          onSearch={setSearchTerm}
          onFilter={setFilterType}
          onExport={exportDropsAsTxt}
        />
        <main>
          <p className="text-center text-muted-foreground mb-8 italic">{randomQuote}</p>
          <DropInputArea onAddDrop={handleAddDrop} />
          <DropGrid drops={filteredDrops} onDelete={deleteDrop} />
        </main>
        <footer className="text-center py-6 text-sm text-muted-foreground">
          <p>Feito com 💛 por Lovable.</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
