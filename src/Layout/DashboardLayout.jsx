// import { useEffect, useState } from 'react';
// import {
//   Search,
//   Bell,
//   Menu,
//   Home,
//   Archive,
//   LogOut,
//   User,
//   BarChart2,
//   ShoppingCart,
//   List,
//   Users,
//   Loader2,
//   ChevronUp,
//   ChevronDown,
// } from 'lucide-react';
// import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
// import { useGetUserMeQuery, useLogoutMutation } from '../api/userApi';
// import axios from 'axios';
// import { toast } from 'react-toastify';

// const NavItem = ({ icon, text, isCollapsed, to, subMenu, onNavItemClick }) => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const [expand, setExpand] = useState(false);

//   const isActive =
//     location.pathname === to ||
//     (to !== '/dashboard' && location.pathname.startsWith(to));

//   const handleNavigate = () => {
//     if (subMenu) {
//       setExpand(!expand);
//     } else {
//       navigate(to);
//     }
//   };

//   return (
//     <>
//       <li
//         className={`flex items-center justify-between cursor-pointer p-2 text-gray-800 rounded-md group
//           ${
//             isActive
//               ? 'bg-[#f1aa2e] font-semibold text-white hover:bg-[#f1aa2e]'
//               : 'hover:bg-[#ffe9cc]'
//           }
//           ${isCollapsed ? 'justify-center' : ''}`}
//         onClick={() => {
//           if (window.innerWidth < 640) {
//             onNavItemClick();
//           }
//           handleNavigate();
//         }}
//         title={text}
//       >
//         <div className="flex items-center">
//           {icon}
//           {!isCollapsed && (
//             <span className="ml-3 flex-1 whitespace-nowrap text-left">
//               {text}
//             </span>
//           )}
//         </div>
//         {subMenu && !isCollapsed && (
//           <div className="ml-2">
//             {expand ? (
//               <ChevronUp className="w-4 h-4 text-[#9E6747]" />
//             ) : (
//               <ChevronDown className="w-4 h-4 text-[#9E6747]" />
//             )}
//           </div>
//         )}
//       </li>

//       {expand && subMenu && !isCollapsed && (
//         <ul className="ml-8 space-y-2">
//           {subMenu.map((sub) => (
//             <li
//               key={sub.name}
//               className={`flex items-center cursor-pointer p-2 text-gray-700 rounded-md hover:bg-[#fff4e0] group
//                   ${
//                     location.pathname === sub.slug
//                       ? 'bg-[#f1aa2e] font-semibold text-white'
//                       : ''
//                   }`}
//               onClick={() => navigate(sub.slug)}
//             >
//               {sub.icon}
//               <span className="ml-3">{sub.name}</span>
//             </li>
//           ))}
//         </ul>
//       )}
//     </>
//   );
// };

// const Sidebar = ({ sidebarState, userRole, onLogout, onNavItemClick }) => {
//   const isCollapsed = sidebarState === 'collapsed';
//   const isHidden = sidebarState === 'hidden';

//   const navLinks = [
//     {
//       text: 'Dashboard',
//       to: '/dashboard',
//       icon: <Home className="w-6 h-6" />,
//       roles: ['Admin', 'Moderator'],
//     },
//     {
//       text: 'Products',
//       to: '/dashboard/products',
//       icon: <Archive className="w-6 h-6" />,
//       roles: ['Admin', 'Moderator'],
//     },
//     {
//       text: 'Add Product',
//       to: '/dashboard/add-product',
//       icon: <BarChart2 className="w-6 h-6" />,
//       roles: ['Admin'],
//     },
//     {
//       text: 'Orders',
//       to: '/dashboard/orders',
//       icon: <ShoppingCart className="w-6 h-6" />,
//       roles: ['Admin', 'Moderator'],
//     },
//     {
//       text: 'Users',
//       to: '/dashboard/users',
//       icon: <Users className="w-6 h-6" />,
//       roles: ['Admin'],
//     },
//   ];

