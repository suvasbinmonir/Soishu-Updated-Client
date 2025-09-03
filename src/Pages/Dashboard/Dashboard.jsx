import { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
} from 'recharts';
import {
  Plus,
  CheckCircle,
  Briefcase,
  Trash2,
  ShoppingCart,
  XCircle,
  ArrowUpRight,
  Loader2,
  Edit,
  Save,
  X,
  ChevronDown,
} from 'lucide-react';
import { useGetOrderSummaryQuery } from '../../api/ordersApi';
import { useGetProductSummaryForAnalyticsQuery } from '../../api/productsApi';
import { Link } from 'react-router-dom';
import { useGetAllUsersQuery } from '../../api/userApi';
import {
  useCreateNoteMutation,
  useDeleteNoteMutation,
  useGetNotesQuery,
  useUpdateNoteMutation,
} from '../../api/noteApi';
import { useUserRole } from '../../hooks/useRole';

// const processWeeklyAnalytics = (analytics) => {
//   const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
//   return analytics.map((item) => {
//     const date = new Date(item._id);
//     const dayName = days[date.getUTCDay()];
//     const dailyCounts = {
//       name: dayName,
//       in_review: 0,
//       delivered: 0,
//       pending: 0,
//       cancelled: 0,
//     };
//     item?.counts?.forEach((c) => {
//       if (c.status in dailyCounts) {
//         dailyCounts[c.status] = c.count;
//       }
//     });
//     return dailyCounts;
//   });
// };

const processWeeklyAnalytics = (analytics) => {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  return analytics.map((item) => {
    const date = new Date(item.date);
    const dayName = days[date.getUTCDay()];
    return {
      name: dayName,
      in_review: item.counts?.in_review ?? 0,
      delivered: item.counts?.delivered ?? 0,
      pending: item.counts?.pending ?? 0,
      cancelled: item.counts?.cancelled ?? 0,
    };
  });
};

const processMonthlyAnalytics = (analytics) => {
  return analytics.map((item) => ({
    name: `Week ${item.week}`,
    in_review: item.counts?.in_review ?? 0,
    delivered: item.counts?.delivered ?? 0,
    pending: item.counts?.pending ?? 0,
    cancelled: item.counts?.cancelled ?? 0,
  }));
};

