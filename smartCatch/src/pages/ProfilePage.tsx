import { User } from "lucide-react";

export default function ProfilePage() {
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
