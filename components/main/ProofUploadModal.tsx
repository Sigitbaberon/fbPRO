import React, { useState, useRef } from 'react';
import { Task } from '../../types';
import Button from '../Button';

interface ProofUploadModalProps {
  task: Task;
  onClose: () => void;
  onSubmit: (taskId: string, proofImageUrl: string) => void;
}

const ProofUploadModal: React.FC<ProofUploadModalProps> = ({ task, onClose, onSubmit }) => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type.startsWith('image/')) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    } else {
        alert("Harap pilih file gambar.");
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async () => {
    if (file && preview) {
      setIsSubmitting(true);
      // In a real app, you might upload to a server. Here we pass the Data URL.
      onSubmit(task.id, preview);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-gray-800 border border-gray-700 rounded-xl shadow-2xl p-6 sm:p-8 w-full max-w-lg relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl font-bold" disabled={isSubmitting}>&times;</button>
        <h2 className="text-2xl font-bold text-blue-400 mb-2 text-center">Kirim Bukti Penyelesaian</h2>
        <p className="text-center text-gray-400 mb-6">Untuk tugas: <span className="font-semibold text-white">{task.type}</span></p>

        <div
          className="w-full h-48 border-2 border-dashed border-gray-600 rounded-lg flex items-center justify-center mb-4 cursor-pointer hover:border-blue-500 hover:bg-gray-700/50 transition-colors"
          onClick={handleUploadClick}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept="image/*"
          />
          {preview ? (
            <img src={preview} alt="Preview" className="h-full w-full object-contain p-2 rounded-lg" />
          ) : (
            <div className="text-gray-500 text-center">
              <p>Klik untuk memilih screenshot</p>
              <p className="text-sm">(Disarankan format JPG atau PNG)</p>
            </div>
          )}
        </div>
        
        <p className="text-xs text-gray-500 text-center mb-6">
            Pastikan bukti screenshot Anda jelas dan menunjukkan bahwa tugas telah diselesaikan. Pengiriman bukti palsu akan mengakibatkan penurunan skor reputasi.
        </p>

        <div className="flex justify-end gap-4">
            <Button type="button" variant="secondary" onClick={onClose} disabled={isSubmitting}>Batal</Button>
            <Button onClick={handleSubmit} disabled={!file || isSubmitting}>
                {isSubmitting ? 'Mengirim...' : 'Kirim Bukti'}
            </Button>
        </div>
      </div>
    </div>
  );
};

export default ProofUploadModal;