//   return (
//     <aside
//       className={`fixed top-0 left-0 z-40 h-screen bg-[#fffaf3] text-gray-800  -all  -300
//         ${isHidden ? '-translate-x-full' : 'translate-x-0'}
//         ${isCollapsed ? 'md:w-20 w-0' : 'w-64'} sm:translate-x-0`}
//     >
//       <div className="h-full flex flex-col px-3">
//         {/* Logo */}
//         <Link
//           to="/"
//           className="flex items-center md:justify-center gap-4 h-24 border-b border-[#f6e9d7] w-full"
//         >
//           <img src="/favicon.svg" className="w-11" alt="Logo" />
//           {!isCollapsed && (
//             <img
//               src="/logo.svg"
//               className="w-[100px] md:w-[160px]"
//               alt="Logo"
//             />
//           )}
//         </Link>

//         {/* Navigation */}
//         <nav className="flex-1 py-4 overflow-y-auto">
//           <ul className="space-y-2 font-medium">
//             {navLinks
//               .filter((link) => link.roles.includes(userRole))
//               .map((link) => (
//                 <NavItem
//                   key={link.text}
//                   {...link}
//                   isCollapsed={isCollapsed}
//                   onNavItemClick={onNavItemClick}
//                 />
//               ))}
//           </ul>
//         </nav>

//         {/* Logout */}
// <div className="py-4 border-t border-[#f6e9d7]">
//   <li
//     className={`flex items-center cursor-pointer p-2 text-red-600 rounded-md hover:bg-red-200 group
//       ${isCollapsed ? 'justify-center' : ''}`}
//     onClick={onLogout}
//   >
//     <div className="flex items-center">
//       <LogOut className="w-6 h-6" />
//       {!isCollapsed && <span className="ml-3">Logout</span>}
//     </div>
//   </li>
// </div>
//       </div>
//     </aside>
//   );
// };

// const Header = ({ toggleSidebar, userRole }) => {
//   const [balance, setBalance] = useState(null);
//   const [showBalance, setShowBalance] = useState(false);
//   const [loading, setLoading] = useState(false);

//   const handleCheckBalance = async () => {
//     try {
//       setLoading(true);
//       const res = await axios.get(
//         `https://portal.packzy.com/api/v1/get_balance`,
//         {
//           headers: {
//             'Api-Key': import.meta.env.VITE_API_KEY,
//             'Secret-Key': import.meta.env.VITE_SECRET_KEY,
//           },
//         }
//       );
//       setBalance(res.data.current_balance);
//       setShowBalance(true);
//       setTimeout(() => setShowBalance(false), 5000);
//     } catch {
//       toast.error('Failed to fetch balance');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <header className="sticky top-0 bg-[#fffaf3] border-b border-[#f6e9d7] z-30">
//       <div className="px-4 sm:px-6 lg:px-8">
//         <div className="flex items-center justify-between md:h-24 h-16 -mb-px">
//           <div className="flex gap-5 items-center">
//             <button
//               className="text-[#b0804e] cursor-pointer md:block hidden"
//               onClick={toggleSidebar}
//             >
//               <span className="sr-only">Open sidebar</span>
//               <Menu className="md:w-8 w-6 md:h-8 h-6" />
//             </button>

//             <div className="md:hidden">
//               <Link
//                 to="/"
//                 className="flex items-center md:justify-center gap-4 h-24 border-b border-[#f6e9d7] w-full"
//               >
//                 <img src="/favicon.svg" className="w-8" alt="Logo" />
//               </Link>
//             </div>

// <div className="relative hidden md:block">
//   <input
//     type="search"
//     placeholder="Search orders..."
//     className="w-full sm:w-64 pl-12 pr-4 py-2.5 bg-[#fff8f0] border border-[#f6e9d7] rounded-lg focus:ring-2 focus:ring-[#f6e9d7] outline-none"
//   />
//   <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//     <Search className="w-6 h-6 text-[#d9ab66]" />
//   </div>
// </div>
//           </div>

