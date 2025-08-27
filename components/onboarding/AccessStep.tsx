import React, { useState } from 'react';
import Card from '../Card';
import Button from '../Button';
import { CheckCircleIcon } from '../icons/CheckCircleIcon';
import { CopyIcon } from '../icons/CopyIcon';

interface AccessStepProps {
  accessCode: string;
  onEnterApp: () => void;
}

const AccessStep: React.FC<AccessStepProps> = ({ accessCode, onEnterApp }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(accessCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="text-center">
      <div className="flex flex-col items-center">
        <CheckCircleIcon className="w-16 h-16 text-green-500 mb-4" />
        <h2 className="text-2xl font-bold text-green-400 mb-2">Selamat! Verifikasi Berhasil!</h2>
        <p className="text-gray-400 mb-6">
          Gunakan kode di bawah ini untuk masuk ke aplikasi. Simpan kode ini baik-baik.
        </p>

        <div className="relative w-full max-w-sm bg-gray-900 border border-gray-700 rounded-lg p-4 mb-6">
          <p className="text-2xl font-mono tracking-widest text-yellow-400">{accessCode}</p>
          <button
            onClick={handleCopy}
            className="absolute top-2 right-2 p-2 rounded-md hover:bg-gray-700 transition-colors text-gray-400 hover:text-white"
            title="Salin kode"
          >
            <CopyIcon className="w-5 h-5" />
          </button>
        </div>
        
        {copied && <p className="text-green-500 text-sm mb-4">Kode berhasil disalin!</p>}

        <Button onClick={onEnterApp}>
          Masuk ke Aplikasi
        </Button>
      </div>
    </Card>
  );
};

export default AccessStep;
