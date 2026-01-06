'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/Buttons';
import { Filter } from 'lucide-react';

type FilterType = 'all' | 'active' | 'completed';

interface FilterDropdownProps {
  currentFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
}

export function FilterDropdown({ currentFilter, onFilterChange }: FilterDropdownProps) {
  const getFilterLabel = (filter: FilterType) => {
    switch (filter) {
      case 'all': return 'All';
      case 'active': return 'Active';
      case 'completed': return 'Completed';
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <Filter className="h-4 w-4 mr-2" />
          {getFilterLabel(currentFilter)}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => onFilterChange('all')}>
          All
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onFilterChange('active')}>
          Active
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onFilterChange('completed')}>
          Completed
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}