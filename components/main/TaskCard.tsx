import React from 'react';
import { Task, TaskType } from '../../types';
import Button from '../Button';
import { UserPlusIcon } from '../icons/UserPlusIcon';
import { ThumbsUpIcon } from '../icons/ThumbsUpIcon';
import { ShareIcon } from '../icons/ShareIcon';
import { EyeIcon } from '../icons/EyeIcon';

interface TaskCardProps {
  task: Task;
  onComplete: (task: Task) => void;
  submissionStatus: 'none' | 'pending' | 'completed';
}

const taskIcons: Record<TaskType, React.FC<React.SVGProps<SVGSVGElement>>> = {
  [TaskType.FOLLOW]: UserPlusIcon,
  [TaskType.LIKE]: ThumbsUpIcon,
  [TaskType.SHARE]: ShareIcon,
  [TaskType.VIEW]: EyeIcon,
};

const taskLabels: Record<TaskType, string> = {
  [TaskType.FOLLOW]: 'Ikuti Profil',
  [TaskType.LIKE]: 'Sukai Postingan',
  [TaskType.SHARE]: 'Bagikan Konten',
  [TaskType.VIEW]: 'Tonton Video',
};

const TaskCard: React.FC<TaskCardProps> = ({ task, onComplete, submissionStatus }) => {
  const Icon = taskIcons[task.type];

  const handleOpenLink = () => {
    window.open(task.targetUrl, '_blank', 'noopener,noreferrer');
  };

  const handleCompleteClick = () => {
    onComplete(task);
  };

  const getButtonState = () => {
      switch (submissionStatus) {
          case 'pending':
              return { text: 'Menunggu Verifikasi', disabled: true };
          case 'completed':
               return { text: 'Telah Selesai', disabled: true };
          case 'none':
          default:
              return { text: 'Kirim Bukti', disabled: false };
      }
  }
  
  const { text: buttonText, disabled: isButtonDisabled } = getButtonState();
  
  return (
    <div className="bg-gray-800/70 backdrop-blur-sm border border-gray-700 rounded-xl shadow-lg p-4 flex flex-col justify-between transition-all duration-300 hover:shadow-blue-500/20 hover:border-blue-500/50 hover:-translate-y-1">
      <div>
        <div className="flex items-center mb-3">
          <Icon className="w-8 h-8 text-blue-400 mr-3 flex-shrink-0" />
          <div>
            <h3 className="font-bold text-lg text-white">{taskLabels[task.type]}</h3>
            <p className="text-sm text-yellow-400 font-semibold">+{task.reward} Poin</p>
          </div>
        </div>
        <div className="flex items-center gap-3 mb-4 p-2 bg-gray-900/50 rounded-lg">
            <img src={task.userAvatar} alt={task.userName} className="w-10 h-10 rounded-full" />
            <div>
              <p className="text-sm text-gray-300">Tugas dari:</p>
              <p className="font-semibold text-white">{task.userName}</p>
            </div>
        </div>
         <div className="text-xs text-gray-400 mb-4">
            Progress: {task.completed}/{task.quantity}
            <div className="w-full bg-gray-700 rounded-full h-1.5 mt-1">
              <div className="bg-green-500 h-1.5 rounded-full transition-all duration-500" style={{ width: `${(task.completed / task.quantity) * 100}%` }}></div>
            </div>
        </div>
      </div>
      <div className="mt-auto flex flex-col sm:flex-row gap-2">
        <Button onClick={handleOpenLink} variant="secondary" className="w-full text-sm py-2">
          Buka Tautan
        </Button>
        <Button onClick={handleCompleteClick} disabled={isButtonDisabled} className="w-full text-sm py-2">
          {buttonText}
        </Button>
      </div>
    </div>
  );
};

export default TaskCard;
