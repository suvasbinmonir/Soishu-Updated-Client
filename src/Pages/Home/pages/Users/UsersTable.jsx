import { ChevronDown, Loader2, Trash2, Plus } from 'lucide-react';
import {
  useGetAllUsersQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
} from '../../../../api/userApi';
import { toast } from 'react-toastify';
import { showDeleteConfirmation } from '../../../../components/ShowDeleteConfirmation';
import { Link } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';

// Formats the date into a readable string
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

const roleOptions = ['User', 'Moderator', 'Admin'];

const Header = () => (
  <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
    <div>
      <h1 className="text-2xl sm:text-3xl font-bold text-[#495057]">
        User Management
      </h1>
    </div>
    <div className="flex items-center gap-2">
      <Link to="/signup">
        <button className="flex items-center gap-2 px-3 py-2.5 bg-[#099885] text-white rounded-lg text-sm font-semibold hover:bg-[#00846e] transition-colors cursor-pointer">
          <Plus size={16} />
          Add User
        </button>
      </Link>
    </div>
  </header>
);

const RoleDropdown = ({
  selectedRole,
  onRoleChange,
  isOpen,
  setIsOpen,
  dropdownKey,
  userId,
  roleOptions,
  disabled,
}) => {
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [setIsOpen]);

  const handleToggle = (e) => {
    e.stopPropagation();
    if (!disabled) {
      setIsOpen((prev) => (prev === dropdownKey ? null : dropdownKey));
    }
  };

  const handleSelect = (role) => {
    if (role !== selectedRole && !disabled) {
      onRoleChange(userId, role);
    }
    setIsOpen(null);
  };

  return (
    <div className="relative select-none inline-block text-xs">
      <button
        onClick={handleToggle}
        disabled={disabled}
        className={`flex items-center justify-between w-24 rounded px-2 py-1 border focus:outline-none ${
          disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
        }`}
      >
        <span>{selectedRole}</span>
        <ChevronDown
          className={`w-4 h-4 ml-1 transition-transform text-current ${
            isOpen === dropdownKey ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isOpen === dropdownKey && !disabled && (
        <ul className="absolute top-full left-0 mt-2 w-24 bg-white border border-gray-200 rounded-md overflow-auto py-1.5 z-[9999]">
          {roleOptions.map((role) => (
            <li
              key={role}
              onClick={() => handleSelect(role)}
              className={`px-3 py-1 cursor-pointer hover:bg-gray-100 ${
                selectedRole === role ? 'font-semibold bg-gray-50' : ''
              }`}
            >
              {role}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default function UsersTable() {
  const [openDropdown, setOpenDropdown] = useState(null);
  const { data, isLoading, refetch } = useGetAllUsersQuery();
  const [deleteUser] = useDeleteUserMutation();
  const [updateUser] = useUpdateUserMutation();

  const users = data?.data || [];

  const handleDelete = async (id) => {
    showDeleteConfirmation(() => {
      toast
        .promise(deleteUser(id).unwrap(), {
          pending: 'Deleting user...',
          success: `User deleted successfully!`,
          error: 'Failed to delete user.',
        })
        .finally(refetch);
    });
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await toast.promise(
        updateUser({ userId, data: { role: newRole } }).unwrap(),
        {
          pending: 'Updating role...',
          success: 'Role updated successfully!',
          error: 'Failed to update role.',
        }
      );
      refetch();
    } catch {
      toast.error('An error occurred while updating the role.');
    }
  };

  if (isLoading)
    return (
      <div className="flex justify-center mt-40">
        <Loader2 className="w-8 h-8 animate-spin text-gray-500" />
      </div>
    );

  return (
    <div className="p-4 md:p-6 bg-white">
      <div className="bg-[#f7f7f7] p-4 md:p-6 rounded-lg hidden md:block">
        <Header />

        <div className="overflow-x-auto border border-gray-200 rounded-lg min-h-screen">
          <table className="w-full text-sm text-left text-[#878a99]">
            <thead className="text-xs uppercase bg-[#fbfbfb] text-[#495057] sticky top-0 z-10">
              <tr className="border-b border-gray-200 text-[#495057]">
                <th className="px-4 py-5">Name</th>
                <th className="px-4 py-5">Photo</th>
                <th className="px-4 py-5">User Email</th>
                <th className="px-4 py-5">Role</th>
                <th className="px-4 py-5">Created At</th>
                <th className="px-4 py-5">Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr
                  key={user._id}
                  className={`border-b border-gray-300 ${
                    index % 2 === 0 ? 'bg-white' : 'bg-[#fbfbfb]'
                  }`}
                >
                  <td className="px-4 py-3">
                    <div className="text-xs text-gray-500">
                      {user.name || 'No Name'}
                    </div>
                  </td>
                  <td title={user.userName} className="px-4 py-3">
                    <img
                      src={user.image}
                      alt="Assigned User"
                      className="size-6 rounded-full cursor-pointer"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-medium text-[#495057]">
                      {user.email}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <RoleDropdown
                      selectedRole={user.role}
                      onRoleChange={handleRoleChange}
                      isOpen={openDropdown}
                      setIsOpen={setOpenDropdown}
                      dropdownKey={user._id}
                      userId={user._id}
                      roleOptions={roleOptions}
                      disabled={user.email === 'thesuvas@gmail.com'}
                    />
                  </td>

                  {/* <td className="px-4 py-3">
                    <select
                      value={user.role}
                      disabled={user.email === 'thesuvas@gmail.com'}
                      onChange={(e) =>
                        handleRoleChange(user._id, e.target.value)
                      }
                      className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none disabled:cursor-not-allowed"
                    >
                      {roleOptions.map((role) => (
                        <option key={role} value={role}>
                          {role}
                        </option>
                      ))}
                    </select>
                  </td> */}
                  <td className="px-4 py-3">{formatDate(user.createdAt)}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleDelete(user._id)}
                      disabled={user.email === 'thesuvas@gmail.com'}
                      className="text-red-600 hover:text-red-800 cursor-pointer disabled:cursor-not-allowed"
                      title="Delete User"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MOBILE CARD VIEW */}
      <div className="md:hidden">
        <h1 className="text-2xl font-bold text-[#495057] mb-6">
          User Management
        </h1>
        {users.map((user) => (
          <div
            key={user._id}
            className="p-4 mt-2 rounded border border-gray-200"
          >
            <div className="flex justify-between items-start gap-4">
              {/* User Info */}
              <div>
                <p className="font-semibold text-[#495057]">{user.email}</p>
                <p className="text-sm text-[#878a99]">
                  {user.phone || 'No phone'}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Joined: {formatDate(user.createdAt)}
                </p>
              </div>
              {/* Status Icon */}
              {/* <div className="flex-shrink-0">
                {user.isVerified ? (
                  <CheckCircle
                    className="w-6 h-6 text-green-500"
                    title="Verified"
                  />
                ) : (
                  <XCircle
                    className="w-6 h-6 text-red-500"
                    title="Not Verified"
                  />
                )}
              </div> */}
            </div>
            <div className="mt-4 flex justify-between items-center">
              {/* Role Changer */}
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium">Role:</label>
                <select
                  value={user.role}
                  disabled={user.role === 'Admin'}
                  onChange={(e) => handleRoleChange(user._id, e.target.value)}
                  className="border border-gray-300 rounded px-2 py-1 text-sm bg-gray-50 focus:outline-none disabled:cursor-not-allowed"
                >
                  {roleOptions.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
              </div>
              {/* Delete Button */}
              <button
                onClick={() => handleDelete(user._id)}
                className="bg-red-100 text-red-700 px-3 py-1.5 rounded-md text-sm font-medium hover:bg-red-200"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {users.length === 0 && (
        <div className="text-center py-10 text-[#878a99]">
          <p>No users found.</p>
        </div>
      )}
    </div>
  );
}
