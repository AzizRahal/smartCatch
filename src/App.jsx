import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { useEffect } from "react";
import {
  MessageSquare,
  Calendar,
  Sparkles,
  User,
  Settings,
} from "lucide-react";
import MessagesPage from "./pages/MessagesPage";
import SummaryPage from "./pages/SummaryPage";
import CalendarPage from "./pages/CalendarPage";
import ProfilePage from "./pages/ProfilePage";
import SettingsPage from "./pages/SettingsPage";

function useDarkMode() {
  useEffect(() => {
    const dark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    document.documentElement.classList.toggle("dark", dark);
  }, []);
}

export default function App() {
  useDarkMode();
  return (
    <Router>
      <div className="min-h-screen bg-white dark:bg-green text-black dark:text-white pb-16">
        <Routes>
          <Route path="/" element={<SummaryPage />} />
          <Route path="/messages" element={<MessagesPage />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
        <nav className="fixed bottom-0 w-full flex justify-around border-t bg-white dark:bg-black py-2">
          <Link to="/messages" className="text-xs text-center flex flex-col items-center">
            <MessageSquare className="h-5 w-5" />
            Messages
          </Link>
          <Link to="/calendar" className="text-xs text-center flex flex-col items-center">
            <Calendar className="h-5 w-5" />
            Calendar
          </Link>
          <Link to="/" className="text-xs text-center flex flex-col items-center">
            <Sparkles className="h-5 w-5" />
            Summary
          </Link>
          <Link to="/profile" className="text-xs text-center flex flex-col items-center">
            <User className="h-5 w-5" />
            Profile
          </Link>
          <Link to="/settings" className="text-xs text-center flex flex-col items-center">
            <Settings className="h-5 w-5" />
            Settings
          </Link>
        </nav>
      </div>
    </Router>
  );
}
