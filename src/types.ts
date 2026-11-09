export type PageView = 'login' | 'register' | 'forgot-password' | 'dashboard';

export interface UserProfile {
  name: string;
  email: string;
  role: string;
  publisherId: string;
  website?: string;
  avatarUrl?: string;
}

export interface DemoCredential {
  label: string;
  email: string;
  password: string;
  name: string;
  role: string;
  publisherId: string;
  earningsThisMonth: string;
}

export interface FirestoreProduct {
  id: string;
  name: string;
  price: number;
  createTime?: string;
  updateTime?: string;
}
