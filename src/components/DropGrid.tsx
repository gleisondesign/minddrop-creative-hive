
import { Drop } from '@/types';
import DropCard from './DropCard';

interface DropGridProps {
  drops: Drop[];
  onDelete: (id: string) => void;
}

const DropGrid = ({ drops, onDelete }: DropGridProps) => {
  if (drops.length === 0) {
    return (
      <div className="text-center py-16 text-muted-foreground">
        <p>Sua mente está limpa.</p>
        <p className="text-sm">Arraste e solte algo aqui ou use a área de entrada acima.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {drops.map(drop => (
        <DropCard key={drop.id} drop={drop} onDelete={onDelete} />
      ))}
    </div>
  );
};

export default DropGrid;
