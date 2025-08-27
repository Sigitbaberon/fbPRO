import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import Card from '../Card';
import Spinner from '../Spinner';
import Button from '../Button';
import { XCircleIcon } from '../icons/XCircleIcon';
import { CheckCircleIcon } from '../icons/CheckCircleIcon';
import { fileToBase64 } from '../../utils';

interface VerificationStepProps {
  uploadedFile: File;
  onVerified: (accessCode: string) => void;
  onVerificationFailed: () => void;
}

enum VerificationStatus {
  IDLE,
  VERIFYING,
  SUCCESS,
  FAILED,
}

const VerificationStep: React.FC<VerificationStepProps> = ({ uploadedFile, onVerified, onVerificationFailed }) => {
  const [status, setStatus] = useState<VerificationStatus>(VerificationStatus.IDLE);
  const [message, setMessage] = useState('Memulai proses verifikasi...');
  const [failureReason, setFailureReason] = useState<string | null>(null);

  useEffect(() => {
    const verifyPayment = async () => {
      if (!uploadedFile) {
        onVerificationFailed();
        return;
      }

      setStatus(VerificationStatus.VERIFYING);
      setMessage('Mempersiapkan gambar untuk dianalisis...');
      
      try {
        const base64Image = await fileToBase64(uploadedFile);
        setMessage('Menganalisis gambar dengan AI...');

        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
        
        const prompt = `
          You are an automated verification system for a QRIS payment receipt.
          Analyze this image and determine if the payment is valid based on three strict criteria:
          1. The transaction status must be explicitly stated as "Berhasil" (successful).
          2. The transaction amount must be exactly "Rp10.000". Not 10,000.00, but Rp10.000.
          3. The merchant name must be "raxnet".

          Respond ONLY with a JSON object in the following format, with no extra text or markdown formatting:
          {
            "isValid": boolean,
            "reason": "Provide a brief, clear reason in Indonesian. If valid, say 'Pembayaran tervalidasi'. If invalid, explain exactly which criterion failed (e.g., 'Jumlah transfer tidak sesuai, terdeteksi Rp5.000' or 'Nama merchant tidak sesuai, terdeteksi [Nama Merchant Terdeteksi]')."
          }
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: {
                parts: [
                    { inlineData: { mimeType: uploadedFile.type, data: base64Image } },
                    { text: prompt },
                ],
            },
        });
        
        setMessage('Memproses hasil dari AI...');
        
        const jsonString = response.text.trim().replace(/^```json\n/, '').replace(/\n```$/, '');
        const result = JSON.parse(jsonString);

        if (result.isValid) {
          setStatus(VerificationStatus.SUCCESS);
          setMessage('Verifikasi berhasil! Menghasilkan kode akses...');
          const accessCode = `RAXNET-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
          setTimeout(() => onVerified(accessCode), 1500);
        } else {
          setStatus(VerificationStatus.FAILED);
          setFailureReason(result.reason || 'AI tidak dapat memvalidasi bukti ini.');
          setMessage('Verifikasi Gagal');
        }
      } catch (error) {
        console.error("AI Verification Error:", error);
        setStatus(VerificationStatus.FAILED);
        setMessage('Verifikasi Gagal');
        setFailureReason('Terjadi kesalahan teknis saat verifikasi. Pastikan bukti pembayaran jelas dan coba lagi.');
      }
    };

    if (status === VerificationStatus.IDLE) {
      verifyPayment();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderContent = () => {
    switch (status) {
      case VerificationStatus.VERIFYING:
        return (
          <>
            <Spinner />
            <p className="text-gray-300 animate-pulse">{message}</p>
          </>
        );
      case VerificationStatus.SUCCESS:
        return (
            <>
              <CheckCircleIcon className="w-16 h-16 text-green-500 mb-4" />
              <p className="text-green-400 font-semibold">{message}</p>
            </>
        );
      case VerificationStatus.FAILED:
        return (
          <>
            <XCircleIcon className="w-16 h-16 text-red-500 mb-4" />
            <p className="text-red-400 font-semibold">{failureReason}</p>
            <Button onClick={onVerificationFailed} className="mt-6">
                Unggah Ulang Bukti
            </Button>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <Card className="text-center">
      <h2 className="text-2xl font-bold text-blue-400 mb-6">Langkah 3: Verifikasi Otomatis</h2>
      <div className="flex flex-col items-center justify-center space-y-4 min-h-[150px]">
        {renderContent()}
      </div>
    </Card>
  );
};

export default VerificationStep;