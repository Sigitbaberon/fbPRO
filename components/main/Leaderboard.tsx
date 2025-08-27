import React, { useMemo } from 'react';
import { UserProfile } from '../../types';
import { TrophyIcon } from '../icons/TrophyIcon';

interface LeaderboardProps {
    users: UserProfile[];
    currentUserId: number;
}

const Leaderboard: React.FC<LeaderboardProps> = ({ users, currentUserId }) => {
    const sortedUsers = useMemo(() => {
        return [...users].sort((a, b) => b.points - a.points);
    }, [users]);

    const getRankColor = (rank: number) => {
        if (rank === 0) return 'text-yellow-400 border-yellow-400';
        if (rank === 1) return 'text-gray-300 border-gray-300';
        if (rank === 2) return 'text-yellow-600 border-yellow-600';
        return 'text-gray-400 border-gray-600';
    };

    return (
        <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-6 text-blue-400 flex items-center justify-center gap-2">
                <TrophyIcon className="w-8 h-8"/> Papan Peringkat Mingguan
            </h2>
            <div className="space-y-3">
                {sortedUsers.map((user, index) => (
                    <div
                        key={user.id}
                        className={`bg-gray-800/70 border border-gray-700 rounded-lg p-4 flex items-center gap-4 transition-all duration-300 ${
                            user.id === currentUserId ? 'ring-2 ring-blue-500 scale-105 shadow-lg' : ''
                        }`}
                    >
                        <div className={`flex-shrink-0 w-12 h-12 flex items-center justify-center text-xl font-bold rounded-full border-2 ${getRankColor(index)}`}>
                            {index < 3 ? <TrophyIcon className="w-6 h-6" /> : `#${index + 1}`}
                        </div>
                        <img src={user.avatarUrl} alt={user.name} className="w-12 h-12 rounded-full" />
                        <div className="flex-grow">
                            <p className={`font-bold ${user.id === currentUserId ? 'text-blue-400' : 'text-white'}`}>{user.name}</p>
                            <p className="text-sm text-gray-400">Tugas Selesai: {user.stats.tasksCompleted.toLocaleString()}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-lg font-bold text-yellow-400">{user.points.toLocaleString()}</p>
                            <p className="text-xs text-gray-500">Poin</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Leaderboard;
