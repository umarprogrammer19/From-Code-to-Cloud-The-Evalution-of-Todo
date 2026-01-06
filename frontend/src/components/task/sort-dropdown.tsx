'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { ArrowUpDown } from 'lucide-react';

type SortType = 'date' | 'priority' | 'title';

interface SortDropdownProps {
  currentSort: SortType;
  onSortChange: (sort: SortType) => void;
}

export function SortDropdown({ currentSort, onSortChange }: SortDropdownProps) {
  const getSortLabel = (sort: SortType) => {
    switch (sort) {
      case 'date': return 'Date';
      case 'priority': return 'Priority';
      case 'title': return 'Title';
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <ArrowUpDown className="h-4 w-4 mr-2" />
          {getSortLabel(currentSort)}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => onSortChange('date')}>
          Sort by Date
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onSortChange('priority')}>
          Sort by Priority
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onSortChange('title')}>
          Sort by Title
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}