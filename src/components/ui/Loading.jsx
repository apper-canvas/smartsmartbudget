import { motion } from "framer-motion";

const Loading = ({ type = "default" }) => {
  if (type === "transactions") {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white rounded-xl p-4 shadow-soft"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full animate-pulse" />
                <div className="space-y-2">
                  <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-32 animate-pulse" />
                  <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-20 animate-pulse" />
                </div>
              </div>
              <div className="h-5 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-16 animate-pulse" />
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  if (type === "dashboard") {
    return (
      <div className="space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-xl p-6 shadow-soft"
            >
              <div className="space-y-3">
                <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-24 animate-pulse" />
                <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-32 animate-pulse" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Chart Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl p-6 shadow-soft"
        >
          <div className="space-y-4">
            <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-40 animate-pulse" />
            <div className="h-64 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg animate-pulse" />
          </div>
        </motion.div>
      </div>
    );
  }

  // Default skeleton
  return (
    <div className="space-y-4">
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: i * 0.1 }}
          className="bg-white rounded-xl p-6 shadow-soft"
        >
          <div className="space-y-3">
            <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-3/4 animate-pulse" />
            <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-1/2 animate-pulse" />
            <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-2/3 animate-pulse" />
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default Loading;