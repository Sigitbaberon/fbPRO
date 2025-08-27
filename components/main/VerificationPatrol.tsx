import React, { useState } from 'react';
import { TaskSubmission, TaskType } from '../../types';
import Button from '../Button';
import { ThumbsUpIcon } from '../icons/ThumbsUpIcon';
import { UserPlusIcon } from '../icons/UserPlusIcon';
import { ShareIcon } from '../icons/ShareIcon';
import { EyeIcon } from '../icons/EyeIcon';

interface VerificationPatrolProps {
  submissions: TaskSubmission[];
  onVerify: (submissionId: string, isApproved: boolean) => void;
}

const taskIcons: Record<TaskType, React.FC<React.SVGProps<SVGSVGElement>>> = {
  [TaskType.FOLLOW]: UserPlusIcon,
  [TaskType.LIKE]: ThumbsUpIcon,
  [TaskType.SHARE]: ShareIcon,
  [TaskType.VIEW]: EyeIcon,
};

const VerificationPatrol: React.FC<VerificationPatrolProps> = ({ submissions, onVerify }) => {
  const [expandedImage, setExpandedImage] = useState<string | null>(null);

  if (submissions.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p className="text-lg">Tidak ada bukti yang menunggu untuk diverifikasi saat ini.</p>
        <p>Terima kasih telah membantu menjaga komunitas tetap jujur!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {submissions.map(sub => {
        const Icon = taskIcons[sub.taskType];
        return (
          <div key={sub.id} className="bg-gray-800/60 border border-gray-700 rounded-lg p-4">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Left Side: Proof Image */}
              <div className="md:w-1/3 flex-shrink-0">
                <p className="font-semibold text-gray-300 mb-2">Bukti Screenshot:</p>
                <img
                  src={sub.proofImageUrl}
                  alt="Bukti penyelesaian tugas"
                  className="rounded-lg w-full h-auto object-cover cursor-pointer"
                  onClick={() => setExpandedImage(sub.proofImageUrl)}
                />
              </div>
              {/* Right Side: Details & Actions */}
              <div className="flex-grow">
                <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                        <Icon className="w-8 h-8 text-blue-400"/>
                        <div>
                            <h3 className="text-lg font-bold text-white capitalize">Verifikasi Tugas {sub.taskType}</h3>
                            <a href={sub.taskTargetUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-400 hover:underline">
                                Buka Tautan Tugas Asli
                            </a>
                        </div>
                    </div>
                    <span className="bg-yellow-500/20 text-yellow-400 text-xs font-bold px-2 py-1 rounded-full">
                        Menunggu
                    </span>
                </div>
                
                <p className="text-gray-400 text-sm mb-4">
                    Tinjau screenshot di samping. Apakah bukti ini menunjukkan bahwa tugas telah diselesaikan dengan benar?
                </p>

                <div className="flex gap-4">
                  <Button onClick={() => onVerify(sub.id, true)} className="w-full bg-green-600 hover:bg-green-700 focus:ring-green-500">
                    Setujui
                  </Button>
                  <Button onClick={() => onVerify(sub.id, false)} className="w-full bg-red-600 hover:bg-red-700 focus:ring-red-500">
                    Tolak
                  </Button>
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {/* Expanded Image Modal */}
      {expandedImage && (
        <div 
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 animate-fade-in"
            onClick={() => setExpandedImage(null)}
        >
            <img src={expandedImage} alt="Expanded proof" className="max-w-full max-h-full rounded-lg"/>
        </div>
      )}
    </div>
  );
};

export default VerificationPatrol;
