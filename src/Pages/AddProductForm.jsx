import { useForm, useFieldArray } from 'react-hook-form';
import {
  PlusCircle,
  Trash2,
  Loader2,
  UploadCloud,
  X,
  ChevronDown,
} from 'lucide-react';
import { useCreateProductMutation } from '../api/productsApi';
import { useFileUploadMutation } from '../api/fileUploadApi';
import { toast } from 'react-toastify';
import { useEffect, useRef, useState } from 'react';
import {
  useAddCategoryMutation,
  useGetAllCategoriesQuery,
} from '../api/categoryApi';

const generateSlug = (name) => {
  const slugify = (str) =>
    str
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/[^\w-]+/g, '') // Remove all non-word chars
      .replace(/--+/g, '-') // Replace multiple hyphens with single
      .replace(/^-+/, '') // Trim hyphens from start
      .replace(/-+$/, ''); // Trim hyphens from end

  return `${slugify(name)}`;
};

export const CUSTOM_SENTINEL = 'custom';

const CategoryDropdown = ({
  label = 'Category',
  options = [],
  selectedValue,
  onSelect,
  isOpen,
  setIsOpen,
  dropdownKey = 'category',
  ref,
}) => {
  const handleToggle = () => {
    setIsOpen((prev) => (prev === dropdownKey ? null : dropdownKey));
  };

  return (
    <div ref={ref} className="relative select-none z-20">
      <h1 className="block text-sm font-medium text-gray-600 mb-1">{label}</h1>

      {/* Button */}
      <div
        onClick={handleToggle}
        className="flex items-center justify-between gap-2 text-sm text-[#212529] cursor-pointer bg-[#f7f7f7] border border-gray-300 rounded-lg px-4 py-3 transition-colors"
      >
        <span>
          {selectedValue === CUSTOM_SENTINEL
            ? 'Add new category'
            : selectedValue || `Select ${label}`}
        </span>
        <ChevronDown
          className={`w-4 h-4 transition-transform duration-200 ${
            isOpen === dropdownKey ? 'rotate-180' : ''
          }`}
        />
      </div>

      {/* Menu */}
      {isOpen === dropdownKey && (
        <div className="absolute top-full left-0 z-[9999] w-full bg-white border border-gray-200 rounded-lg shadow-lg overflow-auto">
          <ul className="py-1 text-sm text-[#212529]">
            {options.map((opt) => (
              <li
                key={opt}
                onClick={() => {
                  onSelect(opt);
                  setIsOpen(null);
                }}
                className={`px-4 py-2 hover:bg-gray-100 cursor-pointer ${
                  selectedValue === opt ? 'bg-gray-100' : ''
                }`}
              >
                {opt}
              </li>
            ))}

            {/* Divider */}
            <li className="my-1 h-px bg-gray-100" />

            {/* Custom */}
            <li
              onClick={() => {
                onSelect(CUSTOM_SENTINEL);
                setIsOpen(null);
              }}
              className={`px-4 py-2 hover:bg-gray-100 cursor-pointer ${
                selectedValue === CUSTOM_SENTINEL ? 'bg-gray-100' : ''
              } text-[#0ab39c]`}
            >
              Add new category
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default function AddProductForm({ onClose }) {
  const [isOpen, setIsOpen] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [customCategory, setCustomCategory] = useState('');
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitted },
    setValue,
    trigger,
  } = useForm({
    defaultValues: {
      name: '',
      title: '',
      description: '',
      made_with: '',
      price: 0,
      discount: 0,
      category: '',
      customCategory: '',
      keyFeatures: {
        subtitle: '',
        paragraph: '',
        bullets: [{ text: '' }],
      },
    },
  });

  const {
    fields: keyFeatureBulletFields,
    append: appendKeyFeatureBullet,
    remove: removeKeyFeatureBullet,
  } = useFieldArray({
    control,
    name: 'keyFeatures.bullets',
  });

  const [createProduct, { isLoading }] = useCreateProductMutation();
  const [fileUpload, { isLoading: isUploading }] = useFileUploadMutation();
  const { data: categories = [] } = useGetAllCategoriesQuery();
  const [addCategory] = useAddCategoryMutation();

  const categoryNames = categories.map((category) => category.name);

  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (selectedCategory === CUSTOM_SENTINEL) {
      setValue('category', CUSTOM_SENTINEL);
      setValue('customCategory', customCategory);
    } else {
      setValue('category', selectedCategory);
      setValue('customCategory', '');
      setCustomCategory('');
    }
    trigger(['category', 'customCategory']);
  }, [selectedCategory, customCategory, setValue, trigger]);

  const CUSTOM_SENTINEL = 'custom';

  useEffect(() => {
    if (selectedCategory !== CUSTOM_SENTINEL) {
      setValue('customCategory', '');
    }
  }, [selectedCategory, setValue]);

  const handleImageUpload = async (event) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const formData = new FormData();
    for (const file of files) {
      formData.append('files', file);
    }

    try {
      const response = await fileUpload(formData).unwrap();
      if (response?.urls?.[0]) {
        setValue('image', response.urls[0]);
      }
    } catch {
      toast.error('Image upload failed. Please try again.');
    }
  };

  const onSubmit = async (data) => {
    const finalCategory =
      data.category === 'custom' ? data.customCategory : data.category;

    const categoryPayload = {
      name: finalCategory,
      order: categories.length,
    };

    // Generate slug
    const slug = generateSlug(data.name);

    const bulletTexts = data.keyFeatures.bullets.map((b) => b.text);

    // Build payload
    const payload = {
      ...data,
      category: finalCategory,
      slug,
      keyFeatures: {
        ...data.keyFeatures,
        bullets: bulletTexts,
      },
    };

    // Remove customCategory from payload if it exists
    delete payload.customCategory;

    try {
      await createProduct(payload).unwrap();
      if (
        !categoryNames.some(
          (name) => name.toLowerCase() === finalCategory.toLowerCase()
        )
      ) {
        await addCategory(categoryPayload).unwrap();
      }
      toast.success('Product created successfully!');
      onClose();
      window.location.reload();
    } catch (err) {
      toast.error(
        `Product creation failed: ${err.data?.message || err.message}`
      );
    }
  };

  const inputClass =
    'w-full md:px-4 px-3 py-2 md:py-2.5 bg-[#f7f7f7] border border-gray-200 rounded md:rounded-lg outline-none text-[#495057]';
  const labelClass = 'block text-sm font-medium text-gray-600 mb-1';

  return (
    <div className="p-4 md:p-6 bg-white min-h-screen">
      <div className="bg-[#f7f7f7] p-4 md:p-6 rounded-lg max-w-7xl mx-auto space-y-8 mb-10">
        <div className="flex justify-between gap-5">
          <h1 className="text-3xl font-bold text-[#495057]">Add New Product</h1>
          <button
            onClick={onClose}
            className="text-red-400 h-fit mt-1 hover:text-red-500 bg-red-100 md:p-1 p-0.5 rounded-md cursor-pointer"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Main Product Details */}
          <div className="bg-white lg:p-6 p-4 rounded-lg">
            <h2 className="text-2xl font-bold text-[#495057] border-b border-gray-300 pb-2 md:pb-3">
              Product Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-[#878a99] mt-4">
              <div className="text-[#878a99]">
                <label htmlFor="name" className={labelClass}>
                  Product Name
                </label>
                <input
                  id="name"
                  {...register('name', {
                    required: 'Product name is required',
                  })}
                  className={inputClass}
                  placeholder="Name"
                />
                {errors.name && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>
              <div className="text-[#878a99]">
                <label htmlFor="title" className={labelClass}>
                  Sort Description
                </label>
                <input
                  id="title"
                  {...register('title', { required: 'Title is required' })}
                  className={inputClass}
                  placeholder="Sort description"
                />
                {errors.title && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.title.message}
                  </p>
                )}
              </div>
              <div className="text-[#878a99]">
                <label htmlFor="price" className={labelClass}>
                  Price
                </label>
                <input
                  id="price"
                  type="number"
                  {...register('price', {
                    required: 'Price is required',
                    valueAsNumber: true,
                    min: { value: 10, message: 'Price must be at least 10' },
                  })}
                  className={inputClass}
                  placeholder="Price"
                />
                {errors.price && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.price.message}
                  </p>
                )}
              </div>
              <div className="text-[#878a99]">
                <label htmlFor="discount" className={labelClass}>
                  Discount with price
                </label>
                <input
                  id="discount plus price"
                  type="number"
                  {...register('discount', {
                    valueAsNumber: true,
                    min: { value: 0, message: 'Discount cannot be negative' },
                  })}
                  className={inputClass}
                  placeholder="Discount"
                />
                {errors.discount && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.discount.message}
                  </p>
                )}
              </div>
              <div className="text-[#878a99] col-span-2 flex gap-6">
                <div ref={dropdownRef} className="w-1/2">
                  <CategoryDropdown
                    label="Category"
                    options={categoryNames}
                    selectedValue={selectedCategory}
                    onSelect={setSelectedCategory}
                    isOpen={isOpen}
                    setIsOpen={setIsOpen}
                  />
                  {isSubmitted && errors.category && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.category.message}
                    </p>
                  )}
                </div>

                <div className="w-1/2">
                  {/* When custom selected, show input */}
                  {selectedCategory === CUSTOM_SENTINEL && (
                    <div>
                      <label htmlFor="customCategory" className={labelClass}>
                        Add New category
                      </label>
                      <input
                        autoFocus
                        type="text"
                        value={customCategory}
                        onChange={(e) => {
                          setCustomCategory(e.target.value);
                          setValue('customCategory', e.target.value, {
                            shouldValidate: true,
                          });
                        }}
                        placeholder="Write a new category"
                        className={inputClass}
                      />
                      {isSubmitted && errors.customCategory && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.customCategory.message}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Hidden inputs so RHF can validate/submit */}
                  <input
                    type="hidden"
                    {...register('category', {
                      required:
                        selectedCategory !== CUSTOM_SENTINEL
                          ? 'Category is required'
                          : false,
                    })}
                  />
                  <input
                    type="hidden"
                    {...register('customCategory', {
                      required:
                        selectedCategory === CUSTOM_SENTINEL
                          ? 'Custom category is required'
                          : false,
                    })}
                  />
                </div>
              </div>
              {/* <div className="text-[#878a99]">
                <label htmlFor="made_with" className={labelClass}>
                  Made With
                </label>
                <input
                  id="made_with"
                  {...register('made_with')}
                  className={inputClass}
                  placeholder="Materials"
                />
              </div> */}
              {/* <div className="md:col-span-2 text-[#878a99]">
                <label htmlFor="description" className={labelClass}>
                  Description
                </label>
                <textarea
                  id="description"
                  {...register('description')}
                  className={`${inputClass} min-h-[100px]`}
                  placeholder="Describe the product..."
                ></textarea>
              </div> */}
            </div>

            <div className="md:col-span-2 text-[#878a99] mt-4">
              <label htmlFor="image" className={labelClass}>
                Product Image
              </label>
              <div className="flex items-center space-x-4">
                <input
                  type="text"
                  {...register('image', { required: 'Image URL is required' })}
                  className={`${inputClass} flex-1`}
                  placeholder="Image URL will appear here after upload"
                  readOnly
                />
                <label
                  htmlFor="add-product-image"
                  className="cursor-pointer bg-[#099885] hover:bg-[#00846e] text-white px-4 py-2.5 rounded-md flex items-center gap-2 transition-colors disabled:bg-blue-300"
                >
                  {isUploading ? (
                    <Loader2 size={20} className="animate-spin" />
                  ) : (
                    <UploadCloud size={20} />
                  )}
                  <span>Photo Upload</span>
                  <input
                    id="add-product-image"
                    type="file"
                    multiple
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                    disabled={isLoading}
                  />
                </label>
              </div>
              {errors.image && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.image.message}
                </p>
              )}
              {isUploading && (
                <p className="text-sm text-gray-500 mt-1">Uploading image...</p>
              )}
            </div>
          </div>

          {/* Key Features Section */}
          <div className="space-y-6 mt-6 bg-white lg:p-6 p-4 rounded-lg">
            <h2 className="text-2xl font-bold text-[#495057] border-b border-gray-300 pb-2 md:pb-3">
              Key Features
            </h2>
            <div className="space-y-6 text-[#878a99]">
              <div>
                <label htmlFor="keyFeatures.subtitle" className={labelClass}>
                  Title
                </label>
                <input
                  type="text"
                  {...register('keyFeatures.subtitle', {
                    required: 'Subtitle is required',
                  })}
                  className={inputClass}
                  placeholder="Features title"
                />
                {errors.keyFeatures?.subtitle && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.keyFeatures.subtitle.message}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="keyFeatures.paragraph" className={labelClass}>
                  Details
                </label>
                <textarea
                  {...register('keyFeatures.paragraph', {
                    required: 'Details is required',
                  })}
                  className={inputClass}
                  placeholder="Details of features"
                />
                {errors.keyFeatures?.paragraph && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.keyFeatures.paragraph.message}
                  </p>
                )}
              </div>

              <div>
                <h4 className="font-medium text-gray-600 mb-2">
                  Bullet Points
                </h4>
                {keyFeatureBulletFields.map((item, index) => (
                  <div key={item.id} className="space-x-4">
                    <div className="flex items-center gap-4 mb-4">
                      <input
                        {...register(`keyFeatures.bullets.${index}.text`)}
                        className={inputClass}
                        placeholder="Feature point"
                      />
                      <button
                        type="button"
                        onClick={() => removeKeyFeatureBullet(index)}
                        className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-100 cursor-pointer"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => appendKeyFeatureBullet({ text: '' })}
                  className="flex items-center py-2 px-3 text-xs text-[#495057] rounded-md border border-gray-200 hover:bg-gray-100 cursor-pointer transition mt-3"
                >
                  <PlusCircle size={16} className="mr-2" />
                  Add Bullet Point
                </button>
              </div>
            </div>
          </div>

          <div className="pt-6">
            <button
              type="submit"
              disabled={isLoading || isUploading}
              className="w-full flex items-center justify-center py-2.5 px-4 md:px-6 md:text-lg font-semibold text-white cursor-pointer bg-[#099885] hover:bg-[#00846e] rounded-lg shadow-md focus:outline-none transition"
            >
              {isLoading || isUploading ? (
                <Loader2 size={28} className="animate-spin" />
              ) : (
                'Add Product'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