//           <div className="flex items-center space-x-3 relative">
// <button
//   className={` ${
//     userRole === 'Admin' ? 'block' : 'hidden'
//   } items-center w-full min-w-52 sm:w-56 md:px-4 px-2 py-1 md:py-2.5 bg-[#fff8f0] border border-[#f6e9d7] rounded-lg outline-none hover:bg-[#fff3e1]  -150`}
//   onClick={handleCheckBalance}
//   disabled={loading && showBalance}
// >
//   {loading ? (
//     <Loader2 className="w-4 h-4 animate-spin mx-auto text-[#d9ab66]" />
//   ) : showBalance ? (
//     <span className="text-gray-800 font-semibold text-center">
//       {balance} ৳
//     </span>
//   ) : (
//     <span className="text-[#d9ab66] flex items-center gap-3 cursor-pointer">
//       <svg
//         xmlns="http://www.w3.org/2000/svg"
//         width="24"
//         height="24"
//         viewBox="0 0 24 24"
//         fill="none"
//         stroke="currentColor"
//         strokeWidth="2"
//         strokeLinecap="round"
//         strokeLinejoin="round"
//         className="lucide lucide-circle-dollar-sign"
//       >
//         <circle cx="12" cy="12" r="10" />
//         <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8" />
//         <path d="M12 18V6" />
//       </svg>
//       <span className="text-gray-800">Check Balance</span>
//     </span>
//   )}
// </button>

//             <button className="md:p-2 p-1 cursor-pointer text-[#d9ab66]/90 bg-[#fff3e1] rounded-full hover:text-[#d9ab66]  -150 hover:bg-[#ffe9cc]">
//               <Bell className="md:w-8 w-6 md:h-8 h-6" />
//             </button>
//             <button className="md:p-2 p-1 cursor-pointer text-[#d9ab66]/90 bg-[#fff3e1] rounded-full hover:text-[#d9ab66]  -150 hover:bg-[#ffe9cc]">
//               <User className="md:w-8 w-6 md:h-8 h-6" />
//             </button>
//           </div>
//         </div>
//       </div>
//     </header>
//   );
// };

// export default function DashboardLayout() {
//   const navigate = useNavigate();
//   const [sidebarState, setSidebarState] = useState('collapsed');
//   const [logoutMutation] = useLogoutMutation();
//   const { data: user, isLoading } = useGetUserMeQuery();

//   const toggleSidebar = () => {
//     const isMobile = window.innerWidth < 640;
//     if (isMobile) {
//       setSidebarState((prev) => (prev === 'hidden' ? 'expanded' : 'hidden'));
//     } else {
//       setSidebarState((prev) =>
//         prev === 'expanded' ? 'collapsed' : 'expanded'
//       );
//     }
//   };

//   useEffect(() => {
//     if (!isLoading && !user) {
//       navigate('/login', { replace: true });
//     }
//   }, [user, isLoading, navigate]);

//   const handleLogout = async () => {
//     try {
//       await logoutMutation().unwrap();
//       window.location.href = '/';
//     } catch (error) {
//       toast.error('Logout failed:', error);
//     }
//   };

//   const handleNavItemClick = () => {
//     if (window.innerWidth < 640) {
//       setSidebarState('hidden');
//     }
//   };

//   return (
//     <div className="flex h-screen bg-[#F6F0E6]">
//       <div className="md:block hidden">
//         <Sidebar
//           sidebarState={sidebarState}
//           userRole={user?.role}
//           onLogout={handleLogout}
//           onNavItemClick={handleNavItemClick}
//         />
//       </div>
//       <div
//         className={`flex-1 flex flex-col overflow-hidden  -all  -300
//           ${
//             sidebarState !== 'hidden'
//               ? sidebarState === 'collapsed'
//                 ? 'sm:ml-20'
//                 : 'sm:ml-64'
//               : ''
//           }`}
//       >
//         <Header toggleSidebar={toggleSidebar} userRole={user?.role} />
//         <main className="flex-1 overflow-x-hidden overflow-y-auto bg-white">
//           <Outlet />
//         </main>
//       </div>

