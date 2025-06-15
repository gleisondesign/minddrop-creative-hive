
import { Drop } from '@/types';
import Icon from './Icon';

interface DropCardProps {
  drop: Drop;
  onDelete: (id: string) => void;
}

const typeConfig = {
  text: { icon: 'FileText', color: 'text-blue-500' },
  link: { icon: 'Link', color: 'text-green-500' },
  image: { icon: 'Image', color: 'text-purple-500' },
  audio: { icon: 'AudioLines', color: 'text-orange-500' },
};

const DropCard = ({ drop, onDelete }: DropCardProps) => {
  const { icon, color } = typeConfig[drop.type];

  const renderContent = () => {
    switch (drop.type) {
      case 'image':
        return <img src={drop.content} alt="Dropped content" className="mt-2 rounded-md object-cover w-full h-auto" />;
      case 'audio':
        return <audio controls src={drop.content} className="w-full mt-2" />;
      case 'link':
        return (
          <a href={drop.content} target="_blank" rel="noopener noreferrer" className="mt-2 block text-primary hover:underline truncate">
            {drop.title || drop.content}
          </a>
        );
      case 'text':
        return <p className="mt-2 text-sm text-foreground/80 whitespace-pre-wrap">{drop.content}</p>;
      default:
        return null;
    }
  };

  return (
    <div className="bg-card p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col animate-scale-in">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-2">
          <Icon name={icon as any} className={`w-5 h-5 ${color}`} />
          <span className="text-xs font-medium text-muted-foreground uppercase">{drop.type}</span>
        </div>
        <button onClick={() => onDelete(drop.id)} className="text-muted-foreground hover:text-destructive transition-colors">
          <Icon name="X" className="w-4 h-4" />
        </button>
      </div>
      <div className="mt-2 flex-grow">
        {renderContent()}
      </div>
      <div className="mt-3 text-right text-xs text-muted-foreground">
        {new Date(drop.createdAt).toLocaleDateString()}
      </div>
    </div>
  );
};

export default DropCard;
