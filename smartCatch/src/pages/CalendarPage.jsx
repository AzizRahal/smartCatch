import React, { useState } from "react";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";

const Card = ({ children }) => (
  <div className="rounded-xl border shadow p-4 bg-white dark:bg-gray-900">{children}</div>
);
const CardContent = ({ children }) => <div>{children}</div>;

const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const today = new Date();

  const [events, setEvents] = useState({});
  const [selectedDay, setSelectedDay] = useState(null);
  const [newEvent, setNewEvent] = useState("");

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const days = Array.from({ length: firstDay }, () => null).concat(
    Array.from({ length: daysInMonth }, (_, i) => i + 1)
  );

  const isToday = (day) =>
    day &&
    day === today.getDate() &&
    month === today.getMonth() &&
    year === today.getFullYear();

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const handleDayClick = (day) => {
    setSelectedDay(day);
    setNewEvent(events[day] || "");
  };

  const saveEvent = () => {
    if (selectedDay !== null) {
      setEvents((prev) => ({ ...prev, [selectedDay]: newEvent }));
      setSelectedDay(null);
      setNewEvent("");
    }
  };

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-xl font-bold mb-4 flex items-center gap-2">
        <CalendarIcon className="w-5 h-5" /> Calendar
      </h1>

      <Card>
        <CardContent>
          <div className="flex items-center justify-between mb-2">
            <button
              onClick={prevMonth}
              className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              <ChevronLeft />
            </button>
            <h2 className="text-lg font-semibold">
              {currentDate.toLocaleString("default", {
                month: "long",
                year: "numeric",
              })}
            </h2>
            <button
              onClick={nextMonth}
              className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              <ChevronRight />
            </button>
          </div>

          {/* Weekday headers */}
          <div className="grid grid-cols-7 gap-2 text-center text-sm font-medium text-gray-500 dark:text-gray-400">
            {daysOfWeek.map((day) => (
              <div key={day}>{day}</div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-2 mt-2 text-center text-sm">
            {days.map((day, i) => (
              <div
                key={i}
                onClick={() => day && handleDayClick(day)}
                className={`h-20 flex flex-col items-center justify-center rounded border transition-all ${
                  day
                    ? isToday(day)
                      ? "bg-blue-500 text-white font-bold"
                      : "dark:bg-gray-800 bg-gray-50 hover:bg-blue-100 cursor-pointer"
                    : "bg-transparent border-none"
                }`}
              >
                <span>{day || ""}</span>
                {events[day] && (
                  <small className="text-xs text-gray-600 dark:text-gray-300 truncate max-w-full">
                    {events[day]}
                  </small>
                )}
              </div>
            ))}
          </div>

          {/* Event editor */}
          {selectedDay !== null && (
            <div className="mt-4 p-4 border rounded bg-gray-100 dark:bg-gray-800">
              <h3 className="font-semibold mb-2">
                Event for {selectedDay}{" "}
                {currentDate.toLocaleString("default", {
                  month: "long",
                  year: "numeric",
                })}
              </h3>
              <textarea
                className="w-full p-2 border rounded resize-none dark:bg-gray-700 dark:text-white"
                rows={3}
                value={newEvent}
                onChange={(e) => setNewEvent(e.target.value)}
              />
              <div className="mt-2 flex gap-2 justify-end">
                <button
                  onClick={() => {
                    setSelectedDay(null);
                    setNewEvent("");
                  }}
                  className="px-4 py-2 rounded border hover:bg-gray-200 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  onClick={saveEvent}
                  className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600"
                >
                  Save
                </button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
