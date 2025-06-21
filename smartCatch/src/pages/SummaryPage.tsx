import { Sparkles } from "lucide-react";

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

const Card = ({ children, className = "" }) => (
  <div className={`rounded-xl border shadow p-4 ${className}`}>{children}</div>
);
const CardContent = ({ children }) => <div>{children}</div>;

export default function SummaryPage() {
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