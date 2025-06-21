// Firebase + App + UI (Self-contained components)
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

function MessagesPage() {
  const [search, setSearch] = useState("");
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

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
      <div className="flex gap-2">
        <Input
          placeholder="Paste message here..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
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
  // Calendar data matching your example
  const calendarData = [
    { date: 1, day: 'SUN', activities: ['Design'] },
    { date: 2, day: 'MON', activities: ['Development', 'Edit file'] },
    { date: 3, day: 'TUE', activities: ['Development', 'Note taking'] },
    { date: 4, day: 'WED', activities: ['Freebie'] },
    { date: 5, day: 'THUR', activities: ['Note taking'] },
    { date: 8, day: 'SUN', activities: ['Design'] },
    { date: 9, day: 'MON', activities: ['Blog'] },
    { date: 10, day: 'TUE', activities: ['Design', 'Note taking'] },
    { date: 11, day: 'WED', activities: ['Development'] },
    { date: 12, day: 'THUR', activities: ['Edit file'] },
    { date: 15, day: 'SUN', activities: [] },
    { date: 16, day: 'MON', activities: [] },
    { date: 17, day: 'TUE', activities: [] },
    { date: 18, day: 'WED', activities: [] },
    { date: 19, day: 'THUR', activities: [] }
  ];

  return (
    <div className="p-4 max-w-3xl mx-auto space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold flex items-center gap-2">
          <Calendar className="w-5 h-5" /> Content Calendar with Auto layout
        </h1>
        <span className="text-sm text-gray-500">25K+ used</span>
      </div>
      
      <Card>
        <CardContent className="p-4">
          {/* Day headers */}
          <div className="grid grid-cols-5 gap-2 mb-2">
            {['SUN', 'MON', 'TUE', 'WED', 'THUR'].map((day) => (
              <div key={day} className="text-center font-medium text-sm py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar days */}
          <div className="grid grid-cols-5 gap-2">
            {calendarData.map((day) => (
              <div 
                key={day.date} 
                className="border rounded-md p-2 min-h-24 dark:bg-gray-800"
              >
                <div className="font-bold text-sm mb-1">{day.date}</div>
                <div className="space-y-1">
                  {day.activities.map((activity, index) => (
                    <div 
                      key={index}
                      className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900 rounded"
                    >
                      {activity}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function App() {
  useDarkMode();
  return (
    <Router>
      <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white pb-16">
        <Routes>
          <Route path="/" element={<SummaryPage />} />
          <Route path="/messages" element={<MessagesPage />} />
          <Route path="/calendar" element={<CalendarPage />} />
        
        </Routes>
        <nav className="fixed bottom-0 w-full flex justify-around border-t bg-white dark:bg-black py-2">
          <Link to="/messages" className="text-xs text-center">
            <MessageSquare className="h-5 w-5" />
            Messages
          </Link>
          <Link to="/calendar" className="text-xs text-center">
            <Calendar className="h-5 w-5" />
            Calendar
          </Link>
          <Link to="/" className="text-xs text-center">
            <Sparkles className="h-5 w-5" />
            Summary
          </Link>
          
        </nav>
      </div>
    </Router>
  );
}

export default App;
