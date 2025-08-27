import React from 'react';
import Card from '../Card';
import Button from '../Button';
import { QRIS_IMAGE_URL } from '../../constants';

interface DonationStepProps {
  onComplete: () => void;
}

const DonationStep: React.FC<DonationStepProps> = ({ onComplete }) => {
  return (
    <Card className="text-center">
      <h2 className="text-2xl font-bold text-blue-400 mb-2">Langkah 1: Lakukan Donasi</h2>
      <p className="text-gray-400 mb-6">
        Untuk mendapatkan akses, silakan lakukan donasi sebesar Rp10.000 melalui QRIS di bawah ini.
      </p>
      <div className="flex justify-center mb-6">
        <img
          src={QRIS_IMAGE_URL}
          alt="QRIS Donation"
          className="rounded-lg shadow-lg w-64 h-64 object-contain bg-white p-2"
        />
      </div>
      <p className="text-sm text-gray-500 mb-6">
        Simpan bukti pembayaran Anda. Anda akan membutuhkannya pada langkah berikutnya.
      </p>
      <Button onClick={onComplete}>
        Saya Sudah Donasi, Lanjutkan
      </Button>
    </Card>
  );
};

export default DonationStep;
