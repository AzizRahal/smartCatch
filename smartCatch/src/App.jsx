// App.tsx — Full App Page with Firebase + UI + Routing

import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
} from "firebase/firestore";
import {
  Loader,
  Plus,
  Filter,
  Search,
  MessageSquare,
  Sparkles,
  Calendar,
  User,
  Settings,
} from "lucide-react";

// Firebase config (fallback with dummy values if env is undefined)
const firebaseConfig = {
  apiKey: import.meta.env?.VITE_FIREBASE_API_KEY || "FAKE_API_KEY",
  authDomain:
    import.meta.env?.VITE_FIREBASE_AUTH_DOMAIN ||
    "fake-auth-domain.firebaseapp.com",
  projectId: import.meta.env?.VITE_FIREBASE_PROJECT_ID || "fake-project-id",
  storageBucket:
    import.meta.env?.VITE_FIREBASE_STORAGE_BUCKET || "fake.appspot.com",
  messagingSenderId:
    import.meta.env?.VITE_FIREBASE_MESSAGING_SENDER_ID || "1234567890",
  appId:
    import.meta.env?.VITE_FIREBASE_APP_ID || "1:1234567890:web:abcdef123456",
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

function useDarkMode() {
  useEffect(() => {
    const dark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    document.documentElement.classList.toggle("dark", dark);
  }, []);
}

// UI Components
const Card = ({ children, className = "" }) => (
  <div className={`rounded-xl border shadow p-4 ${className}`}>{children}</div>
);
const CardContent = ({ children }) => <div>{children}</div>;
const Button = ({ children, variant, ...props }) => {
  const base = "px-3 py-1.5 rounded text-white bg-blue-600 hover:bg-blue-700";
  const outline =
    "border border-blue-600 text-blue-600 bg-transparent hover:bg-blue-50";
  return (
    <button className={variant === "outline" ? outline : base} {...props}>
      {children}
    </button>
  );
};
const Input = (props) => (
  <input
    className="border px-2 py-1 rounded w-full dark:bg-gray-800 dark:text-white"
    {...props}
  />
);

// Messages Page
function MessagesPage() {
  const [search, setSearch] = useState("");
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAiOptions, setShowAiOptions] = useState(false);

  const fetchMessages = async () => {
    const q = query(collection(db, "messages"), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setMessages(data);
  };

  const handleAdd = async () => {
    if (!input.trim()) return;
    setLoading(true);
    await addDoc(collection(db, "messages"), {
      sender: "Manual Entry",
      summary: input,
      suggestion: "(AI Suggestion)",
      createdAt: new Date(),
    });
    setInput("");
    await fetchMessages();
    setLoading(false);
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const filtered = messages.filter(
    (m) =>
      m.sender.toLowerCase().includes(search.toLowerCase()) ||
      m.summary.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4 max-w-3xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Messages</h1>
        <div className="flex gap-2">
          <Button variant="outline">
            <Filter className="w-4 h-4" />
          </Button>
          <Input
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-48"
          />
          <Button variant="outline">
            <Search className="w-4 h-4" />
          </Button>
        </div>
      </div>
      <div className="flex gap-2 items-center">
        <Input
          placeholder="Paste message here..."
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            setShowAiOptions(e.target.value.length > 0);
          }}
        />
        {showAiOptions && (
          <div className="relative">
            <button
              className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
              onClick={() => setShowAiOptions((prev) => !prev)}
            >
              <Sparkles className="w-4 h-4 text-blue-500" />
            </button>
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded shadow-md z-10">
              <ul className="text-sm text-left text-gray-700 dark:text-gray-200">
                <li className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                  Open AI Generator
                </li>
                <li className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                  Continue Writing
                </li>
                <li className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                  Improve Writing
                </li>
                <li className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                  Summarize
                </li>
              </ul>
            </div>
          </div>
        )}
        <Button onClick={handleAdd} disabled={loading}>
          {loading ? (
            <Loader className="w-4 h-4 animate-spin" />
          ) : (
            <>
              <Plus className="w-4 h-4 mr-1" /> Add
            </>
          )}
        </Button>
      </div>

      {filtered.length === 0 ? (
        <p className="text-sm text-gray-500">
          No messages to display. Add one to begin.
        </p>
      ) : (
        filtered.map((msg) => (
          <Card key={msg.id}>
            <CardContent>
              <h3 className="font-semibold">{msg.sender}</h3>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                {msg.summary}
              </p>
              <p className="text-xs text-blue-600 mt-2">{msg.suggestion}</p>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}

// Summary Page
function SummaryPage() {
  const summaries = [
    {
      id: 1,
      title: "Team Chat",
      content: "Meeting moved to Thursday.",
      events: ["Project deadline: 2025-06-12"],
    },
    {
      id: 2,
      title: "Client Group",
      content: "New client feedback received.",
      events: ["Review notes suggested"],
    },
  ];
  return (
    <div className="p-4 max-w-3xl mx-auto space-y-4">
      <h2 className="text-xl font-semibold flex items-center gap-2">
        <Sparkles className="w-5 h-5" /> Smart Summary
      </h2>
      {summaries.map((s) => (
        <Card key={s.id} className="bg-blue-50 dark:bg-blue-900">
          <CardContent>
            <h3 className="font-bold">{s.title}</h3>
            <p className="text-sm text-gray-700 dark:text-white">{s.content}</p>
            <ul className="text-xs list-disc pl-4 mt-2">
              {s.events.map((e, i) => (
                <li key={i}>{e}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function CalendarPage() {
  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-xl font-bold mb-4 flex items-center gap-2">
        <Calendar className="w-5 h-5" /> Calendar
      </h1>
      <Card>
        <CardContent>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            This is a placeholder for the calendar.
          </p>
          <div className="grid grid-cols-7 gap-2 mt-4">
            {[...Array(28)].map((_, i) => (
              <div
                key={i}
                className="h-20 border rounded flex items-center justify-center dark:bg-gray-800"
              >
                {i + 1}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function ProfilePage() {
  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-xl font-bold mb-4 flex items-center gap-2">
        <User className="w-5 h-5" /> Profile
      </h1>
      <p className="text-sm text-gray-600 dark:text-gray-300">
        Edit your personal preferences here.
      </p>
    </div>
  );
}

function SettingsPage() {
  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-xl font-bold mb-4 flex items-center gap-2">
        <Settings className="w-5 h-5" /> Settings
      </h1>
      <p className="text-sm text-gray-600 dark:text-gray-300">
        Application settings and configurations will be added here.
      </p>
    </div>
  );
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
