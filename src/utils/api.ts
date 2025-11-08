// In development, use the Vite proxy (/api)
// In production, use the full API URL
const API_BASE_URL = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? '' : 'http://localhost:3001');

export interface Group {
  id: string;
  name: string;
  description: string;
  location?: string;
  program?: string;
  school?: string;
  members: number;
  category: string;
  memberIds: string[];
}

export interface GroupsResponse {
  joined: Group[];
  relevant: Group[];
  all: Group[];
}

// Fetch groups for a user
export const fetchGroups = async (
  userId: string,
  location?: string,
  program?: string,
  school?: string
): Promise<GroupsResponse> => {
  const params = new URLSearchParams({
    userId,
    ...(location && { location }),
    ...(program && { program }),
    ...(school && { school }),
  });

  const response = await fetch(`${API_BASE_URL}/api/groups?${params}`);
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: response.statusText }));
    throw new Error(errorData.error || `Failed to fetch groups: ${response.statusText}`);
  }
  const data = await response.json();
  // Check if response has error field
  if (data.error) {
    throw new Error(data.error);
  }
  return data;
};

// Initialize groups
export const initializeGroups = async (): Promise<{ success: boolean; created: number; total: number }> => {
  const response = await fetch(`${API_BASE_URL}/api/groups/initialize`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: response.statusText }));
    throw new Error(errorData.error || errorData.hint || `Failed to initialize groups: ${response.statusText}`);
  }
  const data = await response.json();
  if (data.error) {
    throw new Error(data.error);
  }
  return data;
};

// Join a group
export const joinGroup = async (groupId: string, userId: string): Promise<{ success: boolean; message: string }> => {
  const response = await fetch(`${API_BASE_URL}/api/groups/${groupId}/join`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userId }),
  });
  if (!response.ok) {
    throw new Error(`Failed to join group: ${response.statusText}`);
  }
  return response.json();
};

// Get user's joined groups
export const getUserGroups = async (userId: string): Promise<{ groups: Group[] }> => {
  const response = await fetch(`${API_BASE_URL}/api/groups/user/${userId}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch user groups: ${response.statusText}`);
  }
  return response.json();
};

