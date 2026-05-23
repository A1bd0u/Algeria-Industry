import React from 'react';
import { cn } from '../lib/utils';

interface SkeletonProps {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className }) => {
  return (
    <div className={cn("animate-pulse bg-gray-200 rounded-md", className)} />
  );
};

export const CompanySkeleton = () => (
  <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
    <div className="flex items-center space-x-4">
      <Skeleton className="h-16 w-16 rounded-xl" />
      <div className="space-y-2 flex-1">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    </div>
    <div className="space-y-2">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-full" />
    </div>
    <div className="flex space-x-2 pt-2">
      <Skeleton className="h-6 w-20 rounded-full" />
      <Skeleton className="h-6 w-20 rounded-full" />
    </div>
  </div>
);

export const TenderSkeleton = () => (
  <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
    <div className="flex justify-between items-start">
      <div className="space-y-2 flex-1">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-1/4" />
      </div>
      <Skeleton className="h-6 w-24 rounded-full" />
    </div>
    <Skeleton className="h-4 w-full" />
    <div className="flex justify-between items-center pt-4 border-t border-gray-50">
      <Skeleton className="h-4 w-32" />
      <Skeleton className="h-5 w-24" />
    </div>
  </div>
);
