import { DemoCredential, UserProfile } from '../types';

export const DEMO_CREDENTIALS: DemoCredential[] = [
  {
    label: 'Publisher Account',
    email: 'alex.chen@adpulse.io',
    password: 'Publisher2026!',
    name: 'Alex Chen',
    role: 'Verified Web Publisher',
    publisherId: 'pub-84920491823100',
    earningsThisMonth: '$4,289.40',
  },
  {
    label: 'Media Network',
    email: 'sarah.miller@adpulse.io',
    password: 'AdRevenue#2026',
    name: 'Sarah Miller',
    role: 'Digital Media Network',
    publisherId: 'pub-91823746194200',
    earningsThisMonth: '$12,850.25',
  },
];

export const INITIAL_USER: UserProfile = {
  name: 'Alex Chen',
  email: 'alex.chen@adpulse.io',
  role: 'Verified Web Publisher',
  publisherId: 'pub-84920491823100',
  website: 'techpulse-daily.com',
};
