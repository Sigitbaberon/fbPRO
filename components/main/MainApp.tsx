import React, { useState, useMemo, useCallback } from 'react';
import { UserProfile, Task, TaskType, UserTier, TaskSubmission } from '../../types';
import { DAILY_BONUS_POINTS } from '../../constants';
import Button from '../Button';
import { PlusIcon } from '../icons/PlusIcon';
import { GiftIcon } from '../icons/GiftIcon';
import TaskCard from './TaskCard';
import MyTasks from './MyTasks';
import CreateTaskForm from './CreateTaskForm';
import Leaderboard from './Leaderboard';
import Profile from './Profile';
import TaskFilters from './TaskFilters';
import Toast from '../Toast';
import ProofUploadModal from './ProofUploadModal';
import VerificationPatrol from './VerificationPatrol';

// Mock data generation
const generateMockUsers = (count: number): UserProfile[] => Array.from({ length: count }, (_, i) => {
    const points = Math.floor(Math.random() * 5000) + 200;
    return {
        id: i + 1,
        name: i === 0 ? 'Anda' : `Pengguna FBP ${101 + i}`,
        avatarUrl: `https://i.pravatar.cc/150?u=${i + 1}`,
        points: i === 0 ? 500 : points,
        reputation: i === 0 ? 100 : Math.floor(Math.random() * 50) + 70,
        tier: UserTier.MEMBER,
        stats: {
            tasksCompleted: Math.floor(Math.random() * 200),
            pointsEarned: i === 0 ? 1250 : points + Math.floor(Math.random() * 2000),
        },
        lastDailyBonusClaimed: null,
    };
});

const generateMockTasks = (users: UserProfile[]): Task[] => {
  const taskTypes = [TaskType.LIKE, TaskType.FOLLOW, TaskType.SHARE, TaskType.VIEW];
  return Array.from({ length: 25 }, (_, i) => {
    const user = users[(i + 1) % users.length]; 
    const type = taskTypes[i % taskTypes.length];
    const quantity = Math.floor(Math.random() * 41) + 10;
    const completed = Math.floor(Math.random() * quantity);
    return {
      id: `task-${i + 1}`,
      userId: user.id,
      userName: user.name,
      userAvatar: user.avatarUrl,
      type: type,
      targetUrl: 'https://facebook.com',
      reward: type === TaskType.FOLLOW ? 15 : (type === TaskType.SHARE ? 10 : 5),
      quantity,
      completed,
      status: completed >= quantity ? 'completed' : 'active',
      createdAt: new Date(Date.now() - Math.random() * 1000 * 60 * 60 * 24 * 5),
    };
  });
};

type ActiveTab = 'task_board' | 'my_tasks' | 'patrol' | 'leaderboard' | 'profile';
type SortByType = 'newest' | 'reward';
type ToastMessage = { id: number; message: string; type: 'success' | 'error' };