//       {sidebarState === 'expanded' && window.innerWidth < 640 && (
//         <div
//           className="fixed inset-0 bg-black opacity-50 z-30"
//           onClick={() => setSidebarState('hidden')}
//         />
//       )}
//     </div>
//   );
// }

import { useEffect, useState, useRef } from 'react';
import {
  Search,
  Bell,
  Menu,
  Home,
  Archive,
  LogOut,
  User,
  ShoppingCart,
  Users,
  Loader2,
  ChevronUp,
  ChevronDown,
  FilePlus2,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useGetUserMeQuery, useLogoutMutation } from '../api/userApi';
import axios from 'axios';
import { toast } from 'react-toastify';

// The navLinks array is moved here to be accessible by both Sidebar and BottomNavBar
const navLinks = [
  {
    text: 'Dashboard',
    to: '/dashboard',
    icon: <Home className="w-6 h-6" />,
    roles: ['Admin', 'Moderator'],
  },
  {
    text: 'Products',
    to: '/dashboard/products',
    icon: <Archive className="w-6 h-6" />,
    roles: ['Admin', 'Moderator'],
  },
  // {
  //   text: 'Add Product',
  //   to: '/dashboard/add-product',
  //   icon: <FilePlus2 className="w-6 h-6" />,
  //   roles: ['Admin'],
  // },

  {
    text: 'Orders',
    to: '/dashboard/orders',
    icon: <ShoppingCart className="w-6 h-6" />,
    roles: ['Admin', 'Moderator'],
  },
  {
    text: 'Management',
    to: '/dashboard/frontend-management',
    icon: <FilePlus2 className="w-6 h-6" />,
    roles: ['Admin'],
  },
  {
    text: 'Users',
    to: '/dashboard/users',
    icon: <Users className="w-6 h-6" />,
    roles: ['Admin'],
  },
];

const NavItem = ({ icon, text, isCollapsed, to, subMenu, onNavItemClick }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [expand, setExpand] = useState(false);

  const isActive =
    location.pathname === to ||
    (to !== '/dashboard' && location.pathname.startsWith(to));

  const handleNavigate = () => {
    if (subMenu) {
      setExpand(!expand);
    } else {
      navigate(to);
    }
  };

  return (
    <>
      <li
        className={`flex items-center justify-between cursor-pointer p-2 text-slate-800 rounded-md group
          ${
            isActive
              ? 'bg-white font-semibold hover:bg-white'
              : 'hover:bg-white'
          }
          ${isCollapsed ? 'justify-center' : ''}`}
        onClick={() => {
          if (window.innerWidth < 768) {
            onNavItemClick();
          }
          handleNavigate();
        }}
        title={text}
      >
        <div
          className={`flex items-center ${
            isActive ? 'text-slate-800' : 'text-[#878a99]'
          }`}
        >
          {icon}
          {!isCollapsed && (
            <span className="ml-3 flex-1 whitespace-nowrap text-left">
              {text}
            </span>
          )}
        </div>
        {subMenu && !isCollapsed && (
          <div className="ml-2">
            {expand ? (
              <ChevronUp className="w-4 h-4 text-[#9E6747]" />
            ) : (
              <ChevronDown className="w-4 h-4 text-[#9E6747]" />
            )}
          </div>
        )}
      </li>

      {expand && subMenu && !isCollapsed && (
        <ul className="ml-8 space-y-2">
          {subMenu.map((sub) => (
            <li
              key={sub.name}
              className={`flex items-center cursor-pointer p-2 text-slate-700 rounded-md hover:bg-[#fff4e0] group
                ${
                  location.pathname === sub.slug
                    ? 'bg-[#f1aa2e] font-semibold text-white'
                    : ''
                }`}
              onClick={() => navigate(sub.slug)}
            >
              {sub.icon}
              <span className="ml-3">{sub.name}</span>
            </li>
          ))}
        </ul>
      )}
    </>
  );
};

