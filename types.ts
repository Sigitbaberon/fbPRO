export enum AppStep {
  DONATION = 'donation',
  UPLOAD = 'upload',
  VERIFICATION = 'verification',
  ACCESS = 'access',
  MAIN_APP = 'main_app',
}

export enum TaskType {
  FOLLOW = 'follow',
  LIKE = 'like',
  SHARE = 'share',
  VIEW = 'view',
}

export enum UserTier {
  MEMBER = 'Anggota',
  TRUSTED = 'Anggota Terpercaya',
  VETERAN = 'Veteran',
  ELITE = 'Elit',
}

export interface Task {
  id: string;
  userId: number;
  userName: string;
  userAvatar: string;
  type: TaskType;
  targetUrl: string;
  reward: number;
  quantity: number;
  completed: number;
  status: 'active' | 'completed' | 'pending_verification';
  createdAt: Date;
}

export interface UserProfile {
  id: number;
  name: string;
  avatarUrl: string;
  points: number;
  reputation: number;
  tier: UserTier;
  stats: {
    tasksCompleted: number;
    pointsEarned: number;
  };
  lastDailyBonusClaimed: string | null; // ISO Date string
}

export interface TaskSubmission {
    id: string;
    taskId: string;
    taskType: TaskType;
    taskTargetUrl: string;
    submitterId: number;
    proofImageUrl: string; // Data URL for the screenshot
    status: 'pending' | 'approved' | 'rejected';
    reviewedBy: { [userId: number]: 'approved' | 'rejected' };
    createdAt: Date;
}
