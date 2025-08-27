import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import DonationStep from './components/onboarding/DonationStep';
import UploadStep from './components/onboarding/UploadStep';
import VerificationStep from './components/onboarding/VerificationStep';
import AccessStep from './components/onboarding/AccessStep';
import MainApp from './components/main/MainApp';
import { useLocalStorage } from './hooks/useLocalStorage';
import { AppStep } from './types';

const App: React.FC = () => {
  const [step, setStep] = useLocalStorage<AppStep>('appStep', AppStep.DONATION);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [accessCode, setAccessCode] = useLocalStorage<string | null>('accessCode', null);

  useEffect(() => {
    if (accessCode) {
      setStep(AppStep.MAIN_APP);
    }
  }, [accessCode, setStep]);

  const handleVerificationFailed = () => {
    setUploadedFile(null);
    setStep(AppStep.UPLOAD);
  };

  const renderStep = () => {
    switch (step) {
      case AppStep.DONATION:
        return <DonationStep onComplete={() => setStep(AppStep.UPLOAD)} />;
      case AppStep.UPLOAD:
        return (
          <UploadStep
            onUpload={(file) => {
              setUploadedFile(file);
              setStep(AppStep.VERIFICATION);
            }}
          />
        );
      case AppStep.VERIFICATION:
        if (!uploadedFile) {
          // Fallback if the user refreshes on the verification step or lands here without a file
          return <UploadStep onUpload={(file) => {
              setUploadedFile(file);
              setStep(AppStep.VERIFICATION);
            }} 
          />;
        }
        return (
          <VerificationStep
            uploadedFile={uploadedFile}
            onVerified={(code) => {
              setAccessCode(code);
              setStep(AppStep.ACCESS);
            }}
            onVerificationFailed={handleVerificationFailed}
          />
        );
      case AppStep.ACCESS:
        return (
          <AccessStep
            accessCode={accessCode || ''}
            onEnterApp={() => setStep(AppStep.MAIN_APP)}
          />
        );
      case AppStep.MAIN_APP:
        return <MainApp />;
      default:
        return <DonationStep onComplete={() => setStep(AppStep.UPLOAD)} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-900 text-gray-100 font-sans">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 flex items-center justify-center">
        {renderStep()}
      </main>
      <Footer />
    </div>
  );
};

export default App;