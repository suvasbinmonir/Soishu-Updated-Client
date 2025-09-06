import { useState, useEffect, useRef } from 'react';
import {
  Bell,
  ChevronDown,
  Grid2X2Plus,
  Loader2,
  MoreVertical,
  Pencil,
  Plus,
  PlusIcon,
  Star,
  Trash2,
} from 'lucide-react';
import {
  orderApi,
  useDeletePurchaseProductByIdMutation,
  useGetAllPurchaseProductsQuery,
  usePurchaseProductMutation,
  useUpdatePurchaseProductByIdMutation,
} from '../api/ordersApi';
import axios from 'axios';
import { customAlphabet } from 'nanoid';
import { toast } from 'react-toastify';
import { showDeleteConfirmation } from './ShowDeleteConfirmation';
import AddOrderForm from '../Pages/AddOrderForm';
import { useGetProductSummaryQuery } from '../api/productsApi';
import { useUserRole } from '../hooks/useRole';
import { FaWhatsapp } from 'react-icons/fa';
import { LiaFacebook } from 'react-icons/lia';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { format, formatDistanceToNow } from 'date-fns';
import { DateRangePicker } from 'react-date-range';
import { confirmAlert } from 'react-confirm-alert';
import { useGetAllUsersQuery } from '../api/userApi';
import { useDispatch } from 'react-redux';
import {
  useGetAllNotificationsQuery,
  useGetUnseenNotificationsQuery,
  useMarkNotificationAsSeenMutation,
} from '../api/notificationApi';

const nanoid = customAlphabet(
  'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_',
  8
);

const TRACKING_BASE_URL = 'https://steadfast.com.bd/t/';

