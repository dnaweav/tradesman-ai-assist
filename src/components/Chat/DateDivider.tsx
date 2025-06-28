
import * as React from "react";

interface DateDividerProps {
  date: string;
}

export function DateDivider({ date }: DateDividerProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString([], {
        weekday: 'long',
        month: 'short',
        day: 'numeric'
      });
    }
  };

  return (
    <div className="flex items-center justify-center my-4">
      <div className="flex-1 border-t border-gray-200"></div>
      <div className="px-4 text-xs text-gray-500 bg-gray-50 rounded-full py-1">
        {formatDate(date)}
      </div>
      <div className="flex-1 border-t border-gray-200"></div>
    </div>
  );
}
