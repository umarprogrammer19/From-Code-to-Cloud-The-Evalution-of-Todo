// frontend/src/app/types/task.ts
export interface Task {
    id: string;
    user_id: string; // Assuming UUID from backend is string in frontend
    title: string;
    description?: string;
    status: 'pending' | 'completed'; // Matches backend enum
    priority: 'low' | 'medium' | 'high'; // Matches backend enum
    categories?: string[];
    is_recurring?: boolean;
    recurrence_pattern?: 'daily' | 'weekly' | 'monthly'; // Matches backend enum
    created_at: string; // Assuming datetime from backend is string in frontend
    due_date?: string; // Assuming datetime from backend is string in frontend
    updated_at: string; // Assuming datetime from backend is string in frontend
}

// Optional: Define DTOs for creation and update if they differ significantly
export interface TaskCreate {
    title: string;
    description?: string;
    due_date?: string;
    status?: 'pending' | 'completed';
    priority?: 'low' | 'medium' | 'high';
    categories?: string[];
    is_recurring?: boolean;
    recurrence_pattern?: 'daily' | 'weekly' | 'monthly';
}

export interface TaskUpdate {
    title?: string;
    description?: string;
    due_date?: string;
    status?: 'pending' | 'completed';
    priority?: 'low' | 'medium' | 'high';
    categories?: string[];
    is_recurring?: boolean;
    recurrence_pattern?: 'daily' | 'weekly' | 'monthly';
}