const HeaderDropdown = ({
  label,
  options,
  selectedValue,
  onSelect,
  isOpen,
  setIsOpen,
  dropdownKey,
  dropdownRef,
}) => {
  const handleClick = () => {
    setIsOpen((prev) => (prev === dropdownKey ? null : dropdownKey));
  };

  return (
    <div ref={dropdownRef} className="relative select-none z-20">
      <div
        onClick={handleClick}
        className="flex items-center lg:justify-normal md:justify-between gap-2 cursor-pointer text-xs uppercase"
      >
        <span>{label}</span>
        <ChevronDown
          className={`w-4 h-4 transition-transform ${
            isOpen === dropdownKey ? 'rotate-180' : ''
          }`}
        />
      </div>

      {isOpen === dropdownKey && (
        <div className="absolute top-full md:left-0 -left-4 z-[9999] mt-2 md:w-40 w-24 bg-white border border-gray-200 rounded-lg shadow-lg overflow-auto">
          <ul className="py-1 md:text-xs text-[10px] text-[#495057] capitalize">
            <li
              className={`md:px-4 px-1.5 md:py-2 py-1.5 hover:bg-[#fbfbfb] cursor-pointer ${
                selectedValue === '' ? 'bg-[#fbfbfb]' : ''
              }`}
              onClick={() => {
                onSelect('');
                setIsOpen(null);
              }}
            >
              All {label}s
            </li>
            {options.map((opt) => (
              <li
                key={opt}
                onClick={() => {
                  onSelect(opt);
                  setIsOpen(null);
                }}
                className={`md:px-4 px-2 md:py-2 py-1.5 hover:bg-[#f7f7f7] md:text-xs text-[10px] font-normal cursor-pointer ${
                  selectedValue === opt ? 'bg-[#f7f7f7]' : ''
                }`}
              >
                {opt}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

const PaginationDropdown = ({
  options = [],
  selectedValue,
  onSelect,
  isOpen,
  setIsOpen,
  dropdownKey,
  dropdownRef,
}) => {
  const handleClick = () => {
    setIsOpen((prev) => (prev === dropdownKey ? null : dropdownKey));
  };

  return (
    <div ref={dropdownRef} className="relative select-none z-20">
      {/* Dropdown Button */}
      <div
        onClick={handleClick}
        className="flex items-center gap-2 cursor-pointer text-sm bg-white border border-gray-200 px-4 py-2 rounded-lg hover:bg-gray-100"
      >
        <span>{selectedValue} per page</span>
        <ChevronDown
          className={`w-4 h-4 transition-transform ${
            isOpen === dropdownKey ? 'rotate-180' : ''
          }`}
        />
      </div>

      {/* Dropdown Options (Above) */}
      {isOpen === dropdownKey && (
        <div className="absolute bottom-full left-0 z-[9999] mb-1 w-36 bg-white border border-gray-200 rounded-lg overflow-auto">
          <ul className="py-1 text-sm text-[#495057]">
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
                {opt} per page
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

const showSelfStatusConfirmation = (onConfirm) => {
  confirmAlert({
    overlayClassName:
      'bg-black bg-opacity-10 inset-0 flex items-center justify-center',
    customUI: ({ onClose }) => (
      <div className="bg-white rounded-lg border border-gray-300 p-4 max-w-xs w-full text-center space-y-3">
        <h2 className="text-lg font-semibold text-gray-800">Change Status?</h2>
        <p className="text-gray-600 text-sm">
          Are you sure you want to set this order as <b>Self</b>?
        </p>
        <div className="flex justify-center space-x-3 pt-2">
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="bg-[#099885] text-white rounded-md hover:bg-[#00846e] text-sm px-3 py-1.5 transition cursor-pointer"
          >
            Yes
          </button>
          <button
            onClick={onClose}
            className="border border-gray-300 rounded-md hover:bg-gray-100 text-sm px-3 py-1.5 transition cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    ),
  });
};

const statusStyles = {
  Queued: 'bg-[#E1EBFD] text-[#3577F1] border-[#3577F1CC]',
  Confirmed: 'bg-[#DAF4F0] text-[#0AB39C] border-[#0AB39CCC]',
  Packed: 'bg-[#FEF4E4] text-[#F7B84B] border-[#F7B84BCC]',
  Fake: 'bg-[#FDE8E4] text-[#F06548] border-[#F06548CC]',
  Self: 'bg-[#F0E6FF] text-[#7C3AED] border-[#7C3AEDCC]',
  default: 'bg-gray-100 text-gray-800',
};

const StatusDropdown = ({
  selectedStatus,
  onChange,
  isOpen,
  setIsOpen,
  dropdownKey,
  productId,
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
    setIsOpen((prev) => (prev === dropdownKey ? null : dropdownKey));
  };

  const handleSelect = (status) => {
    if (status !== selectedStatus) {
      onChange(productId, status);
    }
    setIsOpen(null);
  };

  return (
    <div className="relative select-none inline-block text-xs">
      <button
        onClick={(e) => handleToggle(e)}
        className={`flex items-center justify-between w-24 rounded px-2 py-1 border focus:outline-none cursor-pointer z-0
          ${
            statusStyles[selectedStatus]
              ? statusStyles[selectedStatus]
              : statusStyles.default
          }
        `}
      >
        <span>{selectedStatus}</span>
        <ChevronDown
          className={`w-4 h-4 ml-1 transition-transform text-current ${
            isOpen === dropdownKey ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isOpen === dropdownKey && (
        <ul
          ref={dropdownRef}
          className="absolute top-full left-0 mt-2 w-24 bg-white border border-gray-200 rounded-lg overflow-auto py-1"
          style={{ zIndex: 9999 }}
        >
          {Object.keys(statusStyles)
            .filter((status) => status !== 'default')
            .map((status) => (
              <li
                key={status}
                onClick={() => handleSelect(status)}
                className={`px-3 py-1 cursor-pointer hover:bg-gray-100 ${
                  selectedStatus === status ? 'font-semibold bg-gray-50' : ''
                }`}
              >
                {status}
              </li>
            ))}
        </ul>
      )}
    </div>
  );
};

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const dateObj = new Date(dateString);

  const datePart = dateObj.toLocaleDateString('en-US', {
    year: '2-digit',
    month: 'long',
    day: 'numeric',
  });

  const timePart = dateObj.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  return { datePart, timePart };
};

const OrderTable = () => {
  const [editCell, setEditCell] = useState({ rowId: null, field: null });
  const [copiedCell, setCopiedCell] = useState({ rowId: null, field: null });
  const [loadingRowId, setLoadingRowId] = useState(null);
  const [loadingStatusId, setLoadingStatusId] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [actionMenuOpen, setActionMenuOpen] = useState(null);
  const [actionMenuOpenTwo, setActionMenuOpenTwo] = useState(null);
  const [isAddOrderOpen, setIsAddOrderOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [openDropdownMobile, setOpenDropdownMobile] = useState(null);
  const [sizeValue, setSizeValue] = useState();
  const [viaValue, setViaValue] = useState();
  const [oStatusValue, setOStatusValue] = useState();
  const [statusValue, setStatusValue] = useState();
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const { role, user } = useUserRole();
  const dispatch = useDispatch();
  const [dateRange, setDateRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: 'selection',
    },
  ]);

  const initialFilters = {
    official_status: '',
    search: '',
    color: '',
    product_size: '',
    minPrice: '',
    maxPrice: '',
    startDate: '',
    endDate: '',
    sortBy: 'createdAt',
    sort: 'desc',
    page: 1,
    limit: 50,
  };

  // Apply Date Filter
  const handleApplyDateFilter = () => {
    setFilters((prev) => ({
      ...prev,
      startDate: dateRange[0].startDate.toISOString(),
      endDate: dateRange[0].endDate.toISOString(),
    }));
    setIsDatePickerOpen(false);
  };

  const [filters, setFilters] = useState(initialFilters);
  const { data, isLoading, refetch } = useGetAllPurchaseProductsQuery(filters);

  const totalValid = data?.totalValid || 0;
  const totalFake = data?.totalFake || 0;
  const totalQueued = data?.totalQueued || 0;
  const totalConfirmed = data?.totalConfirmed || 0;
  const totalPacked = data?.totalPacked || 0;
  const totalSelf = data?.totalSelf || 0;

  const excludedStatuses = ['Fake'];

  // Filter out Fake only when no official_status filter is applied
  let products = data?.data || [];
  if (!filters.official_status) {
    products = products.filter(
      (p) => !excludedStatuses.includes(p.official_status)
    );
  }

  // Normalize filter for comparison to handle case-insensitive status filters
  const normalizedStatus = filters.official_status?.toLowerCase() || '';

  const getDisplayTotal = () => {
    switch (normalizedStatus) {
      case 'fake':
        return totalFake;
      case 'queued':
        return totalQueued;
      case 'confirmed':
        return totalConfirmed;
      case 'packed':
        return totalPacked;
      case 'self':
        return totalSelf;
      default:
        return totalValid;
    }
  };

  const [deletePurchaseProduct] = useDeletePurchaseProductByIdMutation();
  const [updatePurchaseProduct] = useUpdatePurchaseProductByIdMutation();
  const { data: summaryData } = useGetProductSummaryQuery();
  const [purchaseProduct] = usePurchaseProductMutation();
  const { data: userData } = useGetAllUsersQuery();
  const users = userData?.data || [];
  const userNames = users.map((user) => user.name);

  const actionMenuRef = useRef(null);
  const actionMenuRefTwo = useRef(null);
  const sizeDropdownRef = useRef(null);
  const productDropdownRef = useRef(null);
  const colorDropdownRef = useRef(null);
  const viaDropdownRef = useRef(null);
  const oStatusDropdownRef = useRef(null);
  const statusDropdownRef = useRef(null);
  const clickTimer = useRef(null);
  const editCellWrapperRef = useRef(null);
  const editCellUpdateBtnRef = useRef(null);
  const paginationDropdownRef = useRef(null);
  const datePickerRef = useRef(null);
  const assignedDropdownRef = useRef(null);
  const notificationRef = useRef(null);

  // For mobile ref
  const sizeDropdownRefMobile = useRef(null);
  const viaDropdownRefMobile = useRef(null);
  const oStatusDropdownRefMobile = useRef(null);
  const statusDropdownRefMobile = useRef(null);

  // Auto-refresh delivery status every 60 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      products.forEach((product) => {
        if (product.tracking_code && product.tracking_code !== 'null') {
          checkDeliveryStatus(product._id, product.tracking_code, false);
        }
      });
    }, 60000);

    return () => clearInterval(interval);
  }, [products]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      // Close action menu
      if (actionMenuRef.current && !actionMenuRef.current.contains(e.target)) {
        setActionMenuOpen(null);
      }

      if (
        notificationRef.current &&
        !notificationRef.current.contains(e.target)
      ) {
        setOpen(false);
      }

      if (datePickerRef.current && !datePickerRef.current.contains(e.target)) {
        setIsDatePickerOpen(false);
      }

      if (
        actionMenuRefTwo.current &&
        !actionMenuRefTwo.current.contains(e.target)
      ) {
        setActionMenuOpenTwo(null);
      }

      // Keep edit mode open if clicking inside input wrapper or update button
      if (
        (editCellWrapperRef.current &&
          editCellWrapperRef.current.contains(e.target)) ||
        (editCellUpdateBtnRef.current &&
          editCellUpdateBtnRef.current.contains(e.target))
      ) {
        return;
      } else {
        setEditCell({ rowId: null, field: null });
      }

      // Close dropdowns if clicked outside
      if (
        openDropdown === 'size' &&
        sizeDropdownRef.current &&
        !sizeDropdownRef.current.contains(e.target)
      ) {
        setOpenDropdown(null);
      }

      if (
        openDropdown === 'via' &&
        viaDropdownRef.current &&
        !viaDropdownRef.current.contains(e.target)
      ) {
        setOpenDropdown(null);
      }

      if (
        openDropdown === 'official_status' &&
        oStatusDropdownRef.current &&
        !oStatusDropdownRef.current.contains(e.target)
      ) {
        setOpenDropdown(null);
      }

      if (
        openDropdown === 'status' &&
        statusDropdownRef.current &&
        !statusDropdownRef.current.contains(e.target)
      ) {
        setOpenDropdown(null);
      }

      if (
        openDropdown === 'product' &&
        productDropdownRef.current &&
        !productDropdownRef.current.contains(e.target)
      ) {
        setOpenDropdown(null);
      }

      if (
        openDropdown === 'color' &&
        colorDropdownRef.current &&
        !colorDropdownRef.current.contains(e.target)
      ) {
        setOpenDropdown(null);
      }

      if (
        openDropdown === 'assigned' &&
        assignedDropdownRef.current &&
        !assignedDropdownRef.current.contains(e.target)
      ) {
        setOpenDropdown(null);
      }

      if (
        openDropdown === 'pagination' &&
        paginationDropdownRef.current &&
        !paginationDropdownRef.current.contains(e.target)
      ) {
        setOpenDropdown(null);
      }

      // Close dropdowns for mobile if clicked outside
      if (
        openDropdownMobile === 'size' &&
        sizeDropdownRefMobile.current &&
        !sizeDropdownRefMobile.current.contains(e.target)
      ) {
        setOpenDropdownMobile(null);
      }

      if (
        openDropdownMobile === 'via' &&
        viaDropdownRefMobile.current &&
        !viaDropdownRefMobile.current.contains(e.target)
      ) {
        setOpenDropdownMobile(null);
      }

      if (
        openDropdownMobile === 'official_status' &&
        oStatusDropdownRefMobile.current &&
        !oStatusDropdownRefMobile.current.contains(e.target)
      ) {
        setOpenDropdownMobile(null);
      }

      if (
        openDropdownMobile === 'status' &&
        statusDropdownRefMobile.current &&
        !statusDropdownRefMobile.current.contains(e.target)
      ) {
        setOpenDropdownMobile(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [openDropdown, openDropdownMobile]);

  const handleDelete = async (orderId) => {
    showDeleteConfirmation(async () => {
      try {
        await toast.promise(deletePurchaseProduct(orderId).unwrap(), {
          pending: 'Deleting order...',
          success: `Order "${orderId}" deleted!`,
          error: 'Failed to delete order.',
        });
        refetch();
      } catch {
        toast.error('Failed delete this product...');
      }
    });
  };

  const handleDeleteAndClose = async (orderId) => {
    showDeleteConfirmation(async () => {
      try {
        await toast.promise(deletePurchaseProduct(orderId).unwrap(), {
          pending: 'Deleting order...',
          success: `Order "${orderId}" deleted!`,
          error: 'Failed to delete order.',
        });
        refetch();
      } catch {
        toast.error('Failed delete this product...');
      }
    });
  };

  const handleUpdate = async () => {
    if (!editCell.rowId || !editCell.field) return;

    try {
      await updatePurchaseProduct({
        orderId: editCell.rowId,
        data: { [editCell.field]: editValue },
      }).unwrap();

      setLoadingRowId(editCell.rowId);
      setEditCell({ rowId: null, field: null });

      setTimeout(() => {
        setLoadingRowId(null);
        refetch();
      }, 500);
    } catch {
      toast.error('Failed to update order.');
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value, page: 1 }));
  };

  const handleFilterChangeMobile = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value, page: 1 }));
  };

  const handleCellClick = (rowId, field, value, e) => {
    // Prevent copy if currently editing this cell
    if (editCell.rowId === rowId && editCell.field === field) {
      return;
    }

    // Optional: prevent if clicking directly on an input inside cell
    if (e.target.tagName === 'INPUT') {
      return;
    }

    clearTimeout(clickTimer.current);
    clickTimer.current = setTimeout(() => {
      navigator.clipboard.writeText(value);
      setCopiedCell({ rowId, field });

      setTimeout(() => {
        setCopiedCell({ rowId: null, field: null });
      }, 1500);
    }, 250);
  };

  const handleDoubleClick = (rowId, field, value) => {
    // Cancel the pending single click action
    if (clickTimer.current) {
      clearTimeout(clickTimer.current);
      clickTimer.current = null;
    }

    // Trigger edit mode
    setEditCell({ rowId, field });
    setEditValue(value);
  };

  const handleTrackingClick = (trackingCode, rowId, field) => {
    const fullLink = `${TRACKING_BASE_URL}${trackingCode}`;
    navigator.clipboard.writeText(fullLink);

    setCopiedCell({ rowId, field });

    setTimeout(() => setCopiedCell({ rowId: null, field: null }), 1500);
  };

  const handleConsignmentClick = (consignmentId, rowId, field) => {
    navigator.clipboard.writeText(consignmentId);
    setCopiedCell({ rowId, field });

    setTimeout(() => setCopiedCell({ rowId: null, field: null }), 1500);
  };

  const handleTrackingDoubleClick = (trackingCode) => {
    const fullLink = `${TRACKING_BASE_URL}${trackingCode}`;
    window.open(fullLink, '_blank');
  };

  const handleDuplicate = async (productId) => {
    const product = products.find((p) => p._id === productId);
    if (!product) return toast.error('Product not found.');

    const duplicatePayload = {
      recipient_name: product.recipient_name,
      recipient_phone: product.recipient_phone,
      recipient_address: product.recipient_address,
      via: product.via,
      price: product.product_price,
      items: [
        {
          productId: product.productId,
          product_color: product.product_color,
          product_size: Number(product.product_size),
          total_lot: 1,
        },
      ],
    };

    toast
      .promise(purchaseProduct(duplicatePayload).unwrap(), {
        pending: 'Creating duplicate...',
        success: 'Duplicate created successfully!',
        error: 'Failed to create duplicate. Check stock or details.',
      })
      .then(() => {
        refetch();
      });
  };

  const handlePlaceOrder = async (productId) => {
    const product = products.find((p) => p._id === productId);
    if (!product) return toast.error('Product not found.');

    const generatedInvoiceId = nanoid();
    const orderPayload = {
      invoice: generatedInvoiceId,
      recipient_name: product.recipient_name,
      recipient_phone: product.recipient_phone,
      alternative_phone: product.alternative_phone ?? product.alternative_phone,
      recipient_email: product.recipient_email || '',
      recipient_address: product.recipient_address,
      cod_amount: Number(product.product_price - product.delivery_charge),
      item_description: `${product.product_name || 'N/A'}, ${
        product.product_color || 'N/A'
      }, ${product.product_size || 'N/A'}`,
      total_lot: Number(product.total_lot) || 1,
      delivery_type: 0,
    };

    try {
      const response = await axios.post(
        'https://portal.packzy.com/api/v1/create_order',
        orderPayload,
        {
          headers: {
            'Api-Key': import.meta.env.VITE_API_KEY,
            'Secret-Key': import.meta.env.VITE_SECRET_KEY,
            'Content-Type': 'application/json',
          },
        }
      );

      const trackingId = response?.data?.consignment?.tracking_code;
      const consignmentId = response?.data?.consignment?.consignment_id;
      const status = response?.data?.consignment?.status;

      if (!trackingId)
        return toast.error('Order placed but no tracking ID received.');

      await updatePurchaseProduct({
        orderId: product._id,
        data: {
          tracking_code: trackingId,
          invoice: generatedInvoiceId,
          consignment_id: consignmentId,
          status: status,
        },
      }).unwrap();

      toast.success('Order placed successfully!');
      refetch();
    } catch (error) {
      toast.error(
        `Failed to place order: ${
          error.response?.data?.message || error.message || 'Unknown error'
        }`
      );
    }
  };

  const checkDeliveryStatus = async (
    productId,
    trackingId,
    showAlert = true
  ) => {
    if (!trackingId) return toast.warn('No tracking ID for product', productId);

    try {
      const response = await axios.get(
        `https://portal.packzy.com/api/v1/status_by_trackingcode/${trackingId}`,
        {
          headers: {
            'Api-Key': import.meta.env.VITE_API_KEY,
            'Secret-Key': import.meta.env.VITE_SECRET_KEY,
          },
        }
      );

      const deliveryStatus = response.data?.delivery_status;
      if (!deliveryStatus)
        return toast.warn('No delivery status found for', trackingId);

      await updatePurchaseProduct({
        orderId: productId,
        data: { status: deliveryStatus },
      }).unwrap();

      if (showAlert) toast.success(`Status updated: ${deliveryStatus}`);
      refetch();
    } catch (error) {
      return error;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-[#f7b84b] text-[#ffffff]';
      case 'delivered_approval_pending':
      case 'partial_delivered_approval_pending':
        return 'bg-[#299CDB] text-[#ffffff]';
      case 'cancelled_approval_pending':
      case 'cancelled':
        return 'bg-[#f06548] text-[#ffffff]';
      case 'unknown_approval_pending':
      case 'unknown':
        return 'bg-[#F3F6F9] text-[#000000]';
      case 'delivered':
        return 'bg-[#0ab39c] text-[#FFFFFF]';
      case 'partial_delivered':
        return 'bg-[#0ab39c] text-[#FFFFFF]';
      case 'hold':
        return 'bg-[#405189] text-[#FFFFFF]';
      case 'in_review':
        return 'bg-[#5a71bc] text-[#ffffff]';
      default:
        return 'bg-[#405189] text-[#000000]';
    }
  };

  // Fire pixel/event only after order is confirmed
  const sendPurchaseEvent = (product) => {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: 'purchase',
      ecommerce: {
        currency: 'BDT',
        value:
          Number(product.product_price || 0) +
          Number(product.shippingCost || 0),
        shipping: Number(product.shippingCost || 0),
        items: [
          {
            item_id: `${product.productId}-${product.product_color}`,
            item_name: product.product_name || 'N/A',
            item_brand: 'Soishu',
            item_category: product.category || 'N/A',
            price: Number(product.product_price || 0),
            quantity: Number(product.total_lot || 1),
            item_color: product.product_color || 'N/A',
            item_size: product.product_size || 'N/A',
          },
        ],
      },
      user_info: {
        name: product.recipient_name,
        phone: product.recipient_phone,
        address: product.address,
        shipping: Number(product.shippingCost || 0),
      },
    });
  };

  const handleStatusChange = (orderId, newStatus) => {
    const product = products.find((p) => p._id === orderId);

    if (newStatus === 'Confirmed') {
      // fire purchase event ONLY when confirmed
      sendPurchaseEvent(product);
      proceedStatusChange(orderId, newStatus);
    } else if (newStatus === 'Self') {
      showSelfStatusConfirmation(() =>
        proceedStatusChange(orderId, newStatus, 'delivered')
      );
    } else {
      proceedStatusChange(orderId, newStatus);
    }
  };

  const proceedStatusChange = async (orderId, newStatus, statusValue) => {
    try {
      setLoadingStatusId(orderId);

      const order = await dispatch(
        orderApi.endpoints.getPurchaseProductById.initiate(orderId)
      ).unwrap();

      const updateData = { official_status: newStatus, status: statusValue };

      if (
        ['Confirmed', 'Fake', 'Self', 'Queued', 'Packed'].includes(newStatus)
      ) {
        if (!order?.data?.userPhoto || !order?.data?.userName) {
          updateData.userPhoto = user.image;
          updateData.userName = user.name;
        }
      }

      await updatePurchaseProduct({ orderId, data: updateData }).unwrap();

      refetch();
    } catch {
      toast.error('Failed to update status.');
    } finally {
      setTimeout(() => {
        setLoadingStatusId(null);
        refetch();
      }, 500);
    }
  };

  const handleCheck = async (productId, currentValue) => {
    try {
      await updatePurchaseProduct({
        orderId: productId,
        data: { isCheck: !currentValue },
      }).unwrap();
      refetch();
      toast.success('Successfully marked star.');
    } catch {
      toast.error('Failed to mark star.');
    }
  };

  // Fetch unseen notifications for badge
  const { data: unseenData } = useGetUnseenNotificationsQuery(
    {},
    {
      pollingInterval: 10000,
    }
  );
  const unseenCount = unseenData?.data?.length || 0;

  // Fetch all notifications for dropdown
  const { data: allNotifications, isLoading: notificationLoading } =
    useGetAllNotificationsQuery(
      {},
      {
        pollingInterval: 10000,
      }
    );

  const [markSeen] = useMarkNotificationAsSeenMutation();

  const toggleNotifications = () => {
    setOpen((prev) => !prev);

    // If opening panel → mark unseen as seen
    if (!open && unseenData?.data) {
      unseenData.data.forEach((n) => markSeen(n.noteId));
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center mt-40">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  const phoneCounts = products.reduce((acc, product) => {
    const phone = product.recipient_phone;
    acc[phone] = (acc[phone] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="p-4 pb-0 md:p-6 md:pb-0 bg-[#fbfbfb] md:bg-none relative">
      {/* Mobile Search and Add Order Section */}
      <div className="block lg:hidden">
        <div className="flex items-center gap-3 justify-between mb-4">
          <input
            type="search"
            name="search"
            placeholder="Search"
            value={filters.search}
            onChange={handleFilterChange}
            className="flex-1 w-1/2 placeholder:text-gray-500 placeholder:text-sm md:px-4 md:py-2.5 px-3 py-1.5 bg-white border border-[#0ab39c] rounded outline-none"
          />

          <div
            onClick={() => setIsAddOrderOpen(true)}
            className="font-regular text-white bg-[#099885] border border-[#099885] flex items-center px-3 py-2 rounded cursor-pointer text-sm md:text-base"
          >
            <Grid2X2Plus className="mr-2 md:h-5 w-4 md:w-5 h-4" />
            Add Order
          </div>

          <div
            onClick={() => {
              setFilters('');
              setSizeValue('');
              setViaValue('');
              setOStatusValue('');
              setStatusValue('');
            }}
            className="font-regular border border-[#099885] text-slate-800 bg-slate-100 hover:bg-slate-200 flex items-center px-3 py-2 rounded cursor-pointer text-sm md:text-base"
          >
            Reset
          </div>
        </div>
        <div className="flex justify-between md:gap-3 gap-2 mb-4">
          <div className="bg-white md:px-3 px-2 py-2 md:py-2.5 rounded md:w-full border border-[#0ab39c]">
            <HeaderDropdown
              label={sizeValue ? sizeValue : 'Size'}
              options={summaryData?.data?.uniqueSizes || []}
              selectedValue={filters.product_size}
              onSelect={(val) => {
                setSizeValue(val);
                handleFilterChangeMobile({
                  target: { name: 'product_size', value: val },
                });
              }}
              isOpen={openDropdownMobile}
              setIsOpen={setOpenDropdownMobile}
              dropdownKey="size"
              dropdownRef={sizeDropdownRefMobile}
            />
          </div>
          <div className="bg-white md:px-3 px-2 py-2 md:py-2.5 rounded md:w-full border border-[#0ab39c]">
            <HeaderDropdown
              label={viaValue ? viaValue : 'Via'}
              options={['Whatsapp', 'Facebook', 'Website']}
              selectedValue={filters.via}
              onSelect={(val) => {
                setViaValue(val);
                handleFilterChangeMobile({
                  target: { name: 'via', value: val },
                });
              }}
              isOpen={openDropdownMobile}
              setIsOpen={setOpenDropdownMobile}
              dropdownKey="via"
              dropdownRef={viaDropdownRefMobile}
            />
          </div>
          <div className="bg-white md:px-3 px-2 py-2 md:py-2.5 rounded md:w-full border border-[#0ab39c]">
            <HeaderDropdown
              label={oStatusValue ? oStatusValue : 'O. Status'}
              options={['Queued', 'Confirmed', 'Packed', 'Fake', 'Self']}
              selectedValue={filters.official_status}
              onSelect={(val) => {
                setOStatusValue(val);
                handleFilterChangeMobile({
                  target: { name: 'official_status', value: val },
                });
              }}
              isOpen={openDropdownMobile}
              setIsOpen={setOpenDropdownMobile}
              dropdownKey="official_status"
              dropdownRef={oStatusDropdownRefMobile}
            />
          </div>
          <div className="bg-white md:px-3 px-2 py-2 md:py-2.5 rounded md:w-full border border-[#0ab39c]">
            <HeaderDropdown
              label={statusValue ? statusValue : 'Status'}
              options={[
                'in_review',
                'pending',
                'canceled',
                'delivered',
                'partial_delivered',
                'hold',
                'unknown',
              ]}
              selectedValue={filters.status}
              onSelect={(val) => {
                setStatusValue(val);
                handleFilterChangeMobile({
                  target: { name: 'status', value: val },
                });
              }}
              isOpen={openDropdownMobile}
              setIsOpen={setOpenDropdownMobile}
              dropdownKey="status"
              dropdownRef={statusDropdownRefMobile}
            />
          </div>
        </div>
      </div>
      <div className="border border-gray-200 rounded-lg lg:flex hidden min-h-[85vh] flex-col mb-8">
        {/* Filter Section */}
        <div className="p-4 bg-white rounded-t-lg">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mt-2 mb-4">
            <h1 className="text-2xl sm:text-3xl font-bold text-[#495057]">
              Orders Table
            </h1>
            {/* Bell Button */}
            <div ref={notificationRef} className="relative">
              <button
                onClick={toggleNotifications}
                className="relative text-[#878a99] bg-white rounded-full cursor-pointer p-2"
              >
                <Bell className="md:w-8 w-6 md:h-8 h-6" />
                {unseenCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">
                    {unseenCount}
                  </span>
                )}
              </button>

              {/* Notifications Dropdown */}
              {open && (
                <div className="absolute right-0 mt-2 w-96 bg-white shadow-lg rounded-lg border border-gray-200 z-50">
                  <div className="p-3 border-b border-gray-100 font-semibold">
                    Notifications
                  </div>

                  {notificationLoading ? (
                    <div className="p-4 text-gray-500 text-sm text-center">
                      Loading...
                    </div>
                  ) : (
                    <div className="max-h-96 overflow-y-auto">
                      {allNotifications?.data?.length > 0 ? (
                        allNotifications.data.map((n) => {
                          const timeAgo = formatDistanceToNow(
                            new Date(n.alertedAt),
                            {
                              addSuffix: true,
                            }
                          );

                          return (
                            <div
                              key={n.noteId}
                              onClick={async () => {
                                // Mark as seen
                                if (!n.isAlertSeen) {
                                  try {
                                    await markSeen(n.noteId);
                                  } catch (err) {
                                    console.error(
                                      'Error marking notification as seen:',
                                      err
                                    );
                                  }
                                }

                                // Filter orders
                                setFilters((prev) => ({
                                  ...prev,
                                  productId: n.orderId,
                                  page: 1,
                                }));

                                setOpen(false);
                              }}
                              className={`flex items-start gap-3 px-4 py-3 border-b border-gray-100 hover:bg-gray-50 hover:cursor-pointer transition ${
                                n.isAlertSeen ? 'bg-white' : 'bg-yellow-50'
                              }`}
                            >
                              {/* Bell Icon */}
                              <div className="mt-0.5">
                                <Bell className="w-5 h-5 text-blue-500" />
                              </div>

                              {/* Notification Text */}
                              <div className="flex-1">
                                <p
                                  className="text-sm text-gray-800 whitespace-pre-wrap"
                                  dangerouslySetInnerHTML={{
                                    __html: n.description,
                                  }}
                                />
                                <p className="text-xs text-gray-500">
                                  {timeAgo}
                                </p>
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <div className="p-4 text-gray-500 text-sm text-center">
                          No notifications
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-2 items-center justify-between relative">
            <div className="w-[calc(50%-10px)]">
              <input
                type="search"
                name="search"
                placeholder="Search anything..."
                value={filters.search}
                onChange={handleFilterChange}
                className="w-full placeholder:text-[#878a99] px-4 py-2 bg-[#fbfbfb] border border-gray-200 rounded-lg outline-none"
              />
            </div>
            <div className="flex items-center gap-2 w-1/2">
              <div
                className="px-4 py-2.5 bg-[#fbfbfb] text-[#878a99] border border-gray-200 rounded-lg cursor-pointer flex-1 text-sm"
                onClick={() => setIsDatePickerOpen((prev) => !prev)}
              >
                {`${format(dateRange[0].startDate, 'MMM dd, yyyy')} - ${format(
                  dateRange[0].endDate,
                  'MMM dd, yyyy'
                )}`}
              </div>

              {/* Date Picker */}
              {isDatePickerOpen && (
                <div
                  ref={datePickerRef}
                  className="absolute z-20 -right-4 top-[58px] border bg-white border-gray-200 rounded-lg overflow-hidden"
                >
                  <DateRangePicker
                    onChange={(item) => setDateRange([item.selection])}
                    showSelectionPreview={true}
                    moveRangeOnFirstSelection={false}
                    months={2}
                    ranges={dateRange}
                    direction="horizontal"
                  />
                  {/* Action Buttons */}
                  <div className="flex justify-end gap-2 p-2 py-4 border-t border-gray-200">
                    <button
                      onClick={handleApplyDateFilter}
                      className="px-4 py-1.5 bg-[#099885] text-white rounded-md hover:bg-[#00846e] transition cursor-pointer"
                    >
                      Apply
                    </button>
                    <button
                      onClick={() => setIsDatePickerOpen(false)}
                      className="px-4 py-1.5 border border-gray-300 rounded-md hover:bg-gray-100 transition cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
              <button
                onClick={() => setIsAddOrderOpen(true)}
                className="flex items-center gap-1 px-3 py-2.5 text-nowrap bg-[#099885] text-white rounded-lg text-sm font-semibold hover:bg-[#00846e] transition-colors cursor-pointer"
              >
                <Grid2X2Plus className="mr-2 h-5 w-5" />
                Add Order
              </button>
              <button
                onClick={() => {
                  setFilters(initialFilters);
                }}
                className="text-sm font-semibold text-slate-700 text-nowrap bg-slate-100 hover:bg-slate-200 border border-slate-300 flex items-center px-4 py-2 rounded-md cursor-pointer"
              >
                Reset
              </button>
            </div>
          </div>
        </div>

        {/* Main Section */}
        <div className="flex-1 overflow-auto">
          <table className="w-full text-sm text-left text-[#495057] border-t border-gray-300">
            <thead className="text-xs uppercase bg-[#fbfbfb] text-[#495057] sticky top-0 z-10">
              <tr className="border-b border-gray-300">
                <th className="px-3 py-5">SL#</th>
                <th className="px-3 py-5">
                  <HeaderDropdown
                    label="Ass."
                    options={userNames || []}
                    selectedValue={filters.userName}
                    onSelect={(val) =>
                      handleFilterChange({
                        target: { name: 'userName', value: val },
                      })
                    }
                    isOpen={openDropdown}
                    setIsOpen={setOpenDropdown}
                    dropdownKey="assigned"
                    dropdownRef={assignedDropdownRef}
                  />
                </th>
                <th className="px-3 py-5">Phone</th>
                <th className="px-3 py-5">Name</th>
                <th className="px-3 py-5 w-60">Address</th>
                <th className="px-3 py-5">
                  <HeaderDropdown
                    label="Product"
                    options={summaryData?.data?.uniqueNames || []}
                    selectedValue={filters.product_name}
                    onSelect={(val) =>
                      handleFilterChange({
                        target: { name: 'product_name', value: val },
                      })
                    }
                    isOpen={openDropdown}
                    setIsOpen={setOpenDropdown}
                    dropdownKey="product"
                    dropdownRef={productDropdownRef}
                  />
                </th>
                <th className="px-3 py-5">
                  <HeaderDropdown
                    label="Color"
                    options={summaryData?.data?.uniqueColors || []}
                    selectedValue={filters.product_color}
                    onSelect={(val) =>
                      handleFilterChange({
                        target: { name: 'product_color', value: val },
                      })
                    }
                    isOpen={openDropdown}
                    setIsOpen={setOpenDropdown}
                    dropdownKey="color"
                    dropdownRef={colorDropdownRef}
                  />
                </th>
                <th className="px-3 py-5">
                  <HeaderDropdown
                    label="Size"
                    options={summaryData?.data?.uniqueSizes || []}
                    selectedValue={filters.product_size}
                    onSelect={(val) =>
                      handleFilterChange({
                        target: { name: 'product_size', value: val },
                      })
                    }
                    isOpen={openDropdown}
                    setIsOpen={setOpenDropdown}
                    dropdownKey="size"
                    dropdownRef={sizeDropdownRef}
                  />
                </th>
                <th className="px-3 py-5">Qty</th>
                <th className="px-3 py-5">DC</th>
                <th className="px-3 py-5">Price</th>
                <th className="px-3 py-5">
                  <HeaderDropdown
                    label="Via"
                    options={['Whatsapp', 'Facebook', 'Website']}
                    selectedValue={filters.via}
                    onSelect={(val) =>
                      handleFilterChange({
                        target: { name: 'via', value: val },
                      })
                    }
                    isOpen={openDropdown}
                    setIsOpen={setOpenDropdown}
                    dropdownKey="via"
                    dropdownRef={viaDropdownRef}
                  />
                </th>
                <th className="px-3 py-5">
                  <HeaderDropdown
                    label="O. Status"
                    options={['Queued', 'Confirmed', 'Packed', 'Fake', 'Self']}
                    selectedValue={filters.official_status}
                    onSelect={(val) =>
                      handleFilterChange({
                        target: { name: 'official_status', value: val },
                      })
                    }
                    isOpen={openDropdown}
                    setIsOpen={setOpenDropdown}
                    dropdownKey="official_status"
                    dropdownRef={oStatusDropdownRef}
                  />
                </th>
                <th className="px-1.5 py-5">Star</th>
                <th className="px-1.5 py-5">Fraud</th>
                <th className="px-3 py-5">Note</th>
                <th className="px-3 py-5">CN ID</th>
                <th className="px-3 py-5">Tracking</th>
                <th className="px-3 py-5">
                  <HeaderDropdown
                    label="Status"
                    options={[
                      'in_review',
                      'pending',
                      'cancelled',
                      'delivered',
                      'partial_delivered',
                      'hold',
                      'unknown',
                    ]}
                    selectedValue={filters.status}
                    onSelect={(val) =>
                      handleFilterChange({
                        target: { name: 'status', value: val },
                      })
                    }
                    isOpen={openDropdown}
                    setIsOpen={setOpenDropdown}
                    dropdownKey="status"
                    dropdownRef={statusDropdownRef}
                  />
                </th>
                <th className="px-2 py-5">D&T</th>
                <th className="px-2 py-5">Action</th>
              </tr>
            </thead>
            <tbody className="text-[#495057]">
              {products.map((product, index) => {
                const { datePart, timePart } = formatDate(product.createdAt);
                return (
                  <tr
                    key={product._id}
                    className={`border-b border-gray-300 ${
                      index % 2 === 0 ? 'bg-white' : 'bg-[#fbfbfb]'
                    }`}
                  >
                    {/* <td className="pl-4 pr-1 py-3">
                      <input
                        className="h-4 w-4 cursor-pointer appearance-none border border-gray-300 rounded bg-white checked:bg-[#099885] checked:border-[#099885] checked:before:content-['✔'] checked:before:text-white checked:text-xs checked:before:flex checked:before:items-center checked:before:justify-center"
                        type="checkbox"
                        checked={selectedProducts.includes(product._id)}
                        onChange={() => handleSelect(product._id)}
                      />
                    </td> */}

                    <td className="px-3 py-3 text-center">
                      {(getDisplayTotal() ?? 0) -
                        (filters.page - 1) * filters.limit -
                        index}
                    </td>

                    {/* Assigned user */}
                    <td
                      title={product.userName}
                      className="px-3 py-3 text-center"
                    >
                      {product.userPhoto && (
                        <img
                          src={product.userPhoto}
                          alt="Assigned User"
                          className="size-6 rounded-full cursor-pointer"
                        />
                      )}
                    </td>

                    <td
                      key="recipient_phone"
                      className={`px-4 py-3 w-fit cursor-pointer ${
                        phoneCounts[product.recipient_phone] > 1
                          ? 'text-[#f06548]'
                          : ''
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {/* Recipient Phone */}
                        {editCell.rowId === product._id &&
                        editCell.field === 'recipient_phone' ? (
                          <input
                            ref={editCellWrapperRef}
                            type="text"
                            className="border border-gray-200 px-1 py-0.5 rounded outline-none w-28"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleUpdate();
                              if (e.key === 'Escape')
                                setEditCell({ rowId: null, field: null });
                            }}
                            onClick={(e) => e.stopPropagation()}
                            autoFocus
                          />
                        ) : (
                          <span
                            className={`cursor-pointer ${
                              copiedCell.rowId === product._id &&
                              copiedCell.field === 'recipient_phone'
                                ? 'text-[#0ab39c]'
                                : ''
                            }`}
                            onClick={(e) =>
                              handleCellClick(
                                product._id,
                                'recipient_phone',
                                product.recipient_phone,
                                e
                              )
                            }
                            onDoubleClick={() =>
                              handleDoubleClick(
                                product._id,
                                'recipient_phone',
                                product.recipient_phone
                              )
                            }
                          >
                            {product.recipient_phone}
                          </span>
                        )}

                        {/* Plus icon always beside recipient */}
                        {!(
                          editCell.rowId === product._id &&
                          editCell.field === 'alternative_phone'
                        ) && (
                          <button
                            className="text-[#0ab39c] hover:text-[#09977a]"
                            onClick={() => {
                              setEditCell({
                                rowId: product._id,
                                field: 'alternative_phone',
                              });
                              setEditValue(product.alternative_phone || '');
                            }}
                          >
                            <PlusIcon size={16} />
                          </button>
                        )}
                      </div>

                      {/* Alternative Phone below recipient */}
                      <div className="mt-1">
                        {editCell.rowId === product._id &&
                        editCell.field === 'alternative_phone' ? (
                          <input
                            ref={editCellWrapperRef}
                            type="text"
                            className="border border-gray-200 px-1 py-0.5 rounded outline-none w-28"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleUpdate();
                              if (e.key === 'Escape')
                                setEditCell({ rowId: null, field: null });
                            }}
                            autoFocus
                          />
                        ) : product.alternative_phone ? (
                          <span
                            className={`block text-sm cursor-pointer ${
                              copiedCell.rowId === product._id &&
                              copiedCell.field === 'alternative_phone'
                                ? 'text-[#0ab39c]'
                                : 'text-gray-600'
                            }`}
                            onClick={(e) =>
                              handleCellClick(
                                product._id,
                                'alternative_phone',
                                product.alternative_phone,
                                e
                              )
                            }
                            onDoubleClick={() =>
                              handleDoubleClick(
                                product._id,
                                'alternative_phone',
                                product.alternative_phone
                              )
                            }
                          >
                            {product.alternative_phone}
                          </span>
                        ) : null}
                      </div>
                    </td>

                    {[
                      {
                        field: 'recipient_name',
                        value: product.recipient_name,
                      },
                      {
                        field: 'recipient_address',
                        value: product.recipient_address,
                      },
                      {
                        field: 'product_name',
                        value: product.product_name,
                      },
                      {
                        field: 'product_color',
                        value: product.product_color,
                      },
                      {
                        field: 'product_size',
                        value: product.product_size,
                      },
                      {
                        field: 'total_lot',
                        value: product.total_lot,
                      },
                      {
                        field: 'delivery_charge',
                        value: product.delivery_charge,
                      },
                      {
                        field: 'product_price',
                        value: product.product_price - product.delivery_charge,
                      },
                    ].map(({ field, value }) => (
                      <td
                        key={field}
                        className={`px-4 py-3 w-fit cursor-pointer ${
                          field === 'delivery_charge' &&
                          product.delivery_charge > 0
                            ? 'bg-[#FEF4E4] text-[#212529]'
                            : copiedCell.rowId === product._id &&
                              copiedCell.field === field
                            ? 'text-[#0ab39c]'
                            : ''
                        }`}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            handleUpdate();
                          } else if (e.key === 'Escape') {
                            setEditCell({ rowId: null, field: null });
                          }
                        }}
                        onClick={(e) =>
                          handleCellClick(product._id, field, value, e)
                        }
                        onDoubleClick={() =>
                          handleDoubleClick(product._id, field, value)
                        }
                      >
                        {editCell.rowId === product._id &&
                        editCell.field === field ? (
                          <div ref={editCellWrapperRef} className="w-fit">
                            <input
                              type="text"
                              className="border border-gray-200 px-2 py-2 rounded outline-none w-fit"
                              value={editValue}
                              onChange={(e) => setEditValue(e.target.value)}
                              autoFocus
                            />
                          </div>
                        ) : (
                          value
                        )}
                      </td>
                    ))}

                    <td className="px-3 py-3">
                      <p className="flex items-center gap-1">
                        <span>
                          {product.via === 'WhatsApp' ? (
                            <FaWhatsapp />
                          ) : product.via === 'Facebook' ? (
                            <LiaFacebook size={16} />
                          ) : null}
                        </span>
                        <span>{product.via}</span>
                      </p>
                    </td>

                    {/* Official Status + Update Button */}
                    <td className="px-3 py-3">
                      <div className="flex items-center justify-center">
                        {editCell.rowId === product._id ? (
                          <button
                            ref={editCellUpdateBtnRef}
                            onClick={handleUpdate}
                            data-action="update"
                            className="cursor-pointer text-[#0ab39c] bg-green-100 border border-[#0ab39c] px-3 py-1.5 w-28 rounded-md text-center flex items-center justify-center text-sm"
                          >
                            Update
                          </button>
                        ) : loadingStatusId === product._id ? (
                          <Loader2 className="w-4 h-4 animate-spin text-green-600" />
                        ) : (
                          <StatusDropdown
                            selectedStatus={product.official_status}
                            onChange={handleStatusChange}
                            disabled={loadingStatusId === product._id}
                            isOpen={openDropdown}
                            setIsOpen={setOpenDropdown}
                            dropdownKey={`status-${product._id}`}
                            productId={product._id}
                          />
                        )}
                      </div>
                    </td>

                    {/* Star */}
                    <td
                      onClick={() => handleCheck(product._id, product.isCheck)}
                      className="px-1.5 py-3 cursor-pointer"
                    >
                      {product.isCheck ? (
                        <Star
                          size={16}
                          fill="#FFC107"
                          color="#FFC107"
                          className="text-center w-full"
                        />
                      ) : (
                        <Star
                          size={16}
                          fill="none"
                          color="#A0A0A0"
                          className="text-center w-full"
                        />
                      )}
                    </td>

                    <td className="px-2 py-3">
                      {product.total_delivered} / {product.total_cancel}
                    </td>

                    {/* Note */}
                    <td>
                      <ProductNoteCell
                        productId={product._id}
                        notes={product.notes}
                        refetch={refetch}
                      />
                    </td>

                    {/* Consignment ID */}
                    <td
                      className={`relative group px-3 py-3 cursor-pointer ${
                        copiedCell.rowId === product._id &&
                        copiedCell.field === 'consignment'
                          ? 'text-[#0ab39c]'
                          : ''
                      }`}
                      onClick={() =>
                        handleConsignmentClick(
                          product.consignment_id,
                          product._id,
                          'consignment'
                        )
                      }
                    >
                      <span>
                        {product.consignment_id
                          ? product.consignment_id
                          : 'N/A'}
                      </span>

                      {product.consignment_id && (
                        <div>
                          <div className="absolute left-1/2 top-0 transform -translate-x-1/2 -translate-y-full bg-white border border-gray-300 shadow-lg rounded px-3 py-2 text-3xl font-semibold text-gray-900 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-300 z-20">
                            {product.consignment_id}
                            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-white border-r border-b border-gray-300 rotate-45"></div>
                          </div>
                        </div>
                      )}
                    </td>

                    {/* Tracking Code */}
                    <td
                      className={`px-3 py-3 cursor-pointer text-[#0ab39c] underline ${
                        copiedCell.rowId === product._id &&
                        copiedCell.field === 'tracking'
                          ? 'bg-green-100'
                          : ''
                      }`}
                      onClick={() =>
                        handleTrackingClick(
                          product.tracking_code,
                          product._id,
                          'tracking'
                        )
                      }
                      onDoubleClick={() =>
                        handleTrackingDoubleClick(product.tracking_code)
                      }
                    >
                      {product.tracking_code ? 'Tracking' : 'N/A'}
                    </td>

                    {/* Status and Add Parcel */}
                    <td className="px-3 py-3 mx-auto">
                      {loadingRowId === product._id ? (
                        <Loader2 className="w-4 h-4 animate-spin mx-auto text-[#0ab39c]" />
                      ) : product.status ? (
                        <div
                          className={`px-0.5 py-1.5 rounded text-center w-28 capitalize ${getStatusColor(
                            product.status
                          )}`}
                        >
                          {product.status.replace(/_/g, ' ')}
                        </div>
                      ) : (
                        <button
                          onClick={() => handlePlaceOrder(product._id)}
                          disabled={
                            product.official_status === 'Fake' ||
                            product.official_status === 'Queued'
                          }
                          className="cursor-pointer text-sm text-white disabled:text-gray-400 disabled:bg-gray-100 bg-[#065142] px-1 py-1.5 rounded w-28 text-center disabled:cursor-not-allowed"
                        >
                          Add Parcel
                        </button>
                      )}
                    </td>

                    <td className="pl-2 py-3 text-[10px] justify-center items-center">
                      <p className="flex flex-col text-right">
                        <span className="text-nowrap">{datePart}</span>
                        <span className="text-nowrap">{timePart}</span>
                      </p>
                    </td>

                    {/* Actions */}
                    <td className="px-2 py-3">
                      <div
                        ref={
                          actionMenuOpenTwo === product._id
                            ? actionMenuRefTwo
                            : null
                        }
                        className="px-4 py-3 relative"
                      >
                        <button
                          onClick={() =>
                            setActionMenuOpenTwo((prev) =>
                              prev === product._id ? null : product._id
                            )
                          }
                          className="text-gray-600 bg-gray-100 px-1 py-1 rounded-full cursor-pointer"
                        >
                          <MoreVertical size={18} />
                        </button>

                        {actionMenuOpenTwo === product._id && (
                          <div className="absolute z-50 mt-2 right-0 bg-white border border-gray-200 rounded shadow-md w-32">
                            <button
                              onClick={async () => {
                                const rowText = [
                                  `Phone: ${product.recipient_phone}`,
                                  `Name: ${product.recipient_name}`,
                                  `Address: ${product.recipient_address}`,
                                  `Product: ${product.product_name}`,
                                  `Color: ${product.product_color}`,
                                  `Size: ${product.product_size}`,
                                  `Qty: ${product.total_lot}`,
                                  `Delivery Charge: ${product.delivery_charge}`,
                                  `Price: ${product.product_price}`,
                                  `Consignment ID: ${
                                    product.consignment_id || 'N/A'
                                  }`,
                                  `Tracking Code: ${
                                    product.tracking_code || 'N/A'
                                  }`,
                                  `Status: ${product.status || 'N/A'}`,
                                ].join('\n');

                                await navigator.clipboard.writeText(rowText);
                                toast.success('Row copied to clipboard!');
                                setActionMenuOpenTwo(null);
                              }}
                              className="block w-full text-left px-4 py-2 hover:bg-gray-100 cursor-pointer"
                            >
                              Copy Row
                            </button>

                            <button
                              onClick={async () => {
                                const description = [
                                  `${product.product_name}`,
                                  `Color: ${product.product_color}`,
                                  `Size: ${product.product_size}`,
                                  `Qty: ${product.total_lot}`,
                                ].join('; ');

                                await navigator.clipboard.writeText(
                                  description
                                );
                                toast.success(
                                  'Description copied to clipboard!'
                                );
                                setActionMenuOpenTwo(null);
                              }}
                              className="block w-full text-left px-4 py-2 hover:bg-gray-100 cursor-pointer"
                            >
                              Copy Des
                            </button>
                            <button
                              onClick={() => handleDuplicate(product._id)}
                              className="block w-full text-left px-4 py-2 hover:bg-gray-100 cursor-pointer"
                            >
                              Duplicate
                            </button>

                            {role === 'Admin' && (
                              <button
                                onClick={async () => {
                                  await handleDeleteAndClose(product._id);
                                  setActionMenuOpenTwo(null);
                                }}
                                className="block w-full text-left px-4 py-2 hover:bg-red-100 text-red-600 cursor-pointer"
                              >
                                Delete
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="md:flex hidden items-center justify-between bg-white border-t border-gray-200 p-4">
          <div className="flex items-center gap-6">
            <PaginationDropdown
              options={[50, 100, 150, 200, 500]}
              selectedValue={filters.limit}
              onSelect={(val) =>
                setFilters((prev) => ({
                  ...prev,
                  limit: Number(val),
                  page: 1,
                }))
              }
              isOpen={openDropdown}
              setIsOpen={setOpenDropdown}
              dropdownKey="pagination"
              dropdownRef={paginationDropdownRef}
            />

            {/* <p className="text-sm text-gray-600">
              {selectedProducts.length} item(s) selected
            </p> */}
          </div>

          <div className="flex items-center gap-6 text-gray-600 text-sm">
            <div>
              Page {filters.page} of {data?.pages || 1}
            </div>
            <div className="inline-flex -space-x-px">
              <button
                onClick={() =>
                  setFilters((prev) => ({
                    ...prev,
                    page: Math.max(prev.page - 1, 1),
                  }))
                }
                disabled={filters.page === 1}
                className="px-3 py-2 ml-0 cursor-pointer leading-tight text-[#212529] bg-white border border-gray-200 font-semibold rounded-l-md hover:bg-gray-200 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={() =>
                  setFilters((prev) => ({
                    ...prev,
                    page: prev.page + 1,
                  }))
                }
                disabled={filters.page >= (data?.pages || 1)}
                className="px-3 py-2 cursor-pointer leading-tight text-[#212529] bg-white border border-gray-200 font-semibold rounded-r-md hover:bg-gray-200 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile view UI */}
      {products.map((product) => {
        const { datePart, timePart } = formatDate(product.createdAt);

        const productColorFirstLetter =
          product.product_color?.charAt(0).toUpperCase() || '';

        const isConsignmentCopied =
          copiedCell.rowId === product._id &&
          copiedCell.field === 'consignment';

        const isPlacingOrder = loadingRowId === product._id;

        return (
          <div
            key={product._id}
            className="bg-white py-3 px-4 rounded-lg text-sm mt-3 shadow lg:hidden"
          >
            <div className="flex justify-between items-start gap-4">
              {/* Left Div: Consignment, Name, Phone */}
              <div className="text-left w-1/2 space-y-1">
                <div className="flex gap-2 justify-between">
                  <p className="font-semibold text-slate-800">
                    CN#{' '}
                    <span
                      className="cursor-pointer font-bold text-black"
                      onClick={() =>
                        handleConsignmentClick(
                          product.consignment_id,
                          product._id,
                          'consignment'
                        )
                      }
                    >
                      {isConsignmentCopied ? (
                        <span className="text-[#0ab39c] font-normal">
                          Copied!
                        </span>
                      ) : (
                        product.consignment_id || 'N/A'
                      )}
                    </span>
                  </p>
                  <ProductNoteCell
                    productId={product._id}
                    notes={product.notes}
                    refetch={refetch}
                  />
                </div>
                <p className="text-gray-600">{product.recipient_name}</p>
                <p className="text-gray-500 text-xs">
                  <a href={`tel:${product.recipient_phone}`}>
                    {product.recipient_phone}
                  </a>
                </p>
              </div>

              {/* Right Div: Price, Status, and Action Menu */}
              <div className="text-right w-1/2 space-y-1">
                <div className="flex items-center justify-end gap-1.5">
                  {/* --- Status Display Logic --- */}
                  {isPlacingOrder ? (
                    <span className="text-xs text-gray-700 font-semibold animate-pulse">
                      <Loader2 className="animate-spin" />
                    </span>
                  ) : product.status ? (
                    <div
                      className={`px-2 py-0.5 text-xs rounded capitalize w-20 font-medium text-center ${getStatusColor(
                        product.status
                      )}`}
                    >
                      {product.status.replace(/_/g, ' ')}
                    </div>
                  ) : (
                    <div
                      className={`px-2 py-0.5 text-xs rounded font-medium w-20 text-center ${
                        product.official_status === 'Queued'
                          ? 'bg-[#E1EBFD] text-[#3577F1] border-[#3577F1CC]'
                          : product.official_status === 'Confirmed'
                          ? 'bg-[#DAF4F0] text-[#0AB39C] border-[#0AB39CCC]'
                          : product.official_status === 'Packed'
                          ? 'bg-[#FEF4E4] text-[#F7B84B] border-[#F7B84BCC]'
                          : product.official_status === 'Fake'
                          ? 'bg-[#FDE8E4] text-[#F06548] border-[#F06548CC]'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {product.official_status}
                    </div>
                  )}

                  {/* --- Action Menu (3 dots) --- */}
                  <div
                    ref={actionMenuOpen === product._id ? actionMenuRef : null}
                    className="relative"
                  >
                    <button
                      onClick={() =>
                        setActionMenuOpen((prev) =>
                          prev === product._id ? null : product._id
                        )
                      }
                      className="text-gray-500 hover:bg-gray-200 p-1 pr-0 rounded-full"
                    >
                      <MoreVertical size={16} />
                    </button>

                    {/* --- Dropdown Menu --- */}
                    {actionMenuOpen === product._id && (
                      <div className="absolute z-20 mt-2 right-0 bg-white border border-gray-200 rounded-md shadow-lg w-40">
                        <div className="py-1 px-3">
                          <div className="py-2">
                            {/* Official Status Changer */}
                            <label className="block text-left text-xs text-gray-500 mb-1">
                              Official Status
                            </label>
                            <select
                              value={product.official_status}
                              onChange={(e) => {
                                handleStatusChange(product._id, e.target.value);
                                setActionMenuOpen(null);
                              }}
                              className={`w-full text-sm cursor-pointer rounded px-2 h-8 border focus:outline-none ${
                                product.official_status === 'Queued'
                                  ? 'bg-[#E1EBFD] text-[#3577F1] border-[#3577F1CC]'
                                  : product.official_status === 'Confirmed'
                                  ? 'bg-[#DAF4F0] text-[#0AB39C] border-[#0AB39CCC]'
                                  : product.official_status === 'Packed'
                                  ? 'bg-[#FEF4E4] text-[#F7B84B] border-[#F7B84BCC]'
                                  : product.official_status === 'Fake'
                                  ? 'bg-[#FDE8E4] text-[#F06548] border-[#F06548CC]'
                                  : 'bg-gray-100 text-gray-800'
                              }`}
                            >
                              {['Queued', 'Confirmed', 'Packed', 'Fake'].map(
                                (status) => (
                                  <option key={status} value={status}>
                                    {status}
                                  </option>
                                )
                              )}
                            </select>
                          </div>

                          <div className="border-t border-gray-100"></div>

                          {/* Add Parcel Button (conditional) */}
                          {!product.status && (
                            <button
                              onClick={() => {
                                handlePlaceOrder(product._id);
                                setActionMenuOpen(null);
                              }}
                              disabled={
                                product.official_status === 'Fake' ||
                                isPlacingOrder
                              }
                              className="block w-full text-center mb-2 px-2 py-1.5 cursor-pointer text-sm text-white bg-green-800 rounded disabled:opacity-50"
                            >
                              Add Parcel
                            </button>
                          )}

                          {/* Delete Button (conditional) */}
                          {role === 'Admin' && (
                            <button
                              onClick={() => {
                                handleDelete(product._id);
                                setActionMenuOpen(null);
                              }}
                              className="block w-full text-center mb-2 px-2 py-1.5 text-sm hover:bg-red-50 bg-red-100 rounded text-red-600"
                            >
                              Delete
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <p className="font-bold text-gray-900">
                  COD: {product.product_price - product.delivery_charge}
                </p>
                <p className="text-xs text-gray-500">
                  {`${product.product_name}, ${productColorFirstLetter}-${product.product_size}, ${product.total_lot} `}
                </p>
              </div>
            </div>

            {/* Bottom section: Address and Date Time */}
            <div className="mt-1 border-gray-100">
              <p className="text-gray-700  w-[80%]">
                {product.recipient_address}
              </p>
              <div className="text-[10px] text-gray-400 flex justify-end gap-1.5">
                <span>{datePart}</span>
                <span>{timePart}</span>
              </div>
            </div>
          </div>
        );
      })}

      {/* Add Order Page Slide-in */}
      <div
        className={`fixed top-0 left-0 lg:left-20 h-full w-full z-20 md:p-6 transition-transform duration-300 overflow-y-auto ${
          isAddOrderOpen ? 'translate-y-0' : '-translate-y-full'
        }`}
      >
        <AddOrderForm onClose={() => setIsAddOrderOpen(false)} />
      </div>
    </div>
  );
};

export default OrderTable;

// Helper function to remove HTML tags
const stripHtml = (htmlString) => {
  const doc = new DOMParser().parseFromString(htmlString, 'text/html');
  return doc.body.textContent || '';
};

const parseAlertedTime = (text) => {
  const fullDateTimeRegex =
    /@\s*([A-Za-z]{3}\s+\d{1,2},\s*\d{1,2}:\d{2}\s*(AM|PM))/i;
  const timeOnlyRegex = /@\s*(\d{1,2}(:\d{2})?\s*(AM|PM))/i;

  let description = text;
  let alertedAt = null;
  let match = text.match(fullDateTimeRegex);

  if (match) {
    // Case: full date and time (e.g. @Sep 2, 8:30 AM)
    const matchedString = match[1];
    const now = new Date();
    // Add the current year if not present
    const withYear = `${matchedString} ${now.getFullYear()}`;

    alertedAt = new Date(withYear);

    description = text.replace(
      match[0],
      `<span class="text-[#099885] font-semibold">${match[0]}</span>`
    );
  } else {
    // Try time-only match (e.g. @10:55am)
    match = text.match(timeOnlyRegex);

    if (match) {
      const timeString = match[1];
      const now = new Date();

      let [hours, minutes = '00'] = timeString.split(/[:\s]/).filter(Boolean);
      hours = parseInt(hours, 10);
      minutes = parseInt(minutes, 10);

      const period = timeString.toLowerCase().includes('pm') ? 'pm' : 'am';

      if (period === 'pm' && hours < 12) hours += 12;
      if (period === 'am' && hours === 12) hours = 0;

      alertedAt = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        hours,
        minutes,
        0
      );

      description = text.replace(
        match[0],
        `<span class="text-[#099885] font-semibold">${match[0]}</span>`
      );
    }
  }

  return { description, alertedAt };
};

const ProductNoteCell = ({ productId, notes = [], refetch }) => {
  const [showNoteBox, setShowNoteBox] = useState(false);
  const [editableNote, setEditableNote] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const noteBoxRef = useRef(null);
  const { user } = useUserRole();
  const [updatePurchaseProduct] = useUpdatePurchaseProductByIdMutation();

  const handleAddNote = () => {
    setEditableNote({
      description: '',
      orderId: productId,
    });
    setIsEditing(true);
    setShowNoteBox(true);
  };

  const handleEditNote = (note) => {
    setEditableNote({
      ...note,
      description: stripHtml(note.description),
    });
    setIsEditing(true);
    setShowNoteBox(true);
  };

  const handleDeleteNote = async (noteId) => {
    try {
      await updatePurchaseProduct({
        orderId: productId,
        data: {
          $pull: {
            notes: {
              _id: noteId,
            },
          },
        },
      }).unwrap();
      refetch();
      toast.success('Note deleted.');
    } catch {
      toast.error('Failed to delete note.');
    }
  };

  const handleSaveNote = async () => {
    try {
      const { description, alertedAt } = parseAlertedTime(
        editableNote.description
      );
      const noteData = {
        description,
        alertedAt: alertedAt ? alertedAt.toISOString() : null,
        notedUserName: user.name,
        notedUserPhoto: user.image,
        isAlertSeen: false,
      };

      if (editableNote._id) {
        // Update an existing note
        await updatePurchaseProduct({
          orderId: productId,
          data: {
            notes: notes.map((note) =>
              note._id === editableNote._id
                ? {
                    ...note,
                    ...noteData,
                    createdAt: note.createdAt,
                  }
                : note
            ),
          },
        }).unwrap();
        toast.success('Note updated.');
      } else {
        // Add a new note using $push
        await updatePurchaseProduct({
          orderId: productId,
          data: {
            $push: {
              notes: noteData,
            },
          },
        }).unwrap();
        toast.success('Note added.');
      }

      refetch();
      setEditableNote(null);
      setIsEditing(false);
      setShowNoteBox(false);
    } catch (err) {
      console.error(err);
      toast.error('Failed to save note.');
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (noteBoxRef.current && !noteBoxRef.current.contains(event.target)) {
        setShowNoteBox(false);
        setIsEditing(false);
        setEditableNote(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <td className="md:px-3 md:py-3 relative">
      <button
        onClick={() => setShowNoteBox((prev) => !prev)}
        className="cursor-pointer"
      >
        {notes?.length > 0 ? (
          // Note Icon with notes
          <svg
            fill="#f7b84b"
            className="w-5 h-5 md:w-6 md:h-6"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M14 3C15.5977 3 16.9037 4.24892 16.9949 5.82373L17 6V10.3787C17 10.8502 16.8335 11.3045 16.5331 11.6631L16.4142 11.7929L11.7929 16.4142C11.4595 16.7476 11.0205 16.9511 10.5545 16.9923L10.3787 17H6C4.40232 17 3.09634 15.7511 3.00509 14.1763L3 14V6C3 4.40232 4.24892 3.09634 5.82373 3.00509L6 3H14ZM14 4H6C4.94564 4 4.08183 4.81588 4.00549 5.85074L4 6V14C4 15.0544 4.81588 15.9182 5.85074 15.9945L6 16H10V13C10 11.4023 11.2489 10.0963 12.8237 10.0051L13 10H16V6C16 4.94564 15.1841 4.08183 14.1493 4.00549L14 4ZM15.7825 11.0013L13 11C11.9456 11 11.0818 11.8159 11.0055 12.8507L11 13V15.781L11.0858 15.7071L15.7071 11.0858C15.7339 11.059 15.7591 11.0307 15.7825 11.0013Z"
              fill="#f7b84b"
            />
          </svg>
        ) : (
          // Note Icon without notes
          <svg
            fill="none"
            viewBox="0 0 20 20"
            className="w-5 h-5 md:w-6 md:h-6"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M10 5.5C10 7.98528 7.98528 10 5.5 10C3.01472 10 1 7.98528 1 5.5C1 3.01472 3.01472 1 5.5 1C7.98528 1 10 3.01472 10 5.5ZM6 3.5C6 3.22386 5.77614 3 5.5 3C5.22386 3 5 3.22386 5 3.5V5H3.5C3.22386 5 3 5.22386 3 5.5C3 5.77614 3.22386 6 3.5 6H5L5 7.5C5 7.77614 5.22386 8 5.5 8C5.77614 8 6 7.77614 6 7.5V6H7.5C7.77614 6 8 5.77614 8 5.5C8 5.22386 7.77614 5 7.5 5H6V3.5Z"
              fill="#495057"
            />
            <path
              d="M14 4H10.793C10.6944 3.65136 10.5622 3.31679 10.4003 3H14C15.5977 3 16.9037 4.24892 16.9949 5.82373L17 6V10.3787C17 10.8502 16.8335 11.3045 16.5331 11.6631L16.4142 11.7929L11.7929 16.4142C11.4595 16.7476 11.0205 16.9511 10.5545 16.9923L10.3787 17H6C4.40232 17 3.09634 15.7511 3.00509 14.1763L3 14V10.4003C3.31679 10.5622 3.65136 10.6944 4 10.793V14C4 15.0544 4.81588 15.9182 5.85074 15.9945L6 16H10V13C10 11.4023 11.2489 10.0963 12.8237 10.0051L13 10H16V6C16 4.94564 15.1841 4.08183 14.1493 4.00549L14 4ZM15.7825 11.0013L13 11C11.9456 11 11.0818 11.8159 11.0055 12.8507L11 13V15.781L11.0858 15.7071L15.7071 11.0858C15.7339 11.059 15.7591 11.0307 15.7825 11.0013Z"
              fill="#495057"
            />
          </svg>
        )}
      </button>

      {showNoteBox && (
        <div
          ref={noteBoxRef}
          className="absolute z-10 lg:top-11 top-8 left-1/2 -translate-x-1/2 w-72 md:w-96 bg-white shadow-lg border border-gray-300 rounded-md p-3"
        >
          {/* Arrow */}
          <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-white border-l border-t border-gray-300 rotate-45"></div>

          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-[#495057]">Notes</h3>
            <button
              onClick={handleAddNote}
              className="flex cursor-pointer items-center gap-1 px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-semibold hover:bg-slate-200"
            >
              <Plus size={14} /> Note
            </button>
          </div>

          {notes.length === 0 && !isEditing && (
            <p className="text-gray-400 italic">No notes available.</p>
          )}

          {isEditing && (
            <>
              <textarea
                value={editableNote.description}
                onChange={(e) =>
                  setEditableNote({
                    ...editableNote,
                    description: e.target.value,
                  })
                }
                autoFocus
                className="w-full outline-none rounded p-2 text-sm text-gray-700 border border-gray-300 resize-none"
                rows={4}
              />
              <div className="flex justify-end space-x-2 mt-2">
                <button
                  onClick={handleSaveNote}
                  className="px-4 cursor-pointer py-1.5 bg-[#099885] text-white rounded-md hover:bg-[#00846e]"
                >
                  Save
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setEditableNote(null);
                  }}
                  className="px-4 py-1.5 border border-gray-300 rounded-md bg-slate-100 cursor-pointer hover:bg-slate-200"
                >
                  Cancel
                </button>
              </div>
            </>
          )}

          {!isEditing && notes.length > 0 && (
            <div className="space-y-3">
              {notes.map((note) => (
                <div
                  key={note._id}
                  className="p-3 border border-gray-300 rounded-lg shadow-sm bg-slate-50"
                >
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2">
                      {note.notedUserPhoto && (
                        <img
                          src={note.notedUserPhoto}
                          className="size-6 rounded-full"
                          alt="User Photo"
                        />
                      )}
                      <span className="text-sm font-semibold">
                        {note.notedUserName}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => handleEditNote(note)}>
                        <Pencil className="w-4 h-4 cursor-pointer text-gray-500 hover:text-[#0ab39c]" />
                      </button>
                      <button onClick={() => handleDeleteNote(note._id)}>
                        <Trash2 className="w-4 h-4 cursor-pointer text-gray-500 hover:text-[#f06548]" />
                      </button>
                    </div>
                  </div>
                  <p
                    className="text-sm text-gray-700 whitespace-pre-wrap"
                    dangerouslySetInnerHTML={{
                      __html: note.description,
                    }}
                  />
                  <span className="text-xs text-gray-400">
                    {format(new Date(note.createdAt), 'MMM d, h:mm a')}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </td>
  );
};
