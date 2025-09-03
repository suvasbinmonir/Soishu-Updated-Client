import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import {
  User,
  Phone,
  Mail,
  MapPin,
  Package,
  Palette,
  Ruler,
  Hash,
  DollarSign,
  Edit3,
  Send,
  Loader2,
  X,
} from 'lucide-react';
import { usePurchaseProductMutation } from '../api/ordersApi';
import { toast } from 'react-toastify';

// You'll need these hooks to get product data
import {
  useGetAllProductsQuery,
  useGetProductSummaryQuery,
} from '../api/productsApi';
import { useUserRole } from '../hooks/useRole';

// A reusable component for all our dropdowns
const SelectField = ({
  id,
  icon,
  register,
  validation,
  error,
  options = [],
  disabled = false,
  ...rest
}) => {
  const selectClass =
    'w-full pl-12 pr-4 py-2.5 bg-[#f7f7f7] border border-gray-200 rounded-lg outline-none text-[#495057] disabled:bg-gray-200 disabled:cursor-not-allowed';
  return (
    <div className="space-y-2">
      {/* <label htmlFor={id} className="font-semibold text-gray-700">
        {label}
      </label> */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          {icon}
        </div>
        <select
          id={id}
          {...register(id, validation)}
          className={selectClass}
          disabled={disabled}
          {...rest}
        >
          {options.map((opt) => (
            <option
              key={opt.value}
              value={opt.value}
              className="bg-white text-[#495057] !cursor-pointer"
            >
              {opt.label}
            </option>
          ))}
        </select>
        {error && (
          <p className="text-red-500 text-xs  mt-0.5 absolute">
            {error.message}
          </p>
        )}
      </div>
    </div>
  );
};

const InputField = ({
  id,
  type = 'text',
  placeholder,
  icon,
  validation,
  register,
  error,
  ...props
}) => {
  // Unchanged from your code
  const inputClass =
    'w-full pl-12 pr-4 py-2.5 bg-[#f7f7f7] border border-gray-200 rounded-lg outline-none text-[#495057]';
  return (
    <div className="relative">
      {' '}
      {/* Set a fixed height to prevent layout shifts from error messages */}
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        {icon}
      </div>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        {...register(id, validation)}
        className={inputClass}
        {...props}
      />
      {error && (
        <p className="text-red-500 text-xs mt-0.5 absolute">{error.message}</p>
      )}
    </div>
  );
};

const PhoneInputField = ({
  id,
  register,
  setValue,
  error,
  validation,
  placeholder,
}) => {
  // This function formats the input value as the user types
  const handlePhoneChange = (e) => {
    let input = e.target.value;

    // 1. Remove any non-digit characters
    input = input.replace(/\D/g, '');

    // 2. Remove leading '0' if it's typed
    if (input.startsWith('0')) {
      input = input.slice(1);
    }

    // 3. Limit the input to 10 digits
    const formattedInput = input.slice(0, 10);

    // 4. Update the form's state with the formatted value and trigger validation
    setValue(id, formattedInput, { shouldValidate: true, shouldDirty: true });
  };

  // The register function provides props, but we override onChange with our own handler.
  const { ...registration } = register(id, validation);

  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#495057]">
        <Phone className="text-[#878a99]" size={20} />
        <span className="ml-2 font-semibold text-gray-500">+880</span>
      </div>
      <input
        id={id}
        type="tel"
        placeholder={placeholder}
        {...registration} // Spread the rest of the registration props (name, onBlur, ref)
        onChange={handlePhoneChange} // Use our custom formatting handler
        className={`w-full pl-24 pr-4 py-2.5 bg-[#f7f7f7] border border-gray-200 rounded-lg outline-none text-[#495057] ${
          error ? 'border-red-500' : ''
        }`}
      />
      {error && (
        <p className="text-red-500 text-xs mt-0.5 absolute">{error.message}</p>
      )}
    </div>
  );
};

