import { BrowserRouter, Routes, Route } from "react-router-dom";

/* ================= PUBLIC ================= */
import LandingPage from "./pages/Landingpage";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";

/* ================= USER ================= */
import PayrollSummary from "./pages/PayrollSummary";
import PayrollDetails from "./pages/PayrollDetails";
import Help from "./pages/Help";
import About from "./pages/About";
import SalaryHistory from "./pages/SalaryHistory";
import Layout from "./components/Layout";

/* ================= ADMIN AUTH ================= */
import AdminLogin from "./pages/AdminLogin";
import AdminForgotPassword from "./pages/AdminForgotPassword";

/* ================= ADMIN ================= */
import AdminPanel from "./pages/AdminPanel";
import CreateUser from "./pages/CreateUser";
import EditUser from "./pages/EditUser";
import ProfileManagement from "./pages/ProfileManagement";
import AdminLayout from "./components/AdminLayout";

/* ================= BULK UPLOAD ================= */
import BulkUpload from "./pages/BulkUpload";
import FinanceBulkUpload from "./pages/FinanceBulkUpload";
import ProfileBulkUpload from "./pages/ProfileBulkUpload";

/* ================= FINANCE ================= */
import FinancialManagement from "./pages/FinancialManagement";
import EmployeeFinancialDetails from "./pages/EmployeeFinancialDetails";
import ViewPayslip from "./pages/ViewPayslip"; // ✅ NEW
import PayFixation from "./pages/PayFixation";
import PayFixationBulkUpload from "./pages/PayFixationBulkUpload";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ================= PUBLIC ================= */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot" element={<ForgotPassword />} />

        {/* ================= USER ================= */}
        <Route element={<Layout />}>
          <Route path="/payroll-summary" element={<PayrollSummary />} />
          <Route path="/employee/:id" element={<PayrollDetails />} />
          <Route path="/salary-history" element={<SalaryHistory />} />
          <Route path="/payslip/view/:email/:month" element={<ViewPayslip />} />
          <Route path="/help" element={<Help />} />
          <Route path="/about" element={<About />} />
        </Route>

        {/* ================= ADMIN AUTH ================= */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/forgot" element={<AdminForgotPassword />} />

        {/* ================= ADMIN PANEL ================= */}
        <Route element={<AdminLayout />}>

          <Route path="/adminpanel" element={<AdminPanel />} />

          {/* PROFILE MANAGEMENT */}
          <Route
            path="/admin/user-management/profile"
            element={<ProfileManagement />}
          />

          {/* ACCOUNT MANAGEMENT */}
          <Route
            path="/admin/user-management/account"
            element={<EditUser />}
          />

          {/* CREATE USER */}
          <Route
            path="/admin/create-user"
            element={<CreateUser />}
          />

          {/* BULK USER UPLOAD */}
          <Route
            path="/admin/bulk-upload"
            element={<BulkUpload />}
          />

          {/* FINANCIAL MANAGEMENT (SEARCH PAGE) */}
          <Route
            path="/admin/financial-management"
            element={<FinancialManagement />}
          />

          {/* EDIT PAYSLIP */}
          <Route
            path="/admin/financial-management/:email/:month"
            element={<EmployeeFinancialDetails />}
          />

          {/* ✅ VIEW PAYSLIP (READ ONLY) */}
          <Route
            path="/admin/payslip/view/:email/:month"
            element={<ViewPayslip />}
          />

          {/* FINANCE BULK UPLOAD */}
          <Route
            path="/admin/finance-bulk-upload"
            element={<FinanceBulkUpload />}
          />

          {/* PROFLE BULK UPLOAD */}
          <Route
            path="/admin/user-management/profile/bulk-upload"
            element={<ProfileBulkUpload />}
          />

          {/* PAY FIXATION */}
          <Route
            path="/admin/pay-fixation"
            element={<PayFixation />}
          />

          {/* PAY FIXATION BULK UPLOAD */}
          <Route
            path="/admin/pay-fixation/bulk-upload"
            element={<PayFixationBulkUpload />}
          />

        </Route>

      </Routes>
    </BrowserRouter>
  );
}