// Sidebar Component
const Sidebar = ({
  sidebarState,
  user,
  onLogout,
  onNavItemClick,
  toggleSidebar,
}) => {
  const isCollapsed = sidebarState === 'collapsed';
  const isHidden = sidebarState === 'hidden';
  const userRole = user?.role;

  return (
    <aside
      className={`fixed top-0 left-0 z-40 h-screen bg-[#f7f7f7]  -all  -300 ease-in-out
        ${isHidden ? '-translate-x-full' : 'translate-x-0'}
        ${isCollapsed ? 'md:w-20 w-0' : 'w-60'} sm:translate-x-0`}
    >
      <div className="flex flex-col items-center h-full w-full">
        {/* Logo + Toggle Button */}
        <div className="flex items-center w-full px-1 pt-10 relative">
          {/* Chevron Toggle */}

          <button
            onClick={toggleSidebar}
            className="absolute text-[#878a99] -mt-6 hover:text-slate-800  -colors  -200 cursor-pointer opacity-0 hover:opacity-100 mr-2 size-6"
          >
            {isCollapsed ? (
              <img src="/arrow-left.svg" alt="" />
            ) : (
              <img src="/arrow-right.svg" alt="" />
            )}
          </button>

          <Link to="/" className="flex-1 flex justify-center">
            {isCollapsed ? (
              <div className="size-9">
                <img
                  src="/icon.svg"
                  alt="Logo"
                  className=" -all  -300 object-cover"
                />
              </div>
            ) : (
              <img
                src="/logo.svg"
                className="w-[90px] md:w-[120px] h-9  -all  -300"
                alt="Logo"
              />
            )}
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 pb-4 mt-6 overflow-y-auto w-full px-5">
          <ul className="space-y-2 font-medium">
            {/* <li
              className={`text-[#878a99] px-4 ${
                isCollapsed ? 'opacity-0' : 'opacity-100'
              }`}
            >
              Menu
            </li> */}
            {navLinks
              .filter((link) => link.roles.includes(userRole))
              .map((link) => (
                <NavItem
                  key={link.text}
                  {...link}
                  isCollapsed={isCollapsed}
                  onNavItemClick={onNavItemClick}
                />
              ))}
          </ul>
        </nav>

        <div className='-mb-1 w-fit mx-auto'>
          <img src={user.image} alt="Profile"  className='rounded-full size-9'/>
        </div>

        {/* Logout button */}
        <div className="py-4 w-full px-5 ">
          <li
            title="Logout"
            className={`flex items-center cursor-pointer p-2 text-red-400 rounded-md hover:bg-red-200
              ${isCollapsed ? 'justify-center' : ''}`}
            onClick={onLogout}
          >
            <div className="flex items-center ">
              <LogOut className="w-6 h-6" />
              {!isCollapsed && <span className="ml-3">Logout</span>}
            </div>
          </li>
        </div>
      </div>
    </aside>
  );
};

