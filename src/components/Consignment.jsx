import { useState, useEffect, useCallback, useRef } from 'react';
import {
  Loader2,
  Plus,
  Minus,
  Clock,
  Edit,
  Save,
  X,
  Trash2,
  UploadCloud,
  MoreVertical,
  ChevronDown,
} from 'lucide-react';
import { toast } from 'react-toastify';
import { useDropzone } from 'react-dropzone';

import {
  useGetAllProductsQuery,
  useGetProductSummaryQuery,
  useFlexibleProductUpdateMutation,
  useDeleteVariantOrSizeMutation,
  useDeleteProductByIdMutation,
} from '../api/productsApi';
import CouponManagement from './CouponManagement';
import { showDeleteConfirmation } from './ShowDeleteConfirmation';
import { useFileUploadMutation } from '../api/fileUploadApi';
import { useUserRole } from '../hooks/useRole';
import AddProductForm from '../Pages/AddProductForm';

// Helper to format date strings
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

const ColorDropdown = ({
  label = 'Color',
  options = [],
  selectedValue,
  onSelect,
  isOpen,
  setIsOpen,
  dropdownKey = 'color',
  dropdownRef,
}) => {
  const handleToggle = () => {
    setIsOpen((prev) => (prev === dropdownKey ? null : dropdownKey));
  };

  return (
    <div ref={dropdownRef} className="relative select-none z-20">
      <h1 className="block text-sm font-medium text-gray-600 mb-1">
        Select color
      </h1>

      {/* Button */}
      <div
        onClick={handleToggle}
        className="flex items-center justify-between gap-2 full text-sm text-[#212529] cursor-pointer bg-[#f7f7f7] border border-gray-300 rounded-lg px-4 py-2.5 transition-colors"
      >
        <span>{selectedValue || `Select ${label}`}</span>
        <ChevronDown
          className={`w-4 h-4 transition-transform duration-200 ${
            isOpen === dropdownKey ? 'rotate-180' : ''
          }`}
        />
      </div>

      {/* Menu */}
      {isOpen === dropdownKey && (
        <div className="absolute top-full left-0 z-[9999] w-full max-w-64 bg-white border border-gray-200 rounded-lg shadow-lg overflow-auto">
          <ul className="py-1 text-sm text-[#212529]">
            {options.map((opt) => (
              <li
                key={opt.name}
                onClick={() => {
                  onSelect(opt.name);
                  setIsOpen(null);
                }}
                className={`px-4 py-2 hover:bg-gray-100 cursor-pointer ${
                  selectedValue === opt.name ? 'bg-gray-100' : ''
                }`}
              >
                {opt.name}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

const ProductDetailView = ({ product, refetch, onProductOpen }) => {
  const PREDEFINED_COLORS = [
    { name: 'master', value: '#B2672A' },
    { name: 'chocolate', value: '#713500' },
    { name: 'black', value: '#000000' },
  ];
  const { role } = useUserRole();

  // State
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  // State for adding a new color variant
  const [newColorName, setNewColorName] = useState(PREDEFINED_COLORS[0].name);
  const [showColorInput, setShowColorInput] = useState(false);
  const [isOpen, setIsOpen] = useState(null);

  // State for adding a new size to a variant
  const [newSizeInput, setNewSizeInput] = useState('');
  const [newStockInput, setNewStockInput] = useState('');
  const [showSizeInput, setShowSizeInput] = useState(false);

  // State for editing stock of an existing size
  const [editSizeValue, setEditSizeValue] = useState(null);
  const [editStockValue, setEditStockValue] = useState(null);
  const [showUpdateButton, setShowUpdateButton] = useState(false);

  // Mutations
  const [flexibleUpdate, { isLoading: isUpdating }] =
    useFlexibleProductUpdateMutation();
  const [deleteVariantOrSize, { isLoading: isDeleting }] =
    useDeleteVariantOrSizeMutation();
  const [deleteProduct, { isLoading: isDeletingProduct }] =
    useDeleteProductByIdMutation();

  const getSelectionKey = useCallback(
    () => `product-selection-${product._id}`,
    [product._id]
  );

  const menuRef = useRef(null);
  const colorSectionRef = useRef(null);
  const sizeSectionRef = useRef(null);
  const colorButtonRef = useRef(null);
  const sizeButtonRef = useRef(null);
  const stockUpdateRef = useRef(null);
  const dropdownRef = useRef(null);

  // Effects for setting initial state and persisting selections
  useEffect(() => {
    const savedSelection = JSON.parse(localStorage.getItem(getSelectionKey()));
    let initialColor = product.variants[0]?.color;
    let initialSize = null;

    if (
      savedSelection?.color &&
      product.variants.some((v) => v.color === savedSelection.color)
    ) {
      initialColor = savedSelection.color;
      const variant = product.variants.find((v) => v.color === initialColor);
      if (
        savedSelection.size &&
        variant?.sizes.some((s) => s.size === savedSelection.size)
      ) {
        initialSize = savedSelection.size;
      } else {
        initialSize = variant?.sizes[0]?.size;
      }
    } else {
      initialSize = product.variants[0]?.sizes[0]?.size;
    }

    setSelectedColor(initialColor || null);
    setSelectedSize(initialSize || null);
  }, [product, getSelectionKey]);

  useEffect(() => {
    if (selectedColor) {
      localStorage.setItem(
        getSelectionKey(),
        JSON.stringify({ color: selectedColor, size: selectedSize })
      );
    }
  }, [selectedColor, selectedSize, getSelectionKey]);

  useEffect(() => {
    const selectedVariant = product.variants.find(
      (v) => v.color === selectedColor
    );
    const selectedSizeObject = selectedVariant?.sizes.find(
      (s) => s.size === selectedSize
    );
    if (selectedSizeObject) {
      setEditSizeValue(selectedSizeObject.size);
      setEditStockValue(selectedSizeObject.stock);
      setShowUpdateButton(false);
    }
  }, [selectedSize, selectedColor, product.variants]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }

      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }

      if (
        stockUpdateRef.current &&
        !stockUpdateRef.current.contains(e.target)
      ) {
        setShowUpdateButton(false);
      }

      if (
        colorSectionRef.current &&
        !colorSectionRef.current.contains(e.target) &&
        colorButtonRef.current &&
        !colorButtonRef.current.contains(e.target)
      ) {
        setShowColorInput(false);
      }

      if (
        sizeSectionRef.current &&
        !sizeSectionRef.current.contains(e.target) &&
        sizeButtonRef.current &&
        !sizeButtonRef.current.contains(e.target)
      ) {
        setShowSizeInput(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handlers
  const handleColorClick = (color) => {
    setSelectedColor(color);
    const variant = product.variants.find((v) => v.color === color);
    setSelectedSize(variant?.sizes[0]?.size || null);
  };

  const handleProductInfoUpdate = (field, value) => {
    toast
      .promise(
        flexibleUpdate({
          productId: product._id,
          productUpdates: { [field]: value },
        }).unwrap(),
        {
          pending: 'Updating...',
          success: 'Product updated!',
          error: 'Update failed.',
        }
      )
      .finally(refetch);
  };

  const handleKeyFeaturesUpdate = (fields) => {
    const updatedKeyFeatures = {
      ...product.keyFeatures,
      ...fields,
    };

    toast
      .promise(
        flexibleUpdate({
          productId: product._id,
          productUpdates: {
            keyFeatures: updatedKeyFeatures,
          },
        }).unwrap(),
        {
          pending: 'Updating key features...',
          success: 'Key features updated!',
          error: 'Failed to update key features.',
        }
      )
      .finally(refetch);
  };

  const handleAddColor = () => {
    if (!newColorName) return toast.warn('Please select a color.');

    const selectedPredefinedColor = PREDEFINED_COLORS.find(
      (c) => c.name === newColorName
    );
    if (!selectedPredefinedColor) return toast.error('Invalid color selected.');

    const { name: color, value } = selectedPredefinedColor;
    const colors = product.variants.map((variant) => variant.color);

    if (colors.includes(color)) {
      return toast.info(`Color "${color}" is already added.`);
    }

    toast
      .promise(
        flexibleUpdate({
          productId: product._id,
          variantUpdates: [
            {
              newColor: color,
              newValue: value,
              newSizes: [
                { size: 39, stock: 0 },
                { size: 40, stock: 0 },
                { size: 41, stock: 0 },
                { size: 42, stock: 0 },
                { size: 43, stock: 0 },
                { size: 44, stock: 0 },
              ],
            },
          ],
        }).unwrap(),
        {
          pending: 'Adding color...',
          success: 'Color added successfully!',
          error: 'Failed to add color. It might already exist.',
        }
      )
      .then(() => {
        handleColorClick(color);
        setShowColorInput(false);
      })
      .finally(refetch);
  };

  const handleDeleteColor = (colorToDelete) => {
    showDeleteConfirmation(() => {
      toast
        .promise(
          deleteVariantOrSize({
            productId: product._id,
            targetColor: colorToDelete,
          }).unwrap(),
          {
            pending: 'Deleting color...',
            success: `Color "${colorToDelete}" deleted!`,
            error: 'Failed to delete color.',
          }
        )
        .finally(refetch);
    });
  };

  const handleAddSize = () => {
    const sizeValue = Number(newSizeInput);
    const stockValue = Number(newStockInput);

    if (!selectedColor) return toast.warn('Please select a color first.');
    if (isNaN(sizeValue) || sizeValue <= 0)
      return toast.warn('Please enter a valid size.');
    if (isNaN(stockValue) || stockValue < 0)
      return toast.warn('Please enter valid stock.');

    toast
      .promise(
        flexibleUpdate({
          productId: product._id,
          variantUpdates: [
            {
              targetColor: selectedColor,
              sizeUpdates: [{ newSize: sizeValue, newStock: stockValue }],
            },
          ],
        }).unwrap(),
        {
          pending: 'Adding size...',
          success: 'Size added successfully!',
          error: 'Failed to add size.',
        }
      )
      .then(() => {
        setSelectedSize(sizeValue);
        setNewSizeInput('');
        setNewStockInput('');
        setShowSizeInput(false);
      })
      .finally(refetch);
  };

  const handleDeleteSize = (sizeToDelete) => {
    showDeleteConfirmation(() => {
      toast
        .promise(
          deleteVariantOrSize({
            productId: product._id,
            targetColor: selectedColor,
            targetSize: sizeToDelete,
          }).unwrap(),
          {
            pending: 'Deleting size...',
            success: `Size "${sizeToDelete}" deleted!`,
            error: 'Failed to delete size.',
          }
        )
        .finally(refetch);
    });
  };

  const handleDeleteProduct = (productId) => {
    showDeleteConfirmation(() => {
      toast
        .promise(deleteProduct(productId).unwrap(), {
          pending: 'Deleting product...',
          success: 'Product deleted successfully!',
          error: 'Failed to delete product.',
        })
        .finally(() => {
          // Optional: Redirect or refresh the list view
          window.location.reload();
        });
    });
  };

  const handleStockUpdate = () => {
    toast
      .promise(
        flexibleUpdate({
          productId: product._id,
          variantUpdates: [
            {
              targetColor: selectedColor,
              sizeUpdates: [
                {
                  targetSize: selectedSize,
                  newSize: editSizeValue, // can be used to update size number as well
                  newStock: editStockValue,
                },
              ],
            },
          ],
        }).unwrap(),
        {
          pending: 'Updating stock...',
          success: 'Stock updated!',
          error: 'Failed to update stock.',
        }
      )
      .then(() => {
        setShowUpdateButton(false);
        refetch();
      });
  };

  const handleHideProduct = (productId) => {
    console.log(productId);
  };

  const handleUnhideProduct = (productId) => {
    console.log(productId);
  };

  const selectedVariant = product.variants.find(
    (v) => v.color === selectedColor
  );

  return (
    <div className="space-y-6">
      {/* --- TOP SECTION: Product Info & Image --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-20 md:p-6 bg-white rounded-lg">
        {/* Left: Details */}
        <div className="lg:col-span-2 space-y-4 order-2 md:order-none">
          <h2 className="text-2xl font-bold text-[#495057] border-b border-gray-300 pb-2 md:pb-3 pt-2">
            Product Details
          </h2>
          <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
            <DetailItem
              label="Name"
              value={product.name}
              onSave={(val) => handleProductInfoUpdate('name', val)}
            />
            <DetailItem
              label="Description"
              value={product.title}
              onSave={(val) => handleProductInfoUpdate('title', val)}
            />
            <DetailItem
              label="Category"
              value={product.category}
              onSave={(val) => handleProductInfoUpdate('category', val)}
            />
            <DetailItem
              label="Price"
              value={product.price}
              type="number"
              onSave={(val) => handleProductInfoUpdate('price', Number(val))}
            />
            <DetailItem
              label="Discount"
              value={product.discount}
              type="number"
              onSave={(val) => handleProductInfoUpdate('discount', Number(val))}
            />
            <InfoItem label="Total Stock" value={product.total_stock} />
            <InfoItem
              icon={<Clock size={16} />}
              label="Created At"
              value={formatDate(product.createdAt)}
            />
            <InfoItem
              icon={<Edit size={16} />}
              label="Updated At"
              value={formatDate(product.updatedAt)}
            />
          </div>
          {role === 'Admin' && (
            <button
              onClick={() => handleDeleteProduct(product._id)}
              className="py-2 px-4 pt-2 cursor-pointer bg-red-500 hover:bg-red-400 rounded-md mb-2 text-white md:hidden"
            >
              {isDeletingProduct ? (
                <Loader2 className="animate-spin" />
              ) : (
                <p>Delete</p>
              )}
            </button>
          )}
        </div>
        {/* Right: Image & Delete Button */}
        <div className="flex flex-col items-center lg:items-end order-1 md:order-none">
          <div className="relative flex items-center gap-2 mb-3">
            <button
              onClick={() => onProductOpen(true)}
              className="flex items-center gap-2 px-3 py-2.5 bg-[#099885] text-white rounded-lg text-sm font-semibold hover:bg-[#00846e] transition-colors cursor-pointer"
            >
              <Plus size={16} />
              Add Product
            </button>

            {role === 'Admin' && (
              <div ref={menuRef} className="relative md:block hidden">
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition cursor-pointer"
                >
                  <MoreVertical size={20} />
                </button>

                {menuOpen && (
                  <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                    <button
                      onClick={() => handleDeleteProduct(product._id)}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-red-100 cursor-pointer"
                    >
                      {isDeletingProduct ? (
                        <Loader2 className="animate-spin" size={16} />
                      ) : (
                        'Delete'
                      )}
                    </button>
                    <button
                      onClick={() => handleHideProduct(product._id)}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                    >
                      Hide
                    </button>
                    <button
                      onClick={() => handleUnhideProduct(product._id)}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                    >
                      Unhide
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          <img
            src={product.image}
            alt={product.name}
            className={`${
              role === 'Admin' ? 'mt-0' : 'mt-7'
            } w-full h-auto object-cover rounded-md lg:border border-gray-100`}
          />
        </div>
      </div>

      {/* --- BOTTOM SECTION: Variant Management --- */}
      <div className="md:p-6 bg-white rounded-lg">
        <h2 className="text-2xl font-bold text-[#495057] border-b border-gray-200 pb-2 mb-4">
          Manage Variants
        </h2>
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column: Color and Size Selection */}
          <div className="space-y-6">
            {/* Color Selection */}
            <div>
              <h3 className="text-lg font-semibold mb-2 text-[#495057]">
                Colors
              </h3>
              <div className="flex items-center gap-2 flex-wrap mb-4">
                {product.variants.map((variant) => (
                  <div key={variant.color} className="relative group">
                    <button
                      onClick={() => handleColorClick(variant.color)}
                      className={`px-4 py-2 cursor-pointer bg-[#f7f7f7] rounded-md border text-sm font-medium transition-all ${
                        selectedColor === variant.color
                          ? 'border-transparent text-white'
                          : `border-gray-200 text-[#878a99] hover:border-[#f1aa2e]`
                      }`}
                      style={{
                        backgroundColor:
                          selectedColor !== variant.color
                            ? undefined
                            : variant.value,
                      }}
                    >
                      {variant.color}
                    </button>
                    {role === 'Admin' && (
                      <button
                        onClick={() => handleDeleteColor(variant.color)}
                        className="absolute -top-2 -right-2 cursor-pointer bg-[#f06548] text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                        disabled={isDeleting}
                      >
                        <X size={14} />
                      </button>
                    )}
                  </div>
                ))}
                {role === 'Admin' && (
                  <button
                    ref={colorButtonRef}
                    onClick={() => setShowColorInput(!showColorInput)}
                    className={`flex items-center ${
                      showColorInput
                        ? 'bg-[#fde8e4] text-[#f06548] hover:bg-[#ffe3c2]'
                        : 'bg-[#daf4f0] text-[#0ab39c] hover:bg-[#b3e2d9]'
                    } duration-200 justify-center cursor-pointer w-10 h-10 rounded-full transition`}
                  >
                    <Plus
                      size={20}
                      className={`transition-transform duration-300 ${
                        showColorInput ? 'rotate-45' : ''
                      }`}
                    />
                  </button>
                )}
              </div>

              {showColorInput && (
                <div
                  ref={colorSectionRef}
                  className="flex flex-col sm:flex-row gap-2 items-end p-4 bg-gray-50 rounded-lg"
                >
                  <ColorDropdown
                    label="Color"
                    options={PREDEFINED_COLORS}
                    selectedValue={newColorName}
                    onSelect={setNewColorName}
                    isOpen={isOpen}
                    setIsOpen={setIsOpen}
                    dropdownRef={dropdownRef}
                  />
                  <button
                    onClick={handleAddColor}
                    className="bg-[#099885] hover:bg-[#00846e] cursor-pointer text-white px-4 py-2 rounded-md w-full sm:w-auto"
                    disabled={isUpdating}
                  >
                    Add Color
                  </button>
                </div>
              )}
            </div>

            {/* Size and Stock Management */}
            {selectedVariant && (
              <div className="py-4 border-t border-gray-200">
                <h3 className="text-lg font-semibold mb-2 text-[#495057]">
                  Sizes for{' '}
                  <span className="text-[#f1aa2e]">{selectedColor}</span>
                </h3>
                <div className="flex items-center gap-2 flex-wrap mb-6 border-b pb-6 border-gray-200">
                  {selectedVariant.sizes.map((sizeObj) => (
                    <div key={sizeObj.size} className="relative group">
                      <button
                        onClick={() => setSelectedSize(sizeObj.size)}
                        className={`px-4 py-2 rounded-md cursor-pointer border transition-all ${
                          selectedSize === sizeObj.size
                            ? 'bg-[#f1aa2e] border-[#f1aa2e] font-bold text-white'
                            : 'bg-[#f7f7f7] border-gray-200 hover:border-[#f1aa2e]'
                        }`}
                      >
                        {sizeObj.size}
                      </button>
                      {role === 'Admin' && (
                        <button
                          onClick={() => handleDeleteSize(sizeObj.size)}
                          className="absolute -top-2 -right-2 cursor-pointer bg-[#f06548] text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                          disabled={isDeleting}
                        >
                          <X size={14} />
                        </button>
                      )}
                    </div>
                  ))}
                  {role === 'Admin' && (
                    <button
                      ref={sizeButtonRef}
                      onClick={() => setShowSizeInput(!showSizeInput)}
                      className={`flex items-center ${
                        showSizeInput
                          ? 'bg-[#fde8e4] text-[#f06548] hover:bg-[#ffe3c2]'
                          : 'bg-[#daf4f0] text-[#0ab39c] hover:bg-[#b3e2d9]'
                      } duration-200 justify-center cursor-pointer w-10 h-10 rounded-full transition`}
                    >
                      <Plus
                        size={20}
                        className={`transition-transform duration-300 ${
                          showSizeInput ? 'rotate-45' : ''
                        }`}
                      />
                    </button>
                  )}
                </div>

                {showSizeInput && (
                  <div
                    ref={sizeSectionRef}
                    className="flex flex-col sm:flex-row gap-2 mb-6"
                  >
                    <input
                      type="number"
                      placeholder="New Size"
                      value={newSizeInput}
                      onChange={(e) => setNewSizeInput(e.target.value)}
                      autoFocus
                      className="px-3 py-2 border border-gray-300 rounded-md w-full sm:w-1/3 focus:outline-none no-arrows"
                    />
                    {/* <input
                      type="number"
                      placeholder="Initial Stock"
                      value={newStockInput}
                      onChange={(e) => setNewStockInput(e.target.value)}
                      // autoFocus
                      className="px-3 py-2 border border-gray-300 rounded-md w-full sm:w-1/3 focus:outline-none"
                    /> */}
                    <button
                      onClick={handleAddSize}
                      className="bg-[#099885] hover:bg-[#00846e] text-white px-4 py-2 rounded-md w-full sm:w-auto"
                      disabled={isUpdating}
                    >
                      Add Size
                    </button>
                  </div>
                )}

                {/* Stock Editor */}
                {selectedSize !== null && (
                  <div
                    ref={stockUpdateRef}
                    className="bg-[#f7f7f7] rounded-lg p-4"
                  >
                    <h4 className="font-semibold text-[#495057] mb-2">
                      Stock for size {selectedSize}
                    </h4>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        {role === 'Admin' && (
                          <button
                            onClick={() => {
                              setEditStockValue((v) => Math.max(0, v - 1));
                              setShowUpdateButton(true);
                            }}
                            className="p-3 border border-gray-300 rounded-l-lg hover:bg-gray-200"
                            disabled={isUpdating}
                          >
                            <Minus size={16} />
                          </button>
                        )}
                        <input
                          type="number"
                          value={editStockValue ?? ''}
                          onChange={(e) => {
                            let val = e.target.value;

                            if (val.length > 1 && val.startsWith('0')) {
                              val = val.replace(/^0+(?=\d)/, '');
                            }

                            const numericVal = Number(val);

                            if (!isNaN(numericVal) && numericVal >= 0) {
                              setEditStockValue(val === '' ? '' : numericVal);
                              setShowUpdateButton(true);
                            }
                          }}
                          className={`${
                            role !== 'Admin' ? 'border' : 'border-t border-b'
                          } no-arrows w-24 text-center py-1.5 border-gray-300 font-bold text-lg text-[#f1aa2e] outline-none bg-white`}
                        />
                        {role === 'Admin' && (
                          <button
                            onClick={() => {
                              setEditStockValue((v) => v + 1);
                              setShowUpdateButton(true);
                            }}
                            className="p-3 border border-gray-300 rounded-r-lg hover:bg-gray-200"
                            disabled={isUpdating}
                          >
                            <Plus size={16} />
                          </button>
                        )}
                      </div>
                      {showUpdateButton && role === 'Admin' && (
                        <div className="mt-4 flex justify-end">
                          <button
                            onClick={handleStockUpdate}
                            className="bg-[#0ab39c] text-white px-4 py-2 rounded-md w-full sm:w-auto cursor-pointer"
                            disabled={isUpdating}
                          >
                            {isUpdating ? 'Updating...' : 'Update Stock'}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Column: Image Management */}
          <div className="mt-2">
            {selectedVariant ? (
              <ImageManager
                productId={product._id}
                selectedColor={selectedVariant.color}
                images={selectedVariant.images}
                refetch={refetch}
              />
            ) : (
              <div className="flex items-center justify-center h-full bg-gray-50 rounded-lg">
                <p className="text-gray-500">
                  Select a color to manage its images.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div>
        <KeyFeaturesManager
          keyFeatures={product.keyFeatures}
          onUpdate={(updatedFields) => handleKeyFeaturesUpdate(updatedFields)}
        />
      </div>

      {/* Global Loading Indicator */}
      {(isUpdating || isDeleting) && (
        <div className="fixed bottom-6 right-6 bg-blue-100 text-[#0ab39c] px-4 py-2 rounded-lg flex items-center gap-2">
          <Loader2 className="animate-spin" size={20} />
          <span>Processing...</span>
        </div>
      )}

      <div className="lg:mb-0 mb-10">
        <CouponManagement productId={product._id} />
      </div>
    </div>
  );
};

const KeyFeaturesManager = ({ keyFeatures, onUpdate }) => {
  const [localFeatures, setLocalFeatures] = useState({
    subtitle: keyFeatures?.subtitle || '',
    paragraph: keyFeatures?.paragraph || '',
    bullets: keyFeatures?.bullets || [],
  });

  const [newBullet, setNewBullet] = useState('');
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    setLocalFeatures({
      subtitle: keyFeatures?.subtitle || '',
      paragraph: keyFeatures?.paragraph || '',
      bullets: keyFeatures?.bullets || [],
    });
    setIsDirty(false);
  }, [keyFeatures]);

  const updateField = (field, value) => {
    setLocalFeatures((prev) => ({
      ...prev,
      [field]: value,
    }));
    setIsDirty(true);
  };

  const updateBullet = (index, value) => {
    const updated = [...localFeatures.bullets];
    updated[index] = value;
    updateField('bullets', updated);
  };

  const addBullet = () => {
    const trimmed = newBullet.trim();
    if (!trimmed) return;
    const updated = [...localFeatures.bullets, trimmed];
    updateField('bullets', updated);
    setNewBullet('');
  };

  const removeBullet = (index) => {
    const updated = localFeatures.bullets.filter((_, i) => i !== index);
    updateField('bullets', updated);
  };

  const handleSave = () => {
    onUpdate(localFeatures);
    setIsDirty(false);
  };

  return (
    <div className="md:p-6 bg-white rounded-lg">
      <h2 className="text-2xl font-bold text-[#495057] border-b border-gray-200 pb-2 mb-4">
        Key Features Management
      </h2>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="flex flex-col space-y-1">
          <label className="font-semibold text-[#495057]">Subtitle:</label>
          <input
            value={localFeatures.subtitle}
            onChange={(e) => updateField('subtitle', e.target.value)}
            className="px-3 py-2 bg-white border border-gray-200 rounded-lg outline-none"
          />
        </div>

        <div className="flex flex-col space-y-1">
          <label className="font-semibold text-[#495057]">Details:</label>
          <input
            value={localFeatures.paragraph}
            onChange={(e) => updateField('paragraph', e.target.value)}
            className="px-3 py-2 bg-white border border-gray-200 rounded-lg outline-none resize-none"
          />
        </div>
      </div>

      <div className="mt-6">
        <label className="font-semibold text-[#495057] mb-2 block">
          Bullets:
        </label>
        <div className="space-y-2">
          {localFeatures.bullets.map((bullet, index) => (
            <div key={index} className="flex items-center gap-2">
              <input
                value={bullet}
                onChange={(e) => updateBullet(index, e.target.value)}
                className="flex-grow px-3 py-2 bg-white border border-gray-200 rounded-lg outline-none"
              />
              <button
                onClick={() => removeBullet(index)}
                className="p-2 bg-red-100 text-[#f06548] rounded-md cursor-pointer"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
          <div className="flex items-center gap-2 mt-2">
            <input
              value={newBullet}
              onChange={(e) => setNewBullet(e.target.value)}
              placeholder="Add new bullet..."
              className="flex-grow px-3 py-2 bg-white border border-gray-200 rounded-lg outline-none"
            />
            <button
              onClick={addBullet}
              className="p-2 bg-[#daf4f0] text-[#0ab39c] hover:bg-[#b3e2d9] rounded-md cursor-pointer"
            >
              <Plus size={16} />
            </button>
          </div>
        </div>
      </div>

      {isDirty && (
        <div className="mt-6">
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-[#099885] hover:bg-[#00846e] cursor-pointer text-white rounded-md flex items-center gap-2"
          >
            <Save size={18} />
            Save Changes
          </button>
        </div>
      )}
    </div>
  );
};

const ImageManager = ({ productId, selectedColor, images = [], refetch }) => {
  const [fileUpload, { isLoading: isUploading }] = useFileUploadMutation();
  const [flexibleUpdate, { isLoading: isUpdating }] =
    useFlexibleProductUpdateMutation();
  const { role } = useUserRole();

  const isLoading = isUploading || isUpdating;

  // --- DRAG & DROP HANDLER ---
  const onDrop = useCallback(
    async (acceptedFiles) => {
      if (!acceptedFiles?.length || !selectedColor) return;

      const formData = new FormData();
      acceptedFiles.forEach((file) => formData.append('files', file));

      try {
        const uploadResponse = await toast.promise(
          fileUpload(formData).unwrap(),
          {
            pending: 'Uploading images...',
            success: 'Upload successful! Saving to product...',
            error: 'Image upload failed.',
          }
        );

        const urls = uploadResponse?.urls ?? [];
        if (urls.length) {
          await flexibleUpdate({
            productId,
            variantUpdates: [
              {
                targetColor: selectedColor,
                newImages: urls,
              },
            ],
          }).unwrap();

          toast.success('Product updated with new images!');
          refetch?.();
        }
      } catch {
        toast.error('Could not save new images to the product.');
      }
    },
    [fileUpload, flexibleUpdate, productId, selectedColor, refetch]
  );

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    open: openFileDialog,
  } = useDropzone({
    onDrop,
    noClick: true,
    noKeyboard: true,
    accept: {
      'image/*': [],
    },
    multiple: true,
    disabled: isLoading || !selectedColor,
  });

  // --- DELETE HANDLER ---
  const handleDeleteImage = (imageUrlToDelete) => {
    showDeleteConfirmation(() => {
      toast
        .promise(
          flexibleUpdate({
            productId,
            variantUpdates: [
              {
                targetColor: selectedColor,
                imageToRemove: imageUrlToDelete,
              },
            ],
          }).unwrap(),
          {
            pending: 'Deleting image...',
            success: 'Image deleted successfully!',
            error: 'Failed to delete image.',
          }
        )
        .finally(refetch);
    });
  };

  return (
    <div className="space-y-4 h-full">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-[#495057]">
          Images for <span className="text-[#f1aa2e]">{selectedColor}</span>
        </h3>

        {role === 'Admin' && (
          <button
            onClick={openFileDialog}
            disabled={isLoading || !selectedColor}
            className="cursor-pointer bg-[#099885] disabled:bg-[#7fc8bc] text-white rounded-lg text-sm font-semibold hover:bg-[#00846e] px-4 py-2.5 flex items-center gap-2 transition-colors"
          >
            {isLoading ? (
              <Loader2 size={20} className="animate-spin" />
            ) : (
              <UploadCloud size={20} />
            )}
            <span>Browse…</span>
          </button>
        )}
      </div>

      {/* Unified Dropzone Area */}
      {role === 'Admin' && (
        <div
          {...getRootProps()}
          className={`rounded-lg border-2 border-dashed h-auto transition p-4 space-y-4
      ${
        isDragActive
          ? 'border-[#0ab39c] bg-[#daf4f0]'
          : 'border-gray-300 bg-gray-50'
      }
      ${!selectedColor ? 'opacity-60 pointer-events-none' : ''}
    `}
        >
          <input {...getInputProps()} />

          {/* Dropzone Prompt (visible when no images or drag active) */}
          {(isDragActive || images.length === 0) && (
            <div className="flex flex-col items-center gap-2 py-8 text-center">
              <UploadCloud size={32} className="text-gray-400" />
              <p className="text-gray-500">
                Drag & drop images here, or{' '}
                <button
                  type="button"
                  onClick={openFileDialog}
                  className="text-[#0ab39c] underline cursor-pointer"
                  disabled={isLoading || !selectedColor}
                >
                  browse
                </button>
              </p>
              <p className="text-xs text-gray-400">
                JPG, PNG, WEBP — multiple files allowed
              </p>
            </div>
          )}

          {/* Gallery inside dropzone */}
          {images.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {images.map((imgUrl, index) => (
                <div key={index} className="relative group aspect-square">
                  <img
                    src={imgUrl}
                    alt={`${selectedColor} variant ${index + 1}`}
                    className="w-full h-full object-cover rounded-lg border border-gray-100"
                  />
                  <button
                    onClick={() => handleDeleteImage(imgUrl)}
                    className="absolute top-1 right-1 bg-[#f06548] cursor-pointer text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    disabled={isLoading}
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ---UNCHANGED HELPER COMPONENTS---
const DetailItem = ({ label, value, onSave, type = 'text' }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [currentValue, setCurrentValue] = useState(value);
  const { role } = useUserRole();
  const handleSave = () => {
    if (currentValue !== value) {
      onSave(currentValue);
    }
    setIsEditing(false);
  };
  return (
    <div className="flex flex-col space-y-1 border-b py-2 border-gray-200">
      <label className="font-semibold text-[#495057]">{label}:</label>
      {isEditing ? (
        <div className="flex items-center gap-2">
          {type === 'textarea' ? (
            <textarea
              value={currentValue}
              onChange={(e) => setCurrentValue(e.target.value)}
              onBlur={handleSave}
              autoFocus
              className="flex-grow px-3 py-2 bg-white border border-gray-200 rounded-lg outline-none"
            />
          ) : (
            <input
              type={type}
              value={currentValue}
              onChange={(e) => setCurrentValue(e.target.value)}
              onBlur={handleSave}
              autoFocus
              className="flex-grow px-3 py-2 bg-white border border-gray-200 rounded-lg outline-none"
            />
          )}
          <button
            onClick={handleSave}
            className="p-2 cursor-pointer bg-green-100 text-green-700 rounded-md"
          >
            <Save size={18} className="text-[#878a99]" />
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-2 group">
          <p className="text-[#878a99] flex-grow min-h-[36px] flex items-center">
            {value}
          </p>
          {role === 'Admin' && (
            <button
              onClick={() => setIsEditing(true)}
              className="p-2 cursor-pointer hover:bg-gray-100 rounded-md lg:opacity-0 lg:group-hover:opacity-100 transition-opacity"
            >
              <Edit size={16} className="text-[#878a99]" />
            </button>
          )}
        </div>
      )}
    </div>
  );
};

const InfoItem = ({ label, value, icon }) => (
  <div className="flex flex-col space-y-1 border-b py-2 border-gray-200">
    <label className="font-semibold text-[#495057] flex items-center gap-2">
      {icon} {label}
    </label>
    <p className=" text-[#878a99]">{value}</p>
  </div>
);

// Main Component: ProductsPage
export default function ProductsPage() {
  const { data: summaryData, isLoading: isSummaryLoading } =
    useGetProductSummaryQuery();
  const [activeName, setActiveName] = useState(
    () => localStorage.getItem('activeProductName') || ''
  );
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);

  useEffect(() => {
    if (!activeName && summaryData?.data?.uniqueNames?.length > 0) {
      const defaultName = summaryData.data.uniqueNames[0];
      setActiveName(defaultName);
      localStorage.setItem('activeProductName', defaultName);
    }
  }, [summaryData, activeName]);

  const handleSetActiveName = (name) => {
    setActiveName(name);
    localStorage.setItem('activeProductName', name);
  };

  const {
    data,
    isLoading: areProductsLoading,
    refetch,
  } = useGetAllProductsQuery(
    { name: activeName, limit: 1 },
    { skip: !activeName }
  );

  const product = data?.data?.[0];
  const isLoading = isSummaryLoading || areProductsLoading;

  return (
    <div className="flex h-screen bg-white p-4 md:p-6">
      <div className="w-1/5 xl:w-1/6 bg-[#f7f7f7] p-4 md:p-6 rounded-l-lg pr-0 md:pr-0 md:block hidden">
        <aside className="bg-white h-full rounded-lg space-y-2 overflow-y-auto p-4 md:p-6">
          <h2 className="text-2xl font-bold mt-2 mb-3 text-[#495057]">
            Products Name
          </h2>
          {isSummaryLoading && !summaryData ? (
            <div className="flex justify-center p-4">
              <Loader2 className="w-6 h-6 animate-spin text-[#495057]" />
            </div>
          ) : (
            summaryData?.data?.uniqueNames?.map((name) => (
              <button
                key={name}
                onClick={() => handleSetActiveName(name)}
                className={`block w-full cursor-pointer text-left px-4 font-semibold py-2.5 border border-gray-200 rounded-lg hover:bg-[#f7f7f7] transition-all ${
                  activeName === name
                    ? 'bg-[#f7f7f7] text-[#495057]'
                    : 'text-[#878a99]'
                }`}
              >
                {name}
              </button>
            ))
          )}
          {summaryData?.data?.length || (
            <button
              onClick={() => setIsAddProductOpen(true)}
              className="flex items-center w-full gap-2 px-3 py-2.5 bg-[#099885] text-white rounded-lg text-sm font-semibold hover:bg-[#00846e] transition-colors cursor-pointer"
            >
              <Plus size={16} />
              Add Product
            </button>
          )}
        </aside>
      </div>
      <main className="flex-1 md:p-6 p-0 md:overflow-y-auto md:bg-[#f7f7f7]">
        <div className="md:hidden">
          <h2 className="text-2xl font-bold mb-2 text-[#495057]">Products</h2>
          <div className="mb-6">
            {isSummaryLoading && !summaryData ? (
              <div className="flex justify-center p-4">
                <Loader2 className="w-5 h-5 animate-spin text-[#495057]" />
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                {summaryData?.data?.uniqueNames?.map((name) => (
                  <button
                    key={name}
                    onClick={() => handleSetActiveName(name)}
                    className={`block text-left px-4 py-2.5 font-semibold text-nowrap border border-gray-200 rounded hover:bg-[#f7f7f7] transition-all ${
                      activeName === name
                        ? 'bg-[#f7f7f7] text-[#495057]'
                        : 'text-[#878a99]'
                    }`}
                  >
                    {name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <Loader2 className="w-8 h-8 animate-spin text-[#495057]" />
          </div>
        ) : product ? (
          <ProductDetailView
            key={product._id}
            product={product}
            refetch={refetch}
            onProductOpen={setIsAddProductOpen}
          />
        ) : (
          <div className="flex justify-center items-center h-full">
            <p className="text-gray-500 text-xl">
              Select a product to view its details.
            </p>
          </div>
        )}
      </main>
      <div
        className={`fixed top-0 left-0 lg:left-14 h-full w-full bg-gray-100 shadow-md z-20 md:p-6 transition-transform duration-300 overflow-y-auto ${
          isAddProductOpen ? 'translate-y-0' : '-translate-y-full'
        }`}
      >
        <AddProductForm onClose={() => setIsAddProductOpen(false)} />
      </div>
    </div>
  );
}
