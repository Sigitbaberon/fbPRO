import React from 'react';
import { Task, TaskType } from '../../types';
import { UserPlusIcon } from '../icons/UserPlusIcon';
import { ThumbsUpIcon } from '../icons/ThumbsUpIcon';
import { ShareIcon } from '../icons/ShareIcon';
import { EyeIcon } from '../icons/EyeIcon';

interface MyTasksProps {
  tasks: Task[];
}

const taskIcons: Record<TaskType, React.FC<React.SVGProps<SVGSVGElement>>> = {
  [TaskType.FOLLOW]: UserPlusIcon,
  [TaskType.LIKE]: ThumbsUpIcon,
  [TaskType.SHARE]: ShareIcon,
  [TaskType.VIEW]: EyeIcon,
};

const taskTypeNames: Record<TaskType, string> = {
    [TaskType.FOLLOW]: 'Follow',
    [TaskType.LIKE]: 'Like',
    [TaskType.SHARE]: 'Share',
    [TaskType.VIEW]: 'View',
};


const MyTasks: React.FC<MyTasksProps> = ({ tasks }) => {
  if (tasks.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p className="text-lg">Anda belum membuat tugas apa pun.</p>
        <p>Klik "Buat Tugas Baru" untuk memulai!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 max-w-4xl mx-auto">
      {tasks.map(task => {
        const Icon = taskIcons[task.type];
        const progress = (task.completed / task.quantity) * 100;
        const isCompleted = task.status === 'completed' || progress >= 100;

        return (
          <div key={task.id} className="bg-gray-800/60 border border-gray-700 rounded-lg p-4 flex flex-col sm:flex-row items-center gap-4">
            <div className="flex-shrink-0">
                <Icon className="w-8 h-8 text-blue-400"/>
            </div>
            <div className="flex-grow w-full">
                <div className="flex justify-between items-start mb-2 gap-2">
                    <p className="font-bold text-white break-words">
                        Tugas {taskTypeNames[task.type]}
                        <a href={task.targetUrl} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline text-sm ml-2 font-normal">
                            (Lihat Tautan)
                        </a>
                    </p>
                    <span className={`flex-shrink-0 px-2 py-1 text-xs font-bold rounded-full ${isCompleted ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                        {isCompleted ? 'Selesai' : 'Aktif'}
                    </span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2.5">
                    <div className="bg-blue-600 h-2.5 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
                </div>
                 <p className="text-right text-sm text-gray-300 mt-1 font-mono">
                    {task.completed}/{task.quantity}
                </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MyTasks;
