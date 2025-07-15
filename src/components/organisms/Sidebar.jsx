import { useState, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NavLink, useLocation } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import CategoryModal from "@/components/organisms/CategoryModal";
import { AuthContext } from "@/App";

const Sidebar = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const location = useLocation();
  const { logout } = useContext(AuthContext);

  const navigationItems = [
    { name: "Dashboard", href: "/", icon: "LayoutDashboard" },
    { name: "Transactions", href: "/transactions", icon: "Receipt" },
    { name: "Budgets", href: "/budgets", icon: "PiggyBank" },
    { name: "Goals", href: "/goals", icon: "Target" },
    { name: "Charts", href: "/charts", icon: "BarChart3" }
  ];

  const isActive = (href) => {
    if (href === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(href);
  };

  const sidebarContent = (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
            <ApperIcon name="DollarSign" className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">SmartBudget</h1>
            <p className="text-sm text-gray-600">Finance Manager</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {navigationItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            onClick={() => setIsMobileOpen(false)}
            className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
              isActive(item.href)
                ? "bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-md"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <ApperIcon name={item.icon} className="w-5 h-5" />
            <span className="font-medium">{item.name}</span>
          </NavLink>
        ))}
      </nav>

<div className="p-4 border-t border-gray-200 space-y-3">
        <button
          onClick={() => {
            setIsCategoryModalOpen(true);
            setIsMobileOpen(false);
          }}
          className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-all duration-200"
        >
          <ApperIcon name="Settings" className="w-5 h-5" />
          <span className="font-medium">Categories</span>
        </button>
        
        <button
          onClick={() => {
            logout();
            setIsMobileOpen(false);
          }}
          className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-all duration-200"
        >
          <ApperIcon name="LogOut" className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </button>
        
        <div className="bg-gradient-to-r from-primary-50 to-secondary-50 p-4 rounded-lg">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
              <ApperIcon name="TrendingUp" className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Track your progress</p>
              <p className="text-xs text-gray-600">Stay on top of your goals</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-lg"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
      >
        <ApperIcon name={isMobileOpen ? "X" : "Menu"} className="w-6 h-6" />
      </button>

      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-64 bg-white border-r border-gray-200 h-screen sticky top-0">
        {sidebarContent}
      </div>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
              onClick={() => setIsMobileOpen(false)}
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="lg:hidden fixed left-0 top-0 h-full w-64 bg-white z-50 shadow-xl"
            >
              {sidebarContent}
            </motion.div>
          </>
        )}
</AnimatePresence>
      
      <CategoryModal 
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
      />
    </>
  );
};

export default Sidebar;