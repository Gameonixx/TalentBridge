import { Loader2 } from 'lucide-react';

export const LoadingState = ({ message = "Loading..." }) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 min-h-[300px]">
      <Loader2 className="w-8 h-8 text-gray-900 animate-spin mb-4" />
      <p className="text-sm text-gray-500">{message}</p>
    </div>
  );
};

export default LoadingState;
