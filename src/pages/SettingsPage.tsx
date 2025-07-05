import { Settings } from "lucide-react";

export default function SettingsPage() {
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
