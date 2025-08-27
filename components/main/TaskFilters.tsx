import React from 'react';
import { TaskType } from '../../types';

interface TaskFiltersProps {
    filterType: TaskType | 'all';
    setFilterType: (type: TaskType | 'all') => void;
    sortBy: 'newest' | 'reward';
    setSortBy: (sort: 'newest' | 'reward') => void;
}

const filterOptions: { value: TaskType | 'all'; label: string }[] = [
    { value: 'all', label: 'Semua' },
    { value: TaskType.FOLLOW, label: 'Follow' },
    { value: TaskType.LIKE, label: 'Like' },
    { value: TaskType.SHARE, label: 'Share' },
    { value: TaskType.VIEW, label: 'View' },
];

const sortOptions: { value: 'newest' | 'reward'; label: string }[] = [
    { value: 'newest', label: 'Terbaru' },
    { value: 'reward', label: 'Hadiah Tertinggi' },
];

const TaskFilters: React.FC<TaskFiltersProps> = ({ filterType, setFilterType, sortBy, setSortBy }) => {
    return (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 p-4 bg-gray-900/50 rounded-lg">
            {/* Filter by Type */}
            <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-semibold text-gray-400 mr-2">Filter:</span>
                {filterOptions.map(opt => (
                    <button
                        key={opt.value}
                        onClick={() => setFilterType(opt.value)}
                        className={`px-3 py-1 text-sm rounded-full transition-colors ${
                            filterType === opt.value
                                ? 'bg-blue-600 text-white font-bold'
                                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        }`}
                    >
                        {opt.label}
                    </button>
                ))}
            </div>

            {/* Sort by */}
            <div className="flex items-center gap-2">
                 <span className="text-sm font-semibold text-gray-400 mr-2">Urutkan:</span>
                 <select 
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as 'newest' | 'reward')}
                    className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2"
                >
                    {sortOptions.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                 </select>
            </div>
        </div>
    );
};

export default TaskFilters;
