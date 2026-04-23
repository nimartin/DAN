import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import Home from "./pages/Home.jsx";
import FormPage from "./pages/FormPage.jsx";
import Success from "./pages/Success.jsx";
import History from "./pages/History.jsx";
import Stats from "./pages/Stats.jsx";
import Wallet from "./pages/Wallet.jsx";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/depense" element={<FormPage />} />
        <Route path="/succes" element={<Success />} />
        <Route path="/historique" element={<History />} />
        <Route path="/stats" element={<Stats />} />
        <Route path="/wallet" element={<Wallet />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