export default function AddOrderForm({ onClose }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm({
    defaultValues: {
      recipient_name: '',
      recipient_phone: '',
      additional_phone: '',
      recipient_email: '',
      recipient_address: '',
      note: '',
      product_name: '',
      product_color: '',
      product_size: '',
      product_price: '',
      total_lot: '',
    },
  });

  // Watch for changes in product name and color to update dependent dropdowns
  const watchedProductName = watch('product_name');
  const watchedColor = watch('product_color');

  const { user } = useUserRole();

  // Data Fetching
  const [purchaseProduct, { isLoading: isPurchasing }] =
    usePurchaseProductMutation();
  const { data: summaryData, isLoading: isSummaryLoading } =
    useGetProductSummaryQuery();
  const { data: productData, isLoading: isProductLoading } =
    useGetAllProductsQuery(
      { name: watchedProductName, limit: 1 },
      { skip: !watchedProductName }
    );

  const product = productData?.data?.[0];

  // Effect to reset color and size when product name changes
  useEffect(() => {
    setValue('product_color', '');
    setValue('product_size', '');
  }, [watchedProductName, setValue]);

  // Effect to reset size when color changes
  useEffect(() => {
    setValue('product_size', '');
  }, [watchedColor, setValue]);

  const onSubmit = async (data) => {
    if (!product || !product._id) {
      toast.error('Product details not loaded. Please re-select a product.');
      return;
    }

    const selectedColor = data.product_color;
    const selectedSize = Number(data.product_size);
    const selectedQty = Number(data.total_lot);

    const variant = product?.variants?.find((v) => v.color === selectedColor);
    const sizeObj = variant?.sizes?.find((s) => s.size === selectedSize);

    if (!sizeObj || sizeObj.stock < selectedQty) {
      toast.error(
        `The selected size ${selectedSize} does not have enough stock.`
      );
      return;
    }

    const payload = {
      recipient_name: data.recipient_name,
      recipient_phone: '0' + data.recipient_phone,
      alternative_phone: data.additional_phone?.trim()
        ? '0' + data.additional_phone.trim()
        : '',
      recipient_email: data.recipient_email,
      recipient_address: data.recipient_address,
      note: data.note || '',
      via: data.via,
      price: data.product_price,
      userPhoto: user.image,
      userName: user.name,
      official_status: 'Confirmed',
      items: [
        {
          productId: product._id,
          product_color: selectedColor,
          product_size: selectedSize,
          total_lot: selectedQty,
        },
      ],
    };

    toast
      .promise(purchaseProduct(payload).unwrap(), {
        pending: 'Placing order...',
        success: 'Order created successfully!',
        error: 'Failed to create order. Check stock or details.',
      })
      .then(() => {
        reset();
        onClose();
      });
  };

  const productNameOptions = [
    { value: '', label: 'Select Product' },
    ...(summaryData?.data?.uniqueNames?.map((name) => ({
      value: name,
      label: name,
    })) || []),
  ];

  const colorOptions = [
    { value: '', label: 'Select Color' },
    ...(product?.variants?.map((v) => ({ value: v.color, label: v.color })) ||
      []),
  ];

  const sizeOptions = [
    { value: '', label: 'Select Size' },
    ...(product?.variants
      .find((v) => v.color === watchedColor)
      ?.sizes.map((s) => ({ value: s.size, label: s.size })) || []),
  ];

  const viaOptions = [
    { value: '', label: 'Select Source' },
    { value: 'WhatsApp', label: 'WhatsApp' },
    { value: 'Facebook', label: 'Facebook' },
    { value: 'Website', label: 'Website' },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-white min-h-screen mb-10">
      <div className="max-w-7xl mx-auto bg-[#f7f7f7] md:p-8 p-3 rounded-2xl space-y-10">
        <div className="flex justify-between gap-5">
          <h1 className="text-3xl font-bold text-[#495057]">
            Create New Order
          </h1>
          <button
            onClick={onClose}
            className="text-red-400 h-fit mt-1 hover:text-red-500 bg-red-100 md:p-1 p-0.5 rounded-md cursor-pointer"
          >
            <X size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-8">
            {/* Recipient Info (Unchanged) */}
            <div className="space-y-6 md:p-6 p-3 bg-white rounded-lg border border-gray-200">
              <h2 className="text-xl font-semibold text-[#495057] mb-4">
                Recipient Information
              </h2>
              <InputField
                id="recipient_name"
                placeholder="Recipient Name"
                icon={<User className="text-[#878a99]" size={20} />}
                register={register}
                validation={{ required: 'Recipient name is required' }}
                error={errors.recipient_name}
              />
              <PhoneInputField
                id="recipient_phone"
                register={register}
                setValue={setValue}
                error={errors.recipient_phone}
                placeholder="1XXXXXXXXX"
                validation={{
                  required: 'Phone number is required.',
                  minLength: {
                    value: 10,
                    message: 'Number must be 10 digits (without leading 0).',
                  },
                  pattern: {
                    value: /^1[3-9]\d{8}$/,
                    message: 'Please enter a valid mobile number.',
                  },
                }}
              />
              <PhoneInputField
                id="additional_phone"
                register={register}
                setValue={setValue}
                error={errors.additional_phone}
                placeholder="Additional Number (Optional)"
                validation={{
                  minLength: {
                    value: 10,
                    message: 'Number must be 10 digits (without leading 0).',
                  },
                  pattern: {
                    value: /^1[3-9]\d{8}$/,
                    message: 'Please enter a valid mobile number.',
                  },
                }}
              />
              <SelectField
                id="via"
                icon={<Package className="text-[#878a99]" size={20} />}
                register={register}
                validation={{ required: 'Via is required' }}
                options={viaOptions}
                error={errors.via}
              />
              <InputField
                id="recipient_email"
                type="email"
                placeholder="Recipient Email (Optional)"
                icon={<Mail className="text-[#878a99]" size={20} />}
                register={register}
                validation={{
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: 'Invalid email address',
                  },
                }}
                error={errors.recipient_email}
              />
              <div className="relative">
                <div className="absolute top-3 left-0 pl-4 flex items-center pointer-events-none">
                  <MapPin className="text-[#878a99]" size={20} />
                </div>
                <textarea
                  id="recipient_address"
                  placeholder="Recipient Address"
                  {...register('recipient_address', {
                    required: 'Address is required',
                  })}
                  className="w-full pl-12 pr-4 py-2.5 bg-[#f7f7f7] border border-gray-200 rounded-lg outline-none text-[#495057] min-h-[100px]"
                />
                {errors.recipient_address && (
                  <p className="text-red-500 text-xs mt-1 absolute">
                    {errors.recipient_address.message}
                  </p>
                )}
              </div>
            </div>

            {/* MODIFIED: Product Details */}
            <div className="space-y-6 md:p-6 p-3 bg-white rounded-lg border border-gray-200">
              <h2 className="text-xl font-semibold text-[#495057]">
                Product Details
              </h2>

              <SelectField
                id="product_name"
                label="Product Name"
                icon={<Package className="text-[#878a99]" size={20} />}
                register={register}
                validation={{ required: 'Product name is required' }}
                options={productNameOptions}
                disabled={isSummaryLoading}
                error={errors.product_name}
              />

              <SelectField
                id="product_color"
                label="Color"
                icon={<Palette className="text-[#878a99]" size={20} />}
                register={register}
                validation={{ required: 'Product color is required' }}
                options={colorOptions}
                disabled={!watchedProductName || isProductLoading}
                error={errors.product_color}
              />

              <SelectField
                id="product_size"
                label="Size"
                icon={<Ruler className="text-[#878a99]" size={20} />}
                register={register}
                validation={{ required: 'Product size is required' }}
                options={sizeOptions}
                disabled={!watchedColor || isProductLoading}
                error={errors.product_size}
              />

              <InputField
                id="product_price"
                type="number"
                placeholder="Price"
                icon={<DollarSign className="text-[#878a99]" size={20} />}
                register={register}
                validation={{
                  required: 'Price is required',
                  valueAsNumber: true,
                }}
                error={errors.product_price}
              />

              <InputField
                id="total_lot"
                type="number"
                placeholder="Quantity"
                icon={<Hash className="text-[#878a99]" size={20} />}
                register={register}
                validation={{
                  required: 'Total lot/quantity is required',
                  min: { value: 1, message: 'Quantity must be at least 1' },
                  valueAsNumber: true,
                }}
                error={errors.total_lot}
              />

              <div className="relative">
                <div className="absolute top-3 left-0 pl-4 flex items-center pointer-events-none">
                  <Edit3 className="text-[#878a99]" size={20} />
                </div>
                <textarea
                  id="note"
                  placeholder="Add a note (optional)..."
                  {...register('note')}
                  className="w-full pl-12 pr-4 py-2.5 bg-[#f7f7f7] border border-gray-200 rounded-lg outline-none text-[#495057]"
                />
              </div>
            </div>
          </div>

          <div className="pt-6">
            <button
              type="submit"
              disabled={isPurchasing}
              className="w-full cursor-pointer flex items-center justify-center py-2.5 px-4 md:text-lg bg-[#099885] text-white rounded-lg text-sm font-semibold hover:bg-[#00846e] focus:outline-none transition"
            >
              {isPurchasing ? (
                <Loader2 size={28} className="animate-spin" />
              ) : (
                <>
                  {' '}
                  <Send size={22} className="mr-3" /> Create Order{' '}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
