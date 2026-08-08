import React from 'react';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function Loading() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <LoadingSpinner text="ইলেভেটমার্ট লোড হচ্ছে..." />
    </div>
  );
}
