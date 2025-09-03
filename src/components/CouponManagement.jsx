import { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  useAddCouponMutation,
  useGetAllCouponsQuery,
  useRemoveCouponMutation,
  useUpdateCouponMutation,
} from '../api/productsApi';
import { toast } from 'react-toastify';
import { showDeleteConfirmation } from './ShowDeleteConfirmation';
import { useUserRole } from '../hooks/useRole';

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const CouponManagement = ({ productId }) => {
  const { data, refetch } = useGetAllCouponsQuery(productId);
  const [addCoupon] = useAddCouponMutation();
  const [removeCoupon] = useRemoveCouponMutation();
  const [updateCoupon] = useUpdateCouponMutation();
  const { role } = useUserRole();

  const [showAddForm, setShowAddForm] = useState(false);
  const [editForm, setEditForm] = useState({
    code: '',
    newCode: '',
    discountPercentage: '',
    expiresAt: '',
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const {
    register: registerEdit,
    handleSubmit: handleSubmitEdit,
    reset: resetEdit,
    formState: { errors: editErrors },
  } = useForm();

  const onAddCoupon = (data) => {
    if (!data.code || !data.discountPercentage)
      return toast.error('Please fill all required fields.');

    toast
      .promise(
        addCoupon({
          productId,
          data: {
            ...data,
            discountPercentage: parseFloat(data.discountPercentage),
          },
        }).unwrap(),
        {
          pending: 'Adding coupon...',
          success: 'Coupon added successfully!',
          error: 'Failed to add coupon.',
        }
      )
      .then(() => {
        reset();
        setShowAddForm(false);
        refetch();
      });
  };

  const onUpdateCoupon = (data) => {
    if (!editForm?.code) return;

    toast
      .promise(
        updateCoupon({
          productId,
          couponCode: editForm.code.toUpperCase(),
          data: {
            newCode: data.newCode || undefined,
            discountPercentage: data.discountPercentage
              ? parseFloat(data.discountPercentage)
              : undefined,
            expiresAt: data.expiresAt || undefined,
          },
        }).unwrap(),
        {
          pending: 'Updating coupon...',
          success: 'Coupon updated!',
          error: 'Failed to update coupon.',
        }
      )
      .then(() => {
        resetEdit();
        setEditForm(null);
        refetch();
      });
  };

  const handleRemoveCoupon = (code) => {
    showDeleteConfirmation(() => {
      toast
        .promise(removeCoupon({ productId, couponCode: code }).unwrap(), {
          pending: 'Deleting coupon...',
          success: 'Coupon deleted!',
          error: 'Failed to delete coupon.',
        })
        .finally(refetch);
    }, 'This will permanently remove the coupon. Continue?');
  };

  return (
    <div className="md:p-6 bg-white rounded-lg space-y-4">
      <h2 className="text-2xl font-bold text-[#495057] border-b border-gray-300 pb-2">
        Coupon Management
      </h2>

      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-[#495057]">Coupons</h3>
          {role === 'Admin' && (
            <button
              onClick={() => {
                setShowAddForm(!showAddForm);
                reset();
              }}
              className={`${
                showAddForm ? 'bg-[#f06548]' : 'bg-[#099885] hover:bg-[#00846e]'
              } px-4 py-2.5 text-white rounded-lg text-sm font-semibold cursor-pointer`}
            >
              {showAddForm ? 'Cancel' : 'Add Coupon'}
            </button>
          )}
        </div>

        {showAddForm && (
          <form
            onSubmit={handleSubmit(onAddCoupon)}
            className="flex flex-col sm:flex-row sm:space-x-4 space-y-2 sm:space-y-0"
          >
            <div className="w-full">
              <input
                type="text"
                placeholder="Code"
                {...register('code', { required: true })}
                className="px-3 py-2 border border-gray-200 rounded-md w-full focus:outline-none"
              />
              {errors.code && (
                <p className="text-red-500 text-sm">Code is required</p>
              )}
            </div>
            <div className="w-full">
              <input
                type="number"
                placeholder="Discount %"
                {...register('discountPercentage', {
                  required: true,
                  min: 1,
                  max: 100,
                })}
                className="px-3 py-2 border border-gray-200 rounded-md w-full focus:outline-none"
              />
              {errors.discountPercentage && (
                <p className="text-red-500 text-sm">
                  Discount between 1% and 100% required
                </p>
              )}
            </div>
            <div className="w-full">
              <input
                type="datetime-local"
                {...register('expiresAt')}
                className="px-3 py-2 border border-gray-200 rounded-md w-full focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="bg-[#0ab39c] text-white px-4 py-2 rounded-md cursor-pointer"
            >
              Save
            </button>
          </form>
        )}

        {data?.data?.length ? (
          data.data.map((coupon) => (
            <div
              key={coupon.code}
              className="border border-gray-200 p-3 rounded flex flex-col sm:flex-row items-end sm:justify-between"
            >
              <div className="space-y-1">
                <p>
                  <span className="font-medium">Code:</span> {coupon.code}
                </p>
                <p>
                  <span className="font-medium">Discount:</span>{' '}
                  {coupon.discountPercentage}%
                </p>
                <p>
                  <span className="font-medium">Expired At:</span>{' '}
                  {formatDate(coupon.expiresAt)}
                </p>
              </div>
              {role === 'Admin' && (
                <div className="flex space-x-2 mt-2 sm:mt-0">
                  <button
                    onClick={() => {
                      setEditForm(coupon);
                      resetEdit({
                        newCode: coupon.code,
                        discountPercentage: coupon.discountPercentage,
                        expiresAt: coupon.expiresAt
                          ? new Date(coupon.expiresAt)
                              .toISOString()
                              .slice(0, 16)
                          : '',
                      });
                    }}
                    className="bg-[#f7b84b] text-white px-3 py-2 rounded-md cursor-pointer"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleRemoveCoupon(coupon.code)}
                    className="bg-[#f06548] text-white px-3 py-2 rounded-md cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>
          ))
        ) : (
          <p className="text-gray-500">No coupons available.</p>
        )}
      </div>

      {editForm?.code && (
        <div className="border-t pt-4 mt-4 space-y-2">
          <h3 className="font-semibold text-gray-700">
            Update Coupon: {editForm.code}
          </h3>
          <form
            onSubmit={handleSubmitEdit(onUpdateCoupon)}
            className="flex flex-col sm:flex-row sm:space-x-4 space-y-2 sm:space-y-0"
          >
            <div className="w-full">
              <input
                type="text"
                placeholder="New Code"
                {...registerEdit('newCode')}
                className="px-3 py-2 border border-gray-200 rounded-md w-full focus:outline-none"
              />
            </div>
            <div className="w-full">
              <input
                type="number"
                placeholder="New Discount %"
                {...registerEdit('discountPercentage', { min: 1, max: 100 })}
                className="px-3 py-2 border border-gray-200 rounded-md w-full focus:outline-none"
              />
              {editErrors.discountPercentage && (
                <p className="text-red-500 text-sm">
                  Discount must be between 1% and 100%
                </p>
              )}
            </div>
            <div className="w-full">
              <input
                type="datetime-local"
                {...registerEdit('expiresAt')}
                className="px-3 py-2 border border-gray-200 rounded-md w-full focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="bg-[#0ab39c] text-white px-4 py-2 rounded-md cursor-pointer"
            >
              Update
            </button>
            <button
              type="button"
              onClick={() => {
                setEditForm(null);
                resetEdit();
              }}
              className="bg-[#f06548] text-white px-4 py-2 rounded-md cursor-pointer"
            >
              Cancel
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default CouponManagement;
