import React from 'react';
import { UserProfile, UserTier } from '../../types';
import { ShieldIcon } from '../icons/ShieldIcon';

interface ProfileProps {
    user: UserProfile;
}

const StatCard: React.FC<{ label: string; value: string | number; }> = ({ label, value }) => (
    <div className="bg-gray-900/50 p-4 rounded-lg text-center">
        <p className="text-2xl font-bold text-blue-400">{typeof value === 'number' ? value.toLocaleString() : value}</p>
        <p className="text-sm text-gray-400">{label}</p>
    </div>
);

const tierColors: Record<UserTier, string> = {
    [UserTier.MEMBER]: 'text-gray-400 bg-gray-700/50',
    [UserTier.TRUSTED]: 'text-cyan-400 bg-cyan-900/50',
    [UserTier.VETERAN]: 'text-indigo-400 bg-indigo-900/50',
    [UserTier.ELITE]: 'text-amber-400 bg-amber-900/50',
};

const Profile: React.FC<ProfileProps> = ({ user }) => {
    
    const lastBonusDate = user.lastDailyBonusClaimed
        ? new Date(user.lastDailyBonusClaimed).toLocaleDateString('id-ID', {
            day: 'numeric', month: 'long', year: 'numeric'
        })
        : 'Belum Pernah';

    return (
        <div className="max-w-2xl mx-auto bg-gray-800/60 border border-gray-700 rounded-xl shadow-lg p-8 text-center">
            <img src={user.avatarUrl} alt={user.name} className="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-blue-500" />
            <h2 className="text-3xl font-bold text-white mb-1">{user.name}</h2>
            <div className={`inline-block px-3 py-1 text-sm font-bold rounded-full mb-2 ${tierColors[user.tier]}`}>
                {user.tier}
            </div>
            
            <div className="flex justify-center items-center gap-2 mb-6">
                <ShieldIcon className="w-6 h-6 text-green-400"/>
                <p className="text-green-400 text-xl font-semibold">
                    {user.reputation.toLocaleString()} Skor Reputasi
                </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <StatCard label="Total Poin" value={user.points} />
                <StatCard label="Total Tugas Selesai" value={user.stats.tasksCompleted} />
                <StatCard label="Bonus Harian Terakhir" value={lastBonusDate} />
            </div>

            <p className="text-gray-500 text-sm">
                Jaga reputasi Anda tetap tinggi dengan menyelesaikan tugas secara jujur dan berpartisipasi dalam patroli verifikasi.
            </p>
        </div>
    );
};

export default Profile;