const processAnnualAnalytics = (analytics) => {
  const months = [
    '',
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  return analytics.map((item) => ({
    name: months[item.month],
    in_review: item.counts?.in_review ?? 0,
    delivered: item.counts?.delivered ?? 0,
    pending: item.counts?.pending ?? 0,
    cancelled: item.counts?.cancelled ?? 0,
  }));
};

const STATUS_COLORS = {
  in_review: '#5a71bc',
  delivered: '#0ab39c',
  pending: '#f7b84b',
  cancelled: '#f06548',
};

const Card = ({ children, className = '' }) => (
  <div
    className={`p-3 md::p-6 rounded-lg md:rounded-xl lg:rounded-2xl ${className}`}
  >
    {children}
  </div>
);

const Header = () => (
  <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
    <div>
      <h1 className="text-2xl sm:text-3xl font-bold text-[#495057]">
        Dashboard
      </h1>
      <p className="text-sm text-[#878a99] mt-1">
        Order and product analytics overview.
      </p>
    </div>
  </header>
);

const StatCard = ({ title, value, change, icon, color }) => (
  <Card className="bg-white relative overflow-hidden">
    <div className="flex justify-between items-start">
      <div>
        <p className={`font-medium text-[#495057] text-sm md:text-base`}>
          {title}
        </p>
        <p
          className={`lg:text-7xl md:text-5xl text-4xl font-bold mt-2 text-[#495057]`}
        >
          {value}
        </p>
      </div>
      <div className={`md:p-2 p-1 rounded-lg ${color}`}>{icon}</div>
    </div>
    <Link to="/dashboard/orders">
      <div className="flex items-center gap-1 md:text-sm text-xs mt-4">
        <ArrowUpRight size={14} />
        <p className="text-[#878a99] hover:underline hover:text-[#495057]">
          {change}
        </p>
      </div>
    </Link>
    <div
      className={`absolute -right-4 -bottom-4 md:w-16 w-10 md:h-16 h-10
      rounded-full opacity-50 ${color}`}
    ></div>
  </Card>
);

const WeeklyAnalyticsChart = ({ weeklyData, monthlyData, annualData }) => {
  const [view, setView] = useState('weekly');
  const [isOpen, setIsOpen] = useState(false);

  const data =
    view === 'weekly'
      ? processWeeklyAnalytics(weeklyData)
      : view === 'monthly'
      ? processMonthlyAnalytics(monthlyData)
      : processAnnualAnalytics(annualData);

  const chartData = [
    { name: 'delivered', fill: STATUS_COLORS.delivered },
    { name: 'in_review', fill: STATUS_COLORS.in_review },
    { name: 'pending', fill: STATUS_COLORS.pending },
    { name: 'cancelled', fill: STATUS_COLORS.cancelled },
  ];

  return (
    <Card className="bg-white p-4">
      <div className="flex justify-between items-center mb-2 relative">
        <h2 className="text-lg font-semibold text-[#495057] capitalize">
          {view} Analytics
        </h2>

        <div className="relative">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="px-3 py-1.5 cursor-pointer flex items-center gap-2.5 bg-slate-100 rounded-md text-sm text-gray-700 hover:bg-slate-200 focus:outline-none"
          >
            {view.charAt(0).toUpperCase() + view.slice(1)}{' '}
            <ChevronDown size={16} className="mt-0.5" />
          </button>

          {isOpen && (
            <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded-lg shadow-md z-10">
              {['weekly', 'monthly', 'annual'].map((option) => (
                <div
                  key={option}
                  onClick={() => {
                    setView(option);
                    setIsOpen(false);
                  }}
                  className={`px-4 py-2 text-sm cursor-pointer hover:bg-gray-100 capitalize ${
                    view === option ? 'bg-gray-100 font-medium' : ''
                  }`}
                >
                  {option}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      {/* Chart */}
      <div className="md:h-72 h-40 mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 10, right: 20, left: 0, bottom: 10 }}
            barCategoryGap="20%"
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#d1d5dc"
              strokeWidth={0.5}
              vertical={false}
            />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#878a99', fontSize: 14 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#878a99', fontSize: 14 }}
            />
            <Tooltip
              cursor={{ fill: 'rgba(241, 245, 249, 0.5)' }}
              contentStyle={{
                background: 'white',
                borderRadius: '0.5rem',
                boxShadow:
                  '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.1)',
                fontSize: '12px',
              }}
            />
            <Bar
              dataKey="in_review"
              fill={STATUS_COLORS.in_review}
              name="In Review"
            />
            <Bar
              dataKey="delivered"
              fill={STATUS_COLORS.delivered}
              name="Delivered"
            />
            <Bar
              dataKey="pending"
              fill={STATUS_COLORS.pending}
              name="Pending"
            />
            <Bar
              dataKey="cancelled"
              fill={STATUS_COLORS.cancelled}
              name="Cancelled"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="flex justify-center flex-wrap gap-1.5 mt-2 md:gap-4 text-xs md:text-sm text-slate-500 w-full">
        {chartData.map((item) => (
          <div key={item.name} className="flex items-center gap-2 capitalize">
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: item.fill }}
            ></div>
            <span>{item.name === 'in_review' ? 'In Review' : item.name}</span>
          </div>
        ))}
      </div>
    </Card>
  );
};

const ProductList = () => {
  const { data: productsData, isLoading: productsLoading } =
    useGetProductSummaryForAnalyticsQuery();
  if (productsLoading) return <p>Loading...</p>;
  return (
    <Card className="h-full bg-white">
      <h2 className="text-lg font-semibold text-[#495057] border-b border-gray-200 pb-3 mt-1">
        Products
      </h2>

      <div>
        {productsData?.data?.products?.map((product) => (
          <div key={product._id} className="py-2.5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg overflow-hidden relative">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover object-left"
                  style={{ transform: 'translateY(-12%)' }}
                />
              </div>

              <div className="flex-1">
                <p className="font-bold text-[#495057] truncate">
                  {product.name}
                </p>
              </div>
              <div>
                <p
                  className={`${
                    product.totalStock === 0
                      ? 'text-[#f06548]'
                      : 'text-[#878a99]'
                  }`}
                >
                  Total Stock:{' '}
                  <span
                    className={`font-semibold ${
                      product.totalStock === 0
                        ? 'text-[#f06548]'
                        : 'text-[#495057]'
                    }`}
                  >
                    {product.totalStock}
                  </span>
                </p>
              </div>
            </div>

            {/* Loop through all variants */}
            {product?.variants?.map((variant, vIndex) => (
              <div
                key={vIndex}
                className="flex items-center first:border-t border-y border-dashed border-gray-200 py-2.5"
              >
                {/* Variant Color */}
                <h2 className="pr-6 text-[#495057] w-28">{variant.color}</h2>

                {/* Sizes & Stocks */}
                <div className="flex gap-6 w-full divide-x divide-gray-200 border-l border-gray-200">
                  <div className="flex w-[80%] justify-around divide-x divide-gray-200">
                    {variant.sizes.map((sizeItem, sIndex) => (
                      <div
                        key={sIndex}
                        className="text-sm flex flex-col w-full items-center"
                      >
                        <p className="text-[#878a99]">{sizeItem.size}</p>
                        <p
                          className={`${
                            sizeItem.stock === 0
                              ? 'text-[#f06548]'
                              : 'text-[#495057]'
                          }  font-semibold`}
                        >
                          {sizeItem.stock}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Variant Total Stock */}
                  <div
                    className={`flex items-end justify-end gap-2 ${
                      variant.totalStock === 0
                        ? 'text-[#f06548]'
                        : 'text-[#878a99]'
                    } text-sm flex-1`}
                  >
                    <p>Stock:</p>
                    <p
                      className={`font-semibold ${
                        variant.totalStock === 0
                          ? 'text-[#f06548]'
                          : 'text-[#495057]'
                      }`}
                    >
                      {variant.totalStock}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </Card>
  );
};

const TeamCollaboration = () => {
  const { data, isLoading } = useGetAllUsersQuery();
  const users = data?.data || [];

  const roleBadgeStyle = {
    Admin: 'text-emerald-500 bg-emerald-50',
    Moderator: 'text-amber-500 bg-amber-50',
    User: 'text-rose-500 bg-rose-50',
  };

  const getRoleTitle = (role) => {
    switch (role) {
      case 'Admin':
        return 'Administrator';
      case 'Moderator':
        return 'Community Moderator';
      default:
        return 'Team Member';
    }
  };

  return (
    <Card className="bg-white">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-[#495057]">Team List</h2>
        <Link to="/signup">
          <button className="flex items-center cursor-pointer gap-1 px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-semibold hover:bg-slate-200 transition-colors">
            <Plus size={14} /> Add Member
          </button>
        </Link>
      </div>

      {isLoading ? (
        <Loader2 className="animate-spin" />
      ) : (
        <div className="mt-4">
          {users.map((user, index) => (
            <div
              key={user._id || index}
              className="flex items-start gap-3 border-b border-dashed border-gray-200 py-2.5"
            >
              <img
                src={user.image || `https://i.pravatar.cc/150?img=${index + 1}`}
                alt={user.name}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div className="flex-1">
                <p className="font-semibold text-sm text-slate-700">
                  {user.name}
                </p>
                <p className="text-xs text-slate-500">
                  {getRoleTitle(user.role)}
                </p>
              </div>
              <span
                className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                  roleBadgeStyle[user.role] || 'text-slate-500 bg-slate-100'
                }`}
              >
                {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
              </span>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};

const noteColors = [
  'bg-[#daf4f0] border-[#9de1d7]',
  'bg-[#fef4e4] border-[#fce3b7]',
  'bg-[#dff0fa] border-[#a9d7f1]',
  'bg-[#fde8e4] border-[#f9c1b6]',
];

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

const Notes = () => {
  const { data: notes, isLoading } = useGetNotesQuery();
  const [createNote] = useCreateNoteMutation();
  const [deleteNote] = useDeleteNoteMutation();
  const [updateNote] = useUpdateNoteMutation();
  const { role } = useUserRole();

  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [noteContent, setNoteContent] = useState('');
  const [noteTitle, setNoteTitle] = useState('');

  const handleAddNote = async () => {
    if (noteContent.trim()) {
      await createNote({
        title: noteTitle.trim() || undefined,
        description: noteContent.trim(),
      });
      resetForm();
    }
  };

  const handleUpdateNote = async () => {
    if (editingId && noteContent.trim()) {
      await updateNote({
        id: editingId,
        data: {
          title: noteTitle.trim() || undefined,
          description: noteContent.trim(),
        },
      });
      resetForm();
    }
  };

  const handleEditNote = (note) => {
    setEditingId(note._id);
    setNoteTitle(note.title || '');
    setNoteContent(note.description);
    setIsAdding(true);
  };

  const handleDeleteNote = async (noteId) => {
    await deleteNote(noteId);
  };

  const resetForm = () => {
    setIsAdding(false);
    setEditingId(null);
    setNoteContent('');
    setNoteTitle('');
  };

  return (
    <Card className="h-fit bg-white">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-[#495057]">Notes</h3>
        {role === 'Admin' && (
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center cursor-pointer gap-1 px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-semibold hover:bg-slate-200 transition-colors"
          >
            <Plus size={14} /> Note
          </button>
        )}
      </div>

      {isAdding && (
        <div className="mb-4 p-4 border border-gray-200 rounded-lg">
          {/* <input
            type="text"
            placeholder="Note title (optional)"
            value={noteTitle}
            onChange={(e) => setNoteTitle(e.target.value)}
            className="w-full mb-2 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          /> */}
          <textarea
            placeholder="Note content..."
            value={noteContent}
            onChange={(e) => setNoteContent(e.target.value)}
            className="w-full mb-3 px-3 py-2 border border-gray-300 rounded focus:outline-none h-20 resize-none"
            autoFocus
          />
          <div className="flex space-x-2">
            <button
              onClick={editingId ? handleUpdateNote : handleAddNote}
              className="flex items-center space-x-1 px-3 py-1 text-sm bg-[#099885] text-white rounded hover:bg-[#00846e] transition-colors"
            >
              <Save size={14} />
              <span>{editingId ? 'Update' : 'Save'}</span>
            </button>
            <button
              onClick={resetForm}
              className="flex items-center space-x-1 px-3 py-1 text-sm bg-slate-100 text-slate-600 hover:bg-slate-200 rounded transition-colors"
            >
              <X size={14} />
              <span>Cancel</span>
            </button>
          </div>
        </div>
      )}

      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div className="space-y-3 overflow-y-auto">
          {notes?.map((note, index) => {
            const colorClass = noteColors[index % noteColors.length];
            const { datePart, timePart } = formatDate(note.createdAt);

            return (
              <div
                key={note._id}
                className={`p-4 pb-0 rounded-lg border ${colorClass} hover:shadow-sm transition-shadow`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex flex-col gap-1">
                    <span className="text-xs text-[#878a99] mb-1">
                      {timePart} {datePart}
                    </span>
                    {/* <h4 className="font-medium text-gray-900">{note.title}</h4> */}
                    <p className="text-sm text-[#495057] mb-2">
                      {note.description}
                    </p>
                  </div>
                  {role === 'Admin' && (
                    <div className="flex space-x-1">
                      <button
                        onClick={() => handleEditNote(note)}
                        className="p-1 text-[#878a99] hover:text-[#0ab39c] cursor-pointer transition-colors"
                      >
                        <Edit size={14} />
                      </button>
                      <button
                        onClick={() => handleDeleteNote(note._id)}
                        className="p-1 text-[#878a99] hover:text-[#f06548] cursor-pointer transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
};

const OrderAnalyticsChart = ({ data }) => {
  const {
    totalOrders,
    totalDelivered,
    totalPending,
    totalCanceled,
    totalInReview,
  } = data;

  const chartData = [
    { name: 'delivered', value: totalDelivered, fill: STATUS_COLORS.delivered },
    { name: 'in_review', value: totalInReview, fill: STATUS_COLORS.in_review },
    { name: 'pending', value: totalPending, fill: STATUS_COLORS.pending },
    { name: 'cancelled', value: totalCanceled, fill: STATUS_COLORS.cancelled },
  ];

  const [hoveredStatus, setHoveredStatus] = useState(null);

  const handleMouseEnter = (data) => {
    setHoveredStatus(data);
  };

  const handleMouseLeave = () => {
    setHoveredStatus(null);
  };

  const percentage = (value) =>
    totalOrders > 0 ? Math.round((value / totalOrders) * 100) : 0;

  const activeStatus = hoveredStatus || chartData[0];

  return (
    <Card className="relative flex flex-col items-center bg-white">
      <h2 className="text-lg font-semibold text-[#495057] self-start mb-2">
        Order Analytics
      </h2>

      <div className="h-64 w-full relative -mt-12">
        <ResponsiveContainer
          width="100%"
          height="100%"
          className="[&_.recharts-wrapper_rect:focus]:outline-none [&_.recharts-wrapper_rect:focus]:stroke-none"
        >
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="95%"
              startAngle={180}
              endAngle={0}
              innerRadius="90%"
              outerRadius="130%"
              dataKey="value"
              paddingAngle={2}
              cornerRadius={4}
              onMouseLeave={handleMouseLeave}
              onMouseEnter={handleMouseEnter}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} stroke="none" />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 text-center">
          <p
            className="md:text-5xl text-4xl font-bold capitalize"
            style={{ color: activeStatus.fill }}
          >
            {percentage(activeStatus.value)}%
          </p>
          <p className="md:text-2xl text-xl font-medium text-[#495057] capitalize">
            {activeStatus.name === 'in_review'
              ? 'In Review'
              : activeStatus.name}
          </p>
        </div>
      </div>

      <div className="flex justify-center flex-wrap mt-4 gap-1.5 md:gap-4 text-xs md:text-sm text-slate-500 w-full">
        {chartData.map((item) => (
          <div key={item.name} className="flex items-center gap-2 capitalize">
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: item.fill }}
            ></div>
            <span>{item.name === 'in_review' ? 'In Review' : item.name}</span>
          </div>
        ))}
      </div>
    </Card>
  );
};

const TrophyIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="40"
    height="40"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="text-yellow-500"
  >
    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
    <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
    <path d="M4 22h16" />
    <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
    <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
    <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
  </svg>
);

const BestSellingProduct = ({ products }) => {
  if (!products || products.length === 0) return null;

  const topSellingProduct = [...products].sort(
    (a, b) => b.totalPurchased - a.totalPurchased
  );

  const topSellingProductFirst = [...products].sort(
    (a, b) => b.totalPurchased - a.totalPurchased
  )[0];

  return (
    <Card className="bg-white p-4">
      <h2 className="text-lg font-semibold text-[#495057] mb-4">
        Best Selling Product
      </h2>

      {topSellingProductFirst ? (
        <div
          key={topSellingProductFirst._id}
          className="flex flex-col items-center space-x-4"
        >
          <div className="w-full md:h-64 sm:48 h-40 relative">
            <div className="flex justify-end">
              <div className="absolute -mt-6">
                <TrophyIcon />
              </div>
            </div>
            <img
              src={topSellingProductFirst.image}
              alt={topSellingProductFirst.name}
              className="w-full h-full object-cover"
              style={{ objectPosition: 'center center' }}
            />
          </div>

          <div className="mt-6 flex flex-col justify-center">
            <h3 className="text-3xl font-bold text-[#495057]">
              {topSellingProductFirst.name}
            </h3>
            <p className="text-lg text-[#099885] font-semibold text-center">
              Purchased: {topSellingProductFirst.totalPurchased}
            </p>
          </div>
        </div>
      ) : (
        <p>No sales yet.</p>
      )}

      <div className="mt-4">
        {topSellingProduct.slice(1, 5).map((product) => (
          <div
            key={product._id}
            className="flex items-center gap-4 first:border-t border-b border-dashed border-gray-200 py-2.5"
          >
            <div className="w-12 h-12 rounded-lg overflow-hidden relative">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover object-left"
                style={{ transform: 'translateY(-12%)' }}
              />
            </div>

            <div className="flex-1">
              <p className="font-semibold text-sm text-slate-700 truncate">
                {product.name}
              </p>
              <p className="text-xs text-slate-500">
                Stock: <span className="font-medium">{product.totalStock}</span>
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500">
                Purchased:{' '}
                <span className="font-medium">{product.totalPurchased}</span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default function Dashboard() {
  const { data: ordersData } = useGetOrderSummaryQuery();
  const { data: productsData } = useGetProductSummaryForAnalyticsQuery();
  const orderSummary = ordersData?.data;
  const productSummary = productsData?.data;

  if (!orderSummary || !productSummary) {
    return (
      <div className="bg-slate-50 min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-gray-500" />
      </div>
    );
  }

  const statsCards = [
    {
      title: 'Today Orders',
      value: ordersData?.data?.todaysTotalOrder ?? 0,
      change: 'Based on today’s flow',
      icon: <ShoppingCart className="text-[#f7b84b] md:size-6 size-4" />,
      color: 'bg-[#fef4e4]',
    },
    {
      title: 'Total Orders',
      value: ordersData?.data?.totalOrders ?? 0,
      change: 'Cumulative total',
      icon: <Briefcase className="text-[#5a71bc] md:size-6 size-4" />,
      color: 'bg-[#dff0fa]',
    },
    {
      title: 'Total Delivered',
      value: ordersData?.data?.totalDelivered ?? 0,
      change: 'Successful deliveries',
      icon: <CheckCircle className="text-[#0ab39c] md:size-6 size-4" />,
      color: 'bg-[#daf4f0]',
    },
    {
      title: 'Total Canceled',
      value: ordersData?.data?.totalCanceled ?? 0,
      change: 'Cancelled orders',
      icon: <XCircle className="text-[#f06548] md:size-6 size-4" />,
      color: 'bg-[#fde8e4]',
    },
  ];

  return (
    <div className="bg-white p-4 md:p-6 min-h-screen font-sans text-slate-700">
      <div className="mx-auto p-4 md:p-6 bg-[#f7f7f7] rounded-lg">
        <Header />
        <main className="mt-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-2 xl:grid-cols-4 md:gap-6 gap-3">
            {statsCards.map((stat, index) => (
              <StatCard key={index} {...stat} />
            ))}
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
            {/* Left Column (1/3) => 4/12 */}
            <div className="xl:col-span-5 md:col-span-6 flex flex-col gap-6">
              <div className="">
                <WeeklyAnalyticsChart
                  weeklyData={orderSummary.weeklyAnalytics}
                  monthlyData={orderSummary.monthlyAnalytics}
                  annualData={orderSummary.annualAnalytics}
                />
              </div>
              <div className="xl:hidden lg:block hidden">
                <Notes />
              </div>
              <div className="lg:block hidden">
                <ProductList products={productSummary.products} />
              </div>
              <div className="lg:hidden block">
                <OrderAnalyticsChart data={orderSummary} />
              </div>
            </div>

            {/* Middle Column (1/3) => 4/12 */}
            <div className="xl:col-span-4 md:col-span-6 flex flex-col gap-6">
              <div className="lg:block hidden">
                <OrderAnalyticsChart data={orderSummary} />
              </div>
              <div className="lg:hidden">
                <Notes />
              </div>
              <div className="">
                <BestSellingProduct products={productSummary.products} />
              </div>
              <div className="xl:hidden lg:block hidden">
                <TeamCollaboration />
              </div>
            </div>

            {/* Right Column (1/4) => 3/12 */}
            <div className="xl:col-span-3 md:col-span-6 flex flex-col gap-6">
              <div className="xl:block hidden">
                <Notes />
              </div>
              <div className="lg:hidden block">
                <ProductList products={productSummary.products} />
              </div>
              <div className="xl:block lg:hidden block">
                <TeamCollaboration />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
