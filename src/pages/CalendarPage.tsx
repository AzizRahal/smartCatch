import { Calendar } from "lucide-react";

const Card = ({ children }) => (
  <div className="rounded-xl border shadow p-4">{children}</div>
);
const CardContent = ({ children }) => <div>{children}</div>;

export default function CalendarPage() {
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