'use client';

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingBag } from '@fortawesome/free-solid-svg-icons';

export default function LoadingSpinner({ text = 'লোড হচ্ছে...' }: { text?: string }) {
  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-4 min-h-[300px]">
      <div className="relative flex items-center justify-center w-16 h-16">
        <div className="absolute inset-0 rounded-full border-4 border-indigo-200 dark:border-indigo-950 border-t-indigo-600 dark:border-t-indigo-400 animate-spin" />
        <FontAwesomeIcon icon={faShoppingBag} className="w-6 h-6 text-indigo-600 dark:text-indigo-400 animate-pulse" />
      </div>
      <p className="text-sm font-extrabold text-slate-700 dark:text-slate-300 animate-pulse tracking-wide font-sans">
        {text}
      </p>
    </div>
  );
}
