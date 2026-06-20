import { FolderX } from 'lucide-react';

export const EmptyState = ({ 
  title = "No data found", 
  description = "Get started by creating a new entry.", 
  icon: Icon = FolderX,
  action 
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-white border border-gray-100 border-dashed rounded-xl">
      <div className="p-4 mb-4 bg-gray-50 rounded-full">
        <Icon className="w-8 h-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-1">{title}</h3>
      <p className="text-sm text-gray-500 mb-6 max-w-sm">{description}</p>
      {action && <div>{action}</div>}
    </div>
  );
};

export default EmptyState;
