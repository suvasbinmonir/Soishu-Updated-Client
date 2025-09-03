import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

export const showDeleteConfirmation = (onConfirm, customMessage) => {
  confirmAlert({
    overlayClassName:
      'bg-black bg-opacity-10 inset-0 flex items-center justify-center',
    customUI: ({ onClose }) => (
      <div className="bg-white rounded-xl border border-gray-300 p-6 max-w-sm w-full space-y-4 text-center">
        <h2 className="text-xl font-bold text-gray-800">Confirm Deletion</h2>
        <p className="text-gray-600">
          {customMessage ||
            'Are you sure you want to delete this item? This action cannot be undone.'}
        </p>
        <div className="flex justify-center space-x-4 pt-4">
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="bg-[#f06548] text-white font-semibold px-4 py-2 rounded-lg transition cursor-pointer"
          >
            Yes, Delete
          </button>
          <button
            onClick={onClose}
            className="border border-gray-300 hover:bg-gray-100 font-semibold px-4 py-2 rounded-lg transition cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    ),
  });
};