// Header Component
const Header = ({ toggleSidebar, userRole, onLogout }) => {
  const [balance, setBalance] = useState(null);
  const [showBalance, setShowBalance] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef(null);

  // Close profile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target)
      ) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleCheckBalance = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `https://portal.packzy.com/api/v1/get_balance`,
        {
          headers: {
            'Api-Key': import.meta.env.VITE_API_KEY,
            'Secret-Key': import.meta.env.VITE_SECRET_KEY,
          },
        }
      );
      setBalance(res.data.current_balance);
      setShowBalance(true);
      setTimeout(() => setShowBalance(false), 5000);
    } catch {
      toast.error('Failed to fetch balance');
    } finally {
      setLoading(false);
    }
  };

  return (
    <header className="sticky top-0 bg-[#f7f7f7] border-b border-[#f7f7f7] z-30">
      <div className="pr-4 sm:pr-6 lg:pr-8">
        <div className="flex items-center justify-between md:h-24 h-16 -mb-px">
          <div className="flex gap-5 items-center">
            <button
              className="text-[#878a99] cursor-pointer md:block hidden"
              onClick={toggleSidebar}
            >
              <Menu className="md:w-8 w-6 md:h-8 h-6" />
            </button>

            <div className="md:hidden pl-4">
              <Link to="/" className="flex items-center">
                <img src="/favicon.svg" className="w-8" alt="Logo" />
              </Link>
            </div>

            <div className="relative hidden md:block">
              <input
                type="search"
                placeholder="Search orders..."
                className="w-full sm:w-64 pl-12 pr-4 py-2.5 bg-white border border-white rounded-lg outline-none placeholder:text-[#495057]"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="w-6 h-6 text-[#878a99]" />
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* Balance Button */}
            <button
              className={` ${
                userRole === 'Admin' ? 'block' : 'hidden'
              } items-center w-full min-w-52 sm:w-56 md:px-4 px-2 py-1 md:py-2.5 bg-white border border-white rounded-lg outline-none  -150`}
              onClick={handleCheckBalance}
              disabled={loading && showBalance}
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin mx-auto text-[#878a99]" />
              ) : showBalance ? (
                <span className="text-gray-800 font-semibold text-center">
                  {balance} ৳
                </span>
              ) : (
                <span className="text-[#878a99] flex items-center gap-3 cursor-pointer">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-circle-dollar-sign"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8" />
                    <path d="M12 18V6" />
                  </svg>
                  <span className="text-gray-800">Check Balance</span>
                </span>
              )}
            </button>

            <button className="md:p-2 p-1 text-[#878a99] bg-white rounded-full cursor-pointer">
              <Bell className="md:w-8 w-6 md:h-8 h-6" />
            </button>

            {/* Profile Icon and Menu */}
            <div className="relative" ref={profileMenuRef}>
              <button
                onClick={() => setIsProfileMenuOpen((prev) => !prev)}
                className="md:p-2 p-1 text-[#878a99] bg-white rounded-full cursor-pointer"
              >
                <User className="md:w-8 w-6 md:h-8 h-6" />
              </button>

              {isProfileMenuOpen && (
                <div className="absolute right-0 mt-2 w-36 bg-white rounded-md shadow-lg py-1 z-50">
                  <button
                    onClick={onLogout}
                    className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

// NEW Bottom Navigation Bar for Mobile
const BottomNavBar = ({ userRole, isVisible }) => {
  const location = useLocation();
  const bottomNavLinks = navLinks.slice(0, 5);

  return (
    <nav
      className={`md:hidden fixed bottom-0 left-0 right-0 bg-[#f7f7f7] border-t border-[#f7f7f7] z-40 transform  -transform  -300 ${
        isVisible ? 'translate-y-0' : 'translate-y-full'
      }`}
    >
      <ul className="flex justify-around items-center h-16">
        {bottomNavLinks
          .filter((link) => link.roles.includes(userRole))
          .map((link) => {
            const isActive =
              location.pathname === link.to ||
              (link.to !== '/dashboard' &&
                location.pathname.startsWith(link.to));
            return (
              <li key={link.text}>
                <Link
                  to={link.to}
                  title={link.text}
                  className={`flex flex-col items-center justify-center gap-1 p-2 rounded-lg ${
                    isActive ? 'text-slate-800' : 'text-[#878a99]'
                  }`}
                >
                  {link.icon}
                  <span className="text-xs font-medium">{link.text}</span>
                </Link>
              </li>
            );
          })}
      </ul>
    </nav>
  );
};

// Main Layout Component
export default function DashboardLayout() {
  const navigate = useNavigate();
  const [sidebarState, setSidebarState] = useState('collapsed');
  const [isBottomNavVisible, setIsBottomNavVisible] = useState(true);
  const [logoutMutation] = useLogoutMutation();
  const { data: user, isLoading } = useGetUserMeQuery();
  const lastScrollY = useRef(0);
  const mainContentRef = useRef(null);

  // Show/Hide bottom nav on scroll
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = mainContentRef.current.scrollTop;
      if (currentScrollY > lastScrollY.current && currentScrollY > 50) {
        setIsBottomNavVisible(false);
      } else {
        setIsBottomNavVisible(true);
      }
      lastScrollY.current = currentScrollY;
    };

    const mainEl = mainContentRef.current;
    mainEl.addEventListener('scroll', handleScroll);
    return () => mainEl.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleSidebar = () => {
    setSidebarState((prev) => (prev === 'expanded' ? 'collapsed' : 'expanded'));
  };

  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/login', { replace: true });
    }
  }, [user, isLoading, navigate]);

  const handleLogout = async () => {
    try {
      await logoutMutation().unwrap();
      window.location.href = '/';
    } catch (error) {
      toast.error('Logout failed:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-gray-600" />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#F6F0E6]">
      <div className="hidden md:block">
        <Sidebar
          sidebarState={sidebarState}
          onLogout={handleLogout}
          user={user}
          toggleSidebar={toggleSidebar}
        />
      </div>

      <div
        className={`flex-1 flex flex-col overflow-hidden  -all  -300
          ${sidebarState === 'collapsed' ? 'md:ml-20' : 'md:ml-60'}`}
      >
        {/* <Header
          toggleSidebar={toggleSidebar}
          userRole={user?.role}
          onLogout={handleLogout}
        /> */}
        <main
          ref={mainContentRef}
          className="flex-1 overflow-x-hidden overflow-y-auto bg-white md:pb-0 pb-10"
        >
          <Outlet />
        </main>
      </div>

      {user?.role && (
        <BottomNavBar userRole={user.role} isVisible={isBottomNavVisible} />
      )}
    </div>
  );
}

// const NavItem = ({ icon, text, isCollapsed, to }) => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const isActive =
//     location.pathname === to ||
//     (to !== '/dashboard' && location.pathname.startsWith(to));

//   return (
//     <li
//       className={`flex items-center cursor-pointer p-2 text-gray-700 rounded-md hover:bg-[#f6e9d7] group
//         ${isActive ? 'bg-[#eed9b6] font-semibold' : ''}
//         ${isCollapsed ? 'justify-center' : ''}`}
//       onClick={() => navigate(to)}
//     >
//       <div className="flex items-center">
//         {icon}
//         {!isCollapsed && (
//           <span className="ml-3 flex-1 whitespace-nowrap text-left">
//             {text}
//           </span>
//         )}
//       </div>
//     </li>
//   );
// };

// NavItem updated for expandable submenu

// const Sidebar = ({ sidebarState }) => {
//   // const { data: summaryData } = useGetProductSummaryQuery();
//   // const subMenu = summaryData?.data?.submenus;
//   const isCollapsed = sidebarState === 'collapsed';
//   const isHidden = sidebarState === 'hidden';

//   const [logout] = useLogoutMutation();
//   const { data: user, isLoading, isError } = useGetUserMeQuery();
//   const navigate = useNavigate();

//   if (isLoading) return <p>Loading...</p>;
//   if (isError || !user) {
//     navigate('/login');
//     return null;
//   }

//   const handleLogout = () => {
//     logout()
//       .unwrap()
//       .then(() => {
//         localStorage.removeItem('token');
//         navigate('/login', { replace: true }); // replaces history, no flicker
//       })
//       .catch((err) => {
//         console.error('Logout failed:', err);
//       });
//   };

//   const role = user?.role;

//   const navLinks = [
//     {
//       text: 'Dashboard',
//       to: '/dashboard',
//       icon: <Home className="w-6 h-6" />,
//       roles: ['Admin', 'Moderator'],
//     },
//     {
//       text: 'Products',
//       to: '/dashboard/products',
//       icon: <Archive className="w-6 h-6" />,
//       roles: ['Admin', 'Moderator'],
//       // subMenu,
//     },
//     {
//       text: 'Add Product',
//       to: '/dashboard/add-product',
//       icon: <BarChart2 className="w-6 h-6" />,
//       roles: ['Admin', 'Moderator'],
//     },
//     {
//       text: 'Orders',
//       to: '/dashboard/orders',
//       icon: <ShoppingCart className="w-6 h-6" />,
//       roles: ['Admin', 'Moderator'],
//     },
//     {
//       text: 'Users',
//       to: '/dashboard/users',
//       icon: <Users className="w-6 h-6" />,
//       roles: ['Admin'],
//     },
//     // {
//     //   text: 'Add Order',
//     //   to: '/dashboard/add-order',
//     //   icon: <BarChart2 className="w-6 h-6" />,
//     //   roles: ['Admin'],
//     // },
//     // {
//     //   text: 'Order Summary',
//     //   to: '/dashboard/orders-summary',
//     //   icon: <List className="w-6 h-6" />,
//     //   roles: ['Admin', 'User'],
//     // },
//   ];

//   return (
//     <aside
//       className={`fixed top-0 left-0 z-40 h-screen bg-[#fffaf3] text-gray-800  -all  -300
//         ${isHidden ? '-translate-x-full' : 'translate-x-0'}
//         ${isCollapsed ? 'w-20' : 'w-64'} sm:translate-x-0`}
//     >
//       <div className="h-full flex flex-col px-3">
//         <Link
//           to="/"
//           className="flex items-center justify-center gap-4 h-24 border-b border-[#f6e9d7] w-full"
//         >
//           <img src="/favicon.svg" className="w-11" alt="Logo" />
//           {!isCollapsed && (
//             <img
//               src="/logo.svg"
//               className="w-[100px] md:w-[160px]"
//               alt="Logo"
//             />
//           )}
//         </Link>

//         <nav className="flex-1 py-4 overflow-y-auto">
//           <ul className="space-y-2 font-medium">
//             {navLinks
//               .filter((link) => link.roles.includes(role))
//               .map((link) => (
//                 <NavItem key={link.text} {...link} isCollapsed={isCollapsed} />
//               ))}
//           </ul>
//         </nav>

//         <div className="py-4 border-t border-[#f6e9d7]">
//           <li
//             className={`flex items-center cursor-pointer p-2 text-red-600 rounded-md hover:bg-red-200 group
//               ${isCollapsed ? 'justify-center' : ''}`}
//             onClick={handleLogout}
//           >
//             <div className="flex items-center">
//               <LogOut className="w-6 h-6" />
//               {!isCollapsed && (
//                 <span className="ml-3 flex-1 whitespace-nowrap text-left">
//                   Logout
//                 </span>
//               )}
//             </div>
//           </li>
//         </div>
//       </div>
//     </aside>
//   );
// };

// export default function DashboardLayout() {
//   const [sidebarState, setSidebarState] = useState('expanded');

//   const toggleSidebar = () => {
//     if (window.innerWidth < 640) {
//       setSidebarState(sidebarState === 'hidden' ? 'expanded' : 'hidden');
//     } else {
//       setSidebarState(sidebarState === 'expanded' ? 'collapsed' : 'expanded');
//     }
//   };

//   return (
//     <div className="flex h-screen bg-[#F6F0E6]">
//       <Sidebar sidebarState={sidebarState} />
//       <div
//         className={`flex-1 flex flex-col overflow-hidden  -all  -300
//           ${
//             sidebarState !== 'hidden'
//               ? sidebarState === 'collapsed'
//                 ? 'sm:ml-20'
//                 : 'sm:ml-64'
//               : ''
//           }`}
//       >
//         <Header toggleSidebar={toggleSidebar} />
//         <main className="flex-1 overflow-x-hidden overflow-y-auto bg-white">
//           <Outlet />
//         </main>
//       </div>

//       {sidebarState === 'expanded' && window.innerWidth < 640 && (
//         <div
//           className="fixed inset-0 bg-black opacity-50 z-30"
//           onClick={() => setSidebarState('hidden')}
//         ></div>
//       )}
//     </div>
//   );
// }
