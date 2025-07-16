import React from 'react';

interface ToggleGroupProps {
  value: string;
  onValueChange: (value: string) => void;
  children: React.ReactNode;
}

interface ToggleGroupItemProps {
  value: string;
  children: React.ReactNode;
}

export const ToggleGroup: React.FC<ToggleGroupProps> = ({ value, onValueChange, children }) => {
  return (
    <div className="inline-flex bg-slate-700 rounded-lg p-1">
      {React.Children.map(children, (child) => {
        if (React.isValidElement<ToggleGroupItemProps>(child)) {
          return React.cloneElement(child, {
            ...child.props,
            onClick: () => onValueChange(child.props.value),
            isSelected: value === child.props.value,
          });
        }
        return child;
      })}
    </div>
  );
};

export const ToggleGroupItem: React.FC<ToggleGroupItemProps & { onClick?: () => void; isSelected?: boolean }> = ({ 
  value, 
  children, 
  onClick, 
  isSelected 
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        px-4 py-2 text-sm font-medium rounded-md transition-all duration-200
        ${isSelected 
          ? 'bg-blue-600 text-white shadow-sm' 
          : 'text-slate-300 hover:text-white hover:bg-slate-600'
        }
      `}
    >
      {children}
    </button>
  );
};