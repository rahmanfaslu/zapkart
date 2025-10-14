import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  FiHome,
  FiBox,
  FiUsers,
  FiShoppingBag,
  FiLogOut,
  FiMenu,
  FiX
} from "react-icons/fi";

const AdminSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isCollapsed, setIsCollapsed] = useState(isMobile);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile !== isMobile) {
        setIsCollapsed(mobile);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isMobile]);

  const handleLogout = () => {
    localStorage.removeItem("admin");  
    navigate("/login");
  };

  const menuItems = [
    { path: "/admin/dashboard", name: "Dashboard", icon: <FiHome size={20} /> },
    { path: "/admin/products", name: "Products", icon: <FiBox size={20} /> },
    { path: "/admin/users", name: "Users", icon: <FiUsers size={20} /> },
    { path: "/admin/orders", name: "Orders", icon: <FiShoppingBag size={20} /> }
  ];

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <>
      {isMobile && (
        <button
          onClick={toggleSidebar}
          className="fixed top-4 left-4 z-50 p-2 bg-white rounded-md shadow-md md:hidden"
        >
          {isCollapsed ? <FiMenu size={24} /> : <FiX size={24} />}
        </button>
      )}

      <aside
        className={`bg-white min-h-screen border-r border-gray-200 p-6 transition-all duration-300 ${
          isMobile
            ? `fixed top-0 left-0 z-40 h-full ${
                isCollapsed ? "-translate-x-full" : "translate-x-0"
              }`
            : "w-64"
        }`}
      >
        
        <div className="mb-8 flex justify-between items-center">
          {!isCollapsed && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Admin Panel</h2>
              <div className="w-12 h-1 bg-blue-500 rounded"></div>
            </div>
          )}
          {!isMobile && (
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-2 rounded-lg hover:bg-gray-100"
            >
              {isCollapsed ? <FiMenu size={20} /> : <FiX size={20} />}
            </button>
          )}
        </div>

        <nav className="space-y-3 mb-8">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center w-full p-4 rounded-lg font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-blue-500 text-white shadow-md'
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                }`}
                title={isCollapsed ? item.name : ""}
              >
                <span className={isCollapsed ? "" : "mr-3"}>{item.icon}</span>
                {!isCollapsed && item.name}
              </Link>
            );
          })}
        </nav>

        {!isCollapsed && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="text-sm text-gray-600 mb-1">Logged in as:</div>
            <div className="font-semibold text-gray-800">Administrator</div>
          </div>
        )}

        <button
          onClick={handleLogout}
          className={`flex items-center w-full p-4 ${
            isCollapsed ? "justify-center" : ""
          } bg-red-50 hover:bg-red-100 text-red-600 font-medium rounded-lg transition-colors duration-200`}
          title={isCollapsed ? "Logout" : ""}
        >
          <FiLogOut size={20} />
          {!isCollapsed && <span className="ml-3">Logout</span>}
        </button>
      </aside>

      {/* Overlay for mobile when sidebar is open */}
      {isMobile && !isCollapsed && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={toggleSidebar}
        />
      )}
    </>
  );
};

export default AdminSidebar;