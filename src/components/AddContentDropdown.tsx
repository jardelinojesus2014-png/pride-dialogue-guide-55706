import { Plus, FolderPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface AddContentDropdownProps {
  label: string;
  onAddItem: () => void;
  onAddFolder: () => void;
  itemIcon?: React.ReactNode;
}

export const AddContentDropdown = ({ label, onAddItem, onAddFolder, itemIcon }: AddContentDropdownProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="gap-2 rounded-lg">
          <Plus className="w-4 h-4" />
          Adicionar
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem className="gap-2 cursor-pointer" onClick={onAddItem}>
          {itemIcon || <Plus className="w-4 h-4" />}
          Nov{label === 'Arte' ? 'a' : 'o'} {label}
        </DropdownMenuItem>
        <DropdownMenuItem className="gap-2 cursor-pointer" onClick={onAddFolder}>
          <FolderPlus className="w-4 h-4" />
          Nova Pasta
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
