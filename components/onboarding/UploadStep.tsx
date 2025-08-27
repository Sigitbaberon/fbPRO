import React, { useState, useRef } from 'react';
import Card from '../Card';
import Button from '../Button';

interface UploadStepProps {
  onUpload: (file: File) => void;
}

const UploadStep: React.FC<UploadStepProps> = ({ onUpload }) => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = () => {
    if (file) {
      onUpload(file);
    }
  };

  return (
    <Card className="text-center">
      <h2 className="text-2xl font-bold text-blue-400 mb-2">Langkah 2: Unggah Bukti Pembayaran</h2>
      <p className="text-gray-400 mb-6">
        Unggah foto atau struk bukti donasi Anda untuk kami verifikasi.
      </p>
      
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
          <div className="text-gray-500">
            <p>Klik untuk memilih file</p>
            <p className="text-sm">(JPG, PNG, dll.)</p>
          </div>
        )}
      </div>

      <Button onClick={handleSubmit} disabled={!file}>
        Verifikasi Sekarang
      </Button>
    </Card>
  );
};

export default UploadStep;
