import React, { useState } from 'react';
import { Task, TaskType } from '../../types';
import Button from '../Button';

interface CreateTaskFormProps {
    currentUserPoints: number;
    onCreateTask: (newTaskData: Omit<Task, 'id' | 'userId' | 'userName' | 'userAvatar' | 'completed' | 'status' | 'createdAt'>) => void;
    onClose: () => void;
}

const taskOptions = [
    { type: TaskType.FOLLOW, label: 'Follow', reward: 5 },
    { type: TaskType.LIKE, label: 'Like', reward: 1 },
    { type: TaskType.SHARE, label: 'Share', reward: 3 },
    { type: TaskType.VIEW, label: 'View', reward: 1 },
];

const CreateTaskForm: React.FC<CreateTaskFormProps> = ({ currentUserPoints, onCreateTask, onClose }) => {
    const [taskType, setTaskType] = useState<TaskType>(TaskType.LIKE);
    const [targetUrl, setTargetUrl] = useState('');
    const [quantity, setQuantity] = useState(10);

    const selectedTask = taskOptions.find(opt => opt.type === taskType)!;
    const totalCost = selectedTask.reward * quantity;
    const canAfford = currentUserPoints >= totalCost;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!targetUrl || !/^(ftp|http|https|chrome|:\/\/|\.|@){2,}(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!-/]))?$/.test(targetUrl)) {
            alert('Silakan masukkan URL Facebook yang valid.');
            return;
        }
        if (!canAfford) {
            alert('Poin Anda tidak cukup untuk membuat tugas ini.');
            return;
        }
        onCreateTask({
            type: taskType,
            targetUrl,
            quantity,
            reward: selectedTask.reward
        });
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="bg-gray-800 border border-gray-700 rounded-xl shadow-2xl p-6 sm:p-8 w-full max-w-lg relative" onClick={(e) => e.stopPropagation()}>
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl font-bold">&times;</button>
                <h2 className="text-2xl font-bold text-blue-400 mb-6 text-center">Buat Tugas Baru</h2>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Jenis Tugas</label>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                            {taskOptions.map(opt => (
                                <button
                                    key={opt.type}
                                    type="button"
                                    onClick={() => setTaskType(opt.type)}
                                    className={`p-3 rounded-lg border-2 text-center transition-colors ${
                                        taskType === opt.type ? 'border-blue-500 bg-blue-500/20' : 'border-gray-600 hover:border-gray-500'
                                    }`}
                                >
                                    <span className="block font-semibold">{opt.label}</span>
                                    <span className="text-xs text-gray-400">({opt.reward} poin)</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label htmlFor="targetUrl" className="block text-sm font-medium text-gray-300 mb-2">URL Target (Facebook)</label>
                        <input
                            id="targetUrl"
                            type="url"
                            value={targetUrl}
                            onChange={(e) => setTargetUrl(e.target.value)}
                            placeholder="https://www.facebook.com/username/posts/123"
                            required
                            className="w-full bg-gray-900 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    
                    <div>
                        <label htmlFor="quantity" className="block text-sm font-medium text-gray-300 mb-2">Jumlah Interaksi ({quantity})</label>
                         <input
                            id="quantity"
                            type="range"
                            min="10"
                            max="500"
                            step="5"
                            value={quantity}
                            onChange={(e) => setQuantity(parseInt(e.target.value))}
                            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer range-thumb"
                        />
                    </div>

                    <div className="bg-gray-900/50 p-4 rounded-lg text-center">
                        <p className="text-gray-400">Total Biaya:</p>
                        <p className={`text-2xl font-bold ${canAfford ? 'text-yellow-400' : 'text-red-500'}`}>
                            {totalCost.toLocaleString()} Poin
                        </p>
                        <p className="text-sm text-gray-500">Poin Anda: {currentUserPoints.toLocaleString()}</p>
                    </div>

                    <div className="flex justify-end gap-4">
                        <Button type="button" variant="secondary" onClick={onClose}>Batal</Button>
                        <Button type="submit" disabled={!canAfford || !targetUrl}>Buat Tugas</Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateTaskForm;