const MainApp: React.FC = () => {
  const [users, setUsers] = useState<UserProfile[]>(generateMockUsers(15));
  const [tasks, setTasks] = useState<Task[]>(() => generateMockTasks(users));
  const [submissions, setSubmissions] = useState<TaskSubmission[]>([]);
  const [activeTab, setActiveTab] = useState<ActiveTab>('task_board');
  const [isCreatingTask, setIsCreatingTask] = useState(false);
  const [taskForProof, setTaskForProof] = useState<Task | null>(null);
  const [submittedTaskIds, setSubmittedTaskIds] = useState<Set<string>>(new Set());
  const [filterType, setFilterType] = useState<TaskType | 'all'>('all');
  const [sortBy, setSortBy] = useState<SortByType>('newest');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const currentUser = useMemo(() => {
    const user = users.find(u => u.id === 1)!;
    let tier = UserTier.MEMBER;
    if (user.reputation >= 125) tier = UserTier.TRUSTED;
    if (user.reputation >= 175) tier = UserTier.VETERAN;
    if (user.reputation >= 250) tier = UserTier.ELITE;
    return { ...user, tier };
  }, [users]);

  const addToast = useCallback((message: string, type: 'success' | 'error' = 'success') => {
    const newToast = { id: Date.now(), message, type };
    setToasts(prev => [...prev, newToast]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== newToast.id));
    }, 3000);
  }, []);

  const handleOpenProofModal = (task: Task) => {
    if (submittedTaskIds.has(task.id)) {
      addToast('Anda sudah mengirim bukti untuk tugas ini.', 'error');
      return;
    }
    setTaskForProof(task);
  };

  const handleProofSubmit = (taskId: string, proofImageUrl: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    const newSubmission: TaskSubmission = {
      id: `sub-${Date.now()}`,
      taskId,
      taskType: task.type,
      taskTargetUrl: task.targetUrl,
      submitterId: currentUser.id,
      proofImageUrl,
      status: 'pending',
      reviewedBy: {},
      createdAt: new Date(),
    };

    setSubmissions(prev => [newSubmission, ...prev]);
    setSubmittedTaskIds(prev => new Set(prev).add(taskId));
    setTaskForProof(null);
    addToast('Bukti berhasil dikirim & sedang menunggu verifikasi.', 'success');
  };
  
  const handleVerification = (submissionId: string, isApproved: boolean) => {
    const submission = submissions.find(s => s.id === submissionId);
    if (!submission || submission.reviewedBy[currentUser.id]) {
        addToast("Anda sudah memverifikasi ini.", "error");
        return;
    }

    const verifierReward = 1; // Small reward for verifying
    setUsers(prev => prev.map(u => u.id === currentUser.id ? { ...u, points: u.points + verifierReward, reputation: u.reputation + 1 } : u));
    addToast(`+${verifierReward} Poin & +1 Reputasi untuk partisipasi patroli.`, 'success');

    const updatedSubmission: TaskSubmission = {
        ...submission,
        reviewedBy: { ...submission.reviewedBy, [currentUser.id]: isApproved ? 'approved' : 'rejected' },
    };

    const approvals = Object.values(updatedSubmission.reviewedBy).filter(v => v === 'approved').length;
    const rejections = Object.values(updatedSubmission.reviewedBy).filter(v => v === 'rejected').length;
    const approvalThreshold = 2;

    if (approvals >= approvalThreshold) {
        updatedSubmission.status = 'approved';
        const task = tasks.find(t => t.id === submission.taskId);
        if (task) {
            setTasks(prev => prev.map(t => t.id === task.id ? { ...t, completed: t.completed + 1 } : t));
            setUsers(prev => prev.map(u => u.id === submission.submitterId ? {
                ...u,
                points: u.points + task.reward,
                reputation: u.reputation + 5,
                stats: { ...u.stats, tasksCompleted: u.stats.tasksCompleted + 1, pointsEarned: u.stats.pointsEarned + task.reward },
            } : u));
        }
    } else if (rejections >= approvalThreshold) {
        updatedSubmission.status = 'rejected';
        setUsers(prev => prev.map(u => u.id === submission.submitterId ? { ...u, reputation: Math.max(0, u.reputation - 10) } : u));
    }

    setSubmissions(prev => prev.map(s => s.id === submissionId ? updatedSubmission : s));
  };


  const handleCreateTask = useCallback((newTaskData: Omit<Task, 'id' | 'userId' | 'userName' | 'userAvatar' | 'completed' | 'status' | 'createdAt'>) => {
    const totalCost = newTaskData.reward * newTaskData.quantity;
    if (currentUser.points < totalCost) {
      addToast('Poin tidak cukup!', 'error');
      return;
    }

    const newTask: Task = {
      ...newTaskData,
      id: `task-${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatarUrl,
      completed: 0,
      status: 'active',
      createdAt: new Date(),
    };

    setTasks(prev => [newTask, ...prev]);
    setUsers(prev => prev.map(user =>
      user.id === currentUser.id
        ? { ...user, points: user.points - totalCost }
        : user
    ));

    setIsCreatingTask(false);
    addToast('Tugas baru berhasil dibuat!', 'success');
    setActiveTab('my_tasks');
  }, [addToast, currentUser]);

  const myTasks = useMemo(() => {
    return tasks
      .filter(task => task.userId === currentUser.id)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }, [tasks, currentUser.id]);

  const filteredAndSortedTasks = useMemo(() => {
    return tasks
      .filter(task => task.userId !== currentUser.id && task.status === 'active')
      .filter(task => filterType === 'all' || task.type === filterType)
      .sort((a, b) => {
        if (sortBy === 'reward') {
          return b.reward - a.reward;
        }
        return b.createdAt.getTime() - a.createdAt.getTime();
      });
  }, [tasks, currentUser.id, filterType, sortBy]);

  const patrolSubmissions = useMemo(() => {
    return submissions.filter(s => s.status === 'pending' && s.submitterId !== currentUser.id && !s.reviewedBy[currentUser.id]);
  }, [submissions, currentUser.id]);


  const canClaimBonus = useMemo(() => {
    if (!currentUser.lastDailyBonusClaimed) return true;
    const lastClaim = new Date(currentUser.lastDailyBonusClaimed);
    const today = new Date();
    return lastClaim.getFullYear() !== today.getFullYear() ||
      lastClaim.getMonth() !== today.getMonth() ||
      lastClaim.getDate() !== today.getDate();
  }, [currentUser.lastDailyBonusClaimed]);

  const handleClaimDailyBonus = useCallback(() => {
    if (!canClaimBonus) {
        addToast('Bonus harian sudah diklaim hari ini.', 'error');
        return;
    }
    setUsers(prev => prev.map(user =>
        user.id === currentUser.id
            ? {
                ...user,
                points: user.points + DAILY_BONUS_POINTS,
                lastDailyBonusClaimed: new Date().toISOString(),
              }
            : user
    ));
    addToast(`Bonus harian +${DAILY_BONUS_POINTS} poin berhasil diklaim!`, 'success');
  }, [canClaimBonus, currentUser.id, addToast]);

  const TabButton: React.FC<{ tab: ActiveTab; label: string; count?: number }> = ({ tab, label, count }) => (
    <button
      onClick={() => setActiveTab(tab)}
      className={`relative px-4 py-2 rounded-md font-semibold transition-colors text-sm sm:text-base ${
        activeTab === tab
          ? 'bg-blue-600 text-white'
          : 'text-gray-300 hover:bg-gray-700'
      }`}
    >
      {label}
      {count !== undefined && count > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {count}
        </span>
      )}
    </button>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'my_tasks':
        return <MyTasks tasks={myTasks} />;
      case 'patrol':
        return <VerificationPatrol submissions={patrolSubmissions} onVerify={handleVerification} />;
      case 'leaderboard':
        return <Leaderboard users={users} currentUserId={currentUser.id} />;
      case 'profile':
        return <Profile user={currentUser} />;
      case 'task_board':
      default:
        return (
          <>
            <TaskFilters
              filterType={filterType}
              setFilterType={setFilterType}
              sortBy={sortBy}
              setSortBy={setSortBy}
            />
            {filteredAndSortedTasks.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                {filteredAndSortedTasks.map(task => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onComplete={handleOpenProofModal}
                    submissionStatus={submittedTaskIds.has(task.id) ? 'pending' : 'none'}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <p className="text-lg">Tidak ada tugas yang tersedia saat ini.</p>
                <p>Coba cek lagi nanti atau buat tugasmu sendiri!</p>
              </div>
            )}
          </>
        );
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto animate-fade-in">
      <header className="bg-gray-800/60 backdrop-blur-md border border-gray-700 rounded-xl shadow-lg p-4 mb-8 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-4">
          <img src={currentUser.avatarUrl} alt={currentUser.name} className="w-14 h-14 rounded-full border-2 border-blue-400" />
          <div>
            <h2 className="text-xl font-bold text-white">{currentUser.name}</h2>
            <p className="text-yellow-400 font-bold text-lg">{currentUser.points.toLocaleString()} Poin</p>
          </div>
        </div>
        <div className="flex items-center gap-2 sm:gap-4">
          <Button onClick={handleClaimDailyBonus} disabled={!canClaimBonus} variant='secondary' className='text-sm py-2 px-3'>
              <GiftIcon className="w-5 h-5 inline-block mr-2"/>
              {canClaimBonus ? 'Klaim Bonus' : 'Sudah Diklaim'}
          </Button>
          <Button onClick={() => setIsCreatingTask(true)} className='text-sm py-2 px-3'>
            <PlusIcon className="w-5 h-5 inline-block mr-2" />
            Buat Tugas Baru
          </Button>
        </div>
      </header>

      <div className="bg-gray-800/60 backdrop-blur-md border border-gray-700 rounded-xl shadow-lg p-4 mb-8 flex justify-center flex-wrap gap-2">
        <TabButton tab="task_board" label="Papan Tugas" />
        <TabButton tab="my_tasks" label="Tugas Saya" />
        <TabButton tab="patrol" label="Patroli" count={patrolSubmissions.length} />
        <TabButton tab="leaderboard" label="Papan Peringkat" />
        <TabButton tab="profile" label="Profil" />
      </div>

      <main>
        {renderContent()}
      </main>

      {isCreatingTask && (
        <CreateTaskForm
          currentUserPoints={currentUser.points}
          onCreateTask={handleCreateTask}
          onClose={() => setIsCreatingTask(false)}
        />
      )}

      {taskForProof && (
        <ProofUploadModal
          task={taskForProof}
          onClose={() => setTaskForProof(null)}
          onSubmit={handleProofSubmit}
        />
      )}
      
      <div className="fixed bottom-4 right-4 z-50 space-y-2">
          {toasts.map(toast => (
              <Toast key={toast.id} message={toast.message} type={toast.type} onClose={() => setToasts(p => p.filter(t => t.id !== toast.id))} />
          ))}
      </div>
    </div>
  );
};

export default MainApp;
