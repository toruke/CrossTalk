// CrossTalk API Service
import { config } from '@/src/lib/config';

const API_BASE_URL = config.apiUrl;

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

// API Service
export const api = {
  // Test endpoint
  async ping(): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE_URL}/`);
    if (!response.ok) throw new Error('API is not available');
    return response.json();
  },

  // Authentication
  async login(email: string, password: string): Promise<LoginResponse> {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error('Login failed');
    }

    return response.json();
  },

  // Get all courses
  async getCourses(): Promise<Course[]> {
    const response = await fetch(`${API_BASE_URL}/courses`);

    if (!response.ok) {
      throw new Error('Failed to fetch courses');
    }

    return response.json();
  },

  // Get user's enrolled courses
  async getMyCourses(userId: string): Promise<Course[]> {
    const response = await fetch(`${API_BASE_URL}/my-courses/${userId}`);

    if (!response.ok) {
      throw new Error('Failed to fetch user courses');
    }

    return response.json();
  },

  // Get messages between two users
  async getMessages(userId: string, contactId: string): Promise<Message[]> {
    const response = await fetch(`${API_BASE_URL}/messages/${userId}/${contactId}`);

    if (!response.ok) {
      throw new Error('Failed to fetch messages');
    }

    return response.json();
  },

  // Send a message
  async sendMessage(senderId: string, receiverId: string, content: string): Promise<Message> {
    const response = await fetch(`${API_BASE_URL}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
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
    const response = await fetch(`${API_BASE_URL}/teachers`);

    if (!response.ok) {
      throw new Error('Failed to fetch teachers');
    }

    return response.json();
  },

  // Get teachers for user's enrolled courses
  async getMyTeachers(userId: string): Promise<Teacher[]> {
    const response = await fetch(`${API_BASE_URL}/my-teachers/${userId}`);

    if (!response.ok) {
      throw new Error('Failed to fetch my teachers');
    }

    return response.json();
  },

  // Enroll in a course
  async enrollInCourse(userId: number, courseId: number): Promise<{ id: number }> {
    const response = await fetch(`${API_BASE_URL}/enrollments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
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
    });

    if (!response.ok) {
      throw new Error('Failed to unenroll');
    }

    return response.json();
  },
};
