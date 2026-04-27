// import { useEffect } from 'react';
// import { X } from 'lucide-react';

// const Modal = ({ isOpen, onClose, title, children, size = 'md' }) => {
//   const sizes = {
//     sm: 'max-w-sm',
//     md: 'max-w-lg',
//     lg: 'max-w-2xl',
//     xl: 'max-w-4xl',
//   };

//   useEffect(() => {
//     const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
//     if (isOpen) document.addEventListener('keydown', handleKey);
//     return () => document.removeEventListener('keydown', handleKey);
//   }, [isOpen, onClose]);

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
//       {/* Backdrop */}
//       <div
//         className="absolute inset-0 bg-black/50 backdrop-blur-sm"
//         onClick={onClose}
//       />
//       {/* Panel */}
//       <div
//         className={`relative w-full ${sizes[size]} bg-white dark:bg-gray-800 rounded-xl shadow-2xl flex flex-col max-h-[90vh]`}
//       >
//         {/* Header */}
//         <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
//           <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
//             {title}
//           </h3>
//           <button
//           // aria-label="Close modal"
//             onClick={onClose}
//             className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
//           >
//             <X size={18} />
//           </button>
//         </div>
//         {/* Body */}
//         <div className="overflow-y-auto flex-1 px-6 py-4">{children}</div>
//       </div>
//     </div>
//   );
// };

// export default Modal;

import { useEffect, useCallback } from 'react';
import { X } from 'lucide-react';

const Modal = ({ isOpen, onClose, title, children, size = 'md' }) => {
  const sizes = {
    sm: 'max-w-sm',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

  const handleKey = useCallback(
    (e) => { if (e.key === 'Escape') onClose(); },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isOpen, handleKey]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      {/* Backdrop */}
      <div
        data-testid="modal-backdrop"
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      {/* Panel */}
      <div
        className={`relative w-full ${sizes[size]} bg-white dark:bg-gray-800 rounded-xl shadow-2xl flex flex-col max-h-[90vh]`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {title}
          </h3>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <X size={18} />
          </button>
        </div>
        {/* Body */}
        <div className="overflow-y-auto flex-1 px-6 py-4">{children}</div>
      </div>
    </div>
  );
};

export default Modal;