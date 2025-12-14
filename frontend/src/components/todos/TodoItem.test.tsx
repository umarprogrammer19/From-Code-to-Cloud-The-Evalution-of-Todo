import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import TodoItem from './TodoItem';

// Mock the Button component to avoid having to mock the entire component tree
jest.mock('@/components/ui/Button', () => {
  return ({ children, onClick, variant = 'primary', ...props }: any) => (
    <button
      onClick={onClick}
      data-variant={variant}
      {...props}
    >
      {children}
    </button>
  );
});

describe('TodoItem', () => {
  const mockTodo = {
    id: '1',
    title: 'Test Todo',
    description: 'Test Description',
    completed: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockOnToggle = jest.fn();
  const mockOnDelete = jest.fn();
  const mockOnEdit = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders todo item correctly', () => {
    render(
      <TodoItem
        {...mockTodo}
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
        onEdit={mockOnEdit}
      />
    );

    expect(screen.getByText('Test Todo')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
    expect(screen.getByRole('checkbox')).not.toBeChecked();
  });

  it('renders completed todo with strikethrough', () => {
    render(
      <TodoItem
        {...mockTodo}
        completed={true}
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
        onEdit={mockOnEdit}
      />
    );

    const titleElement = screen.getByText('Test Todo');
    expect(titleElement).toHaveClass('line-through');
  });

  it('calls onToggle when checkbox is clicked', () => {
    render(
      <TodoItem
        {...mockTodo}
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
        onEdit={mockOnEdit}
      />
    );

    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);

    expect(mockOnToggle).toHaveBeenCalledWith('1', true);
  });

  it('calls onToggle when "Mark Complete" button is clicked', () => {
    render(
      <TodoItem
        {...mockTodo}
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
        onEdit={mockOnEdit}
      />
    );

    const toggleButton = screen.getByText('Mark Complete');
    fireEvent.click(toggleButton);

    expect(mockOnToggle).toHaveBeenCalledWith('1', true);
  });

  it('calls onDelete when delete button is clicked', () => {
    render(
      <TodoItem
        {...mockTodo}
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
        onEdit={mockOnEdit}
      />
    );

    const deleteButton = screen.getByText('Delete');
    fireEvent.click(deleteButton);

    expect(mockOnDelete).toHaveBeenCalledWith('1');
  });

  it('calls onEdit when edit button is clicked', () => {
    render(
      <TodoItem
        {...mockTodo}
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
        onEdit={mockOnEdit}
      />
    );

    const editButton = screen.getByText('Edit');
    fireEvent.click(editButton);

    expect(mockOnEdit).toHaveBeenCalledWith('1', 'Test Todo', 'Test Description');
  });

  it('does not show edit button when onEdit is not provided', () => {
    render(
      <TodoItem
        {...mockTodo}
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
        // onEdit is not provided
      />
    );

    expect(screen.queryByText('Edit')).not.toBeInTheDocument();
  });
});