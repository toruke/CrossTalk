// CrossTalk API Service
import { config } from '@/src/lib/config';

const API_BASE_URL = config.apiUrl;

// Auth: stocke le clerkId pour l'envoyer en header
let _clerkId: string | null = null;

export function setClerkId(id: string) {
  _clerkId = id;
}

function getHeaders(): Record<string, string> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (_clerkId) {
    headers['x-clerk-id'] = _clerkId;
  }
  return headers;
}

export interface Course {
  id: string;
  language: string;
  level: string;
  teacher: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  teacherId: string;
}

export interface Teacher {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  coursesTaught: {
    id: string;
    language: string;
    level: string;
  }[];
}

export interface Message {
  id: string;
  content: string;
  senderId: string;
  receiverId: string;
  timestamp: string;
  createdAt: string;
}

export interface LoginResponse {
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  };
  token?: string;
}

export interface AdminUser {
  id: number;
  clerkId: string | null;
  email: string;
  firstName: string;
  lastName: string;
  role: 'ADMIN' | 'PROF' | 'ELEVE';
}

export interface AdminStats {
  users: { total: number; admins: number; profs: number; eleves: number };
  courses: { total: number };
  enrollments: { total: number };
  lessons: { total: number };
  quizAttempts: { total: number };
  recentEnrollments: Array<{
    id: number;
    joinedAt: string;
    user: { id: number; firstName: string; lastName: string; email: string };
    course: { id: number; language: string; level: string };
  }>;
  recentUsers: Array<{
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
  }>;
}

// API Service
export const api = {
  // Test endpoint
  async ping(): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE_URL}/`, { headers: getHeaders() });
    if (!response.ok) throw new Error('API is not available');
    return response.json();
  },

  // Authentication
  async login(email: string, password: string): Promise<LoginResponse> {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error('Login failed');
    }

    return response.json();
  },

  // Get all courses
  async getCourses(): Promise<Course[]> {
    const response = await fetch(`${API_BASE_URL}/courses`, { headers: getHeaders() });

    if (!response.ok) {
      throw new Error('Failed to fetch courses');
    }

    return response.json();
  },

  // Get user's enrolled courses
  async getMyCourses(userId: string): Promise<Course[]> {
    const response = await fetch(`${API_BASE_URL}/my-courses/${userId}`, { headers: getHeaders() });

    if (!response.ok) {
      throw new Error('Failed to fetch user courses');
    }

    return response.json();
  },

  // Get messages between two users
  async getMessages(userId: string, contactId: string): Promise<Message[]> {
    const response = await fetch(`${API_BASE_URL}/messages/${userId}/${contactId}`, { headers: getHeaders() });

    if (!response.ok) {
      throw new Error('Failed to fetch messages');
    }

    return response.json();
  },

  // Send a message
  async sendMessage(senderId: string, receiverId: string, content: string): Promise<Message> {
    const response = await fetch(`${API_BASE_URL}/messages`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        senderId,
        receiverId,
        content,
        timestamp: new Date().toISOString(),
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to send message');
    }

    return response.json();
  },

  // Get all teachers (for admin)
  async getAllTeachers(): Promise<Teacher[]> {
    const response = await fetch(`${API_BASE_URL}/teachers`, { headers: getHeaders() });

    if (!response.ok) {
      throw new Error('Failed to fetch teachers');
    }

    return response.json();
  },

  // Get teachers for user's enrolled courses
  async getMyTeachers(userId: string): Promise<Teacher[]> {
    const response = await fetch(`${API_BASE_URL}/my-teachers/${userId}`, { headers: getHeaders() });

    if (!response.ok) {
      throw new Error('Failed to fetch my teachers');
    }

    return response.json();
  },

  // Enroll in a course
  async enrollInCourse(userId: number, courseId: number): Promise<{ id: number }> {
    const response = await fetch(`${API_BASE_URL}/enrollments`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ userId, courseId }),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || 'Failed to enroll');
    }

    return response.json();
  },

  // Unenroll from a course
  async unenrollFromCourse(userId: number, courseId: number): Promise<{ success: boolean }> {
    const response = await fetch(`${API_BASE_URL}/enrollments/${userId}/${courseId}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to unenroll');
    }

    return response.json();
  },

  // Admin: Get dashboard stats
  async getAdminStats(): Promise<AdminStats> {
    const response = await fetch(`${API_BASE_URL}/stats`, { headers: getHeaders() });
    if (!response.ok) throw new Error('Failed to fetch stats');
    return response.json();
  },

  // Admin: Get all users
  async getAllUsers(): Promise<AdminUser[]> {
    const response = await fetch(`${API_BASE_URL}/users`, { headers: getHeaders() });
    if (!response.ok) throw new Error('Failed to fetch users');
    return response.json();
  },

  // Admin: Change user role
  async changeUserRole(userId: number, role: string): Promise<AdminUser> {
    const response = await fetch(`${API_BASE_URL}/users/${userId}/role`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ role }),
    });
    if (!response.ok) throw new Error('Failed to change role');
    return response.json();
  },

  // Admin: Delete user
  async deleteUser(userId: number): Promise<{ success: boolean }> {
    const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || 'Failed to delete user');
    }
    return response.json();
  },
};
