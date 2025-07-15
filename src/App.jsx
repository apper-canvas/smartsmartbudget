import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Sidebar from "@/components/organisms/Sidebar";
import Dashboard from "@/components/pages/Dashboard";
import Transactions from "@/components/pages/Transactions";
import Budgets from "@/components/pages/Budgets";
import Goals from "@/components/pages/Goals";
import Charts from "@/components/pages/Charts";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <div className="flex">
          <Sidebar />
          
          <main className="flex-1 lg:pl-0 pl-0">
            <div className="p-6 lg:p-8 pt-16 lg:pt-8">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/transactions" element={<Transactions />} />
                <Route path="/budgets" element={<Budgets />} />
                <Route path="/goals" element={<Goals />} />
                <Route path="/charts" element={<Charts />} />
              </Routes>
            </div>
          </main>
        </div>
        
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          style={{ zIndex: 9999 }}
        />
      </div>
    </BrowserRouter>
  );
}

export default App;