import React from 'react';

export const CardSkeleton = () => (
  <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 animate-pulse">
    <div className="flex items-center justify-between mb-4">
      <div className="h-10 w-10 bg-gray-200 rounded-lg"></div>
      <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
    </div>
    <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
    <div className="h-8 bg-gray-200 rounded w-3/4"></div>
  </div>
);

export const TableSkeleton = ({ rows = 5 }) => (
  <div className="bg-white shadow-sm rounded-xl border border-gray-100 overflow-hidden animate-pulse">
    <div className="bg-gray-50 border-b border-gray-200 px-6 py-4 flex gap-4">
      <div className="h-4 bg-gray-200 rounded w-1/4"></div>
      <div className="h-4 bg-gray-200 rounded w-1/4"></div>
      <div className="h-4 bg-gray-200 rounded w-1/4"></div>
      <div className="h-4 bg-gray-200 rounded w-1/4"></div>
    </div>
    <div className="divide-y divide-gray-100">
      {[...Array(rows)].map((_, i) => (
        <div key={i} className="px-6 py-4 flex gap-4">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
        </div>
      ))}
    </div>
  </div>
);

export const DashboardSkeleton = () => (
  <div className="space-y-6 max-w-7xl mx-auto">
    <div className="mb-8 animate-pulse">
      <div className="h-8 bg-gray-200 rounded w-1/4 mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-1/3"></div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <CardSkeleton />
      <CardSkeleton />
      <CardSkeleton />
      <CardSkeleton />
    </div>
    <div className="mt-8">
      <TableSkeleton rows={5} />
    </div>
  </div>
);
