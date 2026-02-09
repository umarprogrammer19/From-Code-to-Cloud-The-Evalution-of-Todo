import { Task, TaskCreate, TaskUpdate } from '../app/types/task';
import { getStoredJwt } from './authService'; // Import the function

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";

// Helper function for API calls
export class ApiError extends Error {
    constructor(message: string, public status: number) {
        super(message);
    }
}

async function callApi<T>(
    endpoint: string,
    method: string,
    body?: any
): Promise<T> {
    const headers: HeadersInit = {
        'Content-Type': 'application/json',
    };

    const jwt = getStoredJwt();
    if (jwt) {
        headers['Authorization'] = `Bearer ${jwt}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method,
        headers, // Use the modified headers
        body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
        let errorData;
        try {
            errorData = await response.json();
        } catch (e) {
            errorData = { detail: `API Error: ${response.statusText}` };
        }
        throw new ApiError(errorData.detail || `API Error: ${response.statusText}`, response.status);
    }

    // Handle 204 No Content for delete operations
    if (response.status === 204) {
        return null as T;
    }

    return response.json();
}

// Authentication API calls
export async function loginUser(email: string, password: string): Promise<{ access_token: string }> {
    const formBody = new URLSearchParams();
    formBody.append('username', email);
    formBody.append('password', password);

    const response = await fetch(`${API_BASE_URL}/api/token`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formBody.toString(),
    });

    if (!response.ok) {
        let errorData;
        try {
            errorData = await response.json();
        } catch (e) {
            errorData = { detail: `API Error: ${response.statusText}` };
        }
        throw new ApiError(errorData.detail || `API Error: ${response.statusText}`, response.status);
    }
    return response.json();
}

export async function signupUser(email: string, password: string, name: string): Promise<{ access_token: string }> {
    const response = await fetch(`${API_BASE_URL}/api/users/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, name }),
    });

    if (!response.ok) {
        let errorData;
        try {
            errorData = await response.json();
        } catch (e) {
            errorData = { detail: `API Error: ${response.statusText}` };
        }
        throw new ApiError(errorData.detail || `API Error: ${response.statusText}`, response.status);
    }

    return response.json();
}


export async function getTasks(
    search?: string,
    filters?: {
        status?: Task['status'] | 'all';
        priority?: Task['priority'] | 'all';
        categories?: string[];
        created_after?: string;
        due_before?: string;
    }
): Promise<Task[]> {
    let endpoint = `/api/users/tasks`;
    const queryParams = new URLSearchParams();

    if (search) {
        queryParams.append('search', search);
    }
    if (filters) {
        if (filters.status && filters.status !== 'all') queryParams.append('status', filters.status);
        if (filters.priority && filters.priority !== 'all') queryParams.append('priority', filters.priority);
        if (filters.categories && filters.categories.length > 0) queryParams.append('categories', filters.categories.join(','));
        if (filters.created_after) queryParams.append('created_after', filters.created_after);
        if (filters.due_before) queryParams.append('due_before', filters.due_before);
    }

    if (queryParams.toString()) {
        endpoint += `?${queryParams.toString()}`;
    }

    return callApi<Task[]>(endpoint, 'GET');
}

export async function createTask(task: TaskCreate): Promise<Task> {
    return callApi<Task>(`/api/users/tasks`, 'POST', task);
}

export async function updateTask(taskId: string, task: TaskUpdate): Promise<Task> {
    return callApi<Task>(`/api/users/tasks/${taskId}`, 'PUT', task);
}

export async function deleteTask(taskId: string): Promise<void> {
    return callApi<void>((`/api/users/tasks/${taskId}`), 'DELETE');
}

export async function toggleTaskCompletion(taskId: string): Promise<Task> {
    // Fetch the current task
    const task = await callApi<Task>(`/api/users/tasks/${taskId}`, 'GET');
    // Update the status by calling PUT
    return callApi<Task>(`/api/users/tasks/${taskId}`, 'PUT', {
        ...task,
        status: task.status === 'completed' ? 'pending' : 'completed'
    });
}

export async function bulkDeleteTasks(taskIds: string[]): Promise<void> {
    // Since backend doesn't support bulk delete, delete each task individually
    const deletePromises = taskIds.map(taskId =>
        callApi<void>(`/api/users/tasks/${taskId}`, 'DELETE')
    );
    await Promise.all(deletePromises);
}

export async function bulkToggleTaskCompletion(taskIds: string[], status: 'pending' | 'completed'): Promise<Task[]> {
    // Since backend doesn't support bulk toggle, toggle each task individually
    const promises = taskIds.map(taskId =>
        callApi<Task>(`/api/users/tasks/${taskId}`, 'PUT', { status })
    );
    return Promise.all(promises);
}

export async function exportTasks(format: 'json' | 'csv'): Promise<any> {
    // Since backend doesn't support export, fetch all tasks and format on frontend
    const tasks = await getTasks();
    if (format === 'json') {
        return JSON.stringify(tasks, null, 2);
    } else { // CSV
        if (!tasks || tasks.length === 0) return '';

        // Create CSV header from task keys
        const headers = Object.keys(tasks[0]);
        const csvHeader = headers.join(',');

        // Create CSV rows
        const csvRows = tasks.map(task => {
            return headers.map(header => {
                // Handle potential commas or quotes in values
                const value = task[header as keyof typeof task];
                return typeof value === 'string' && value.includes(',') ? `"${value}"` : value;
            }).join(',');
        });

        return [csvHeader, ...csvRows].join('\n');
    }
}
