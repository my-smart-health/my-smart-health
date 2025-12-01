'use client';

import { useRouter } from 'next/navigation';
import { RefreshCw } from 'lucide-react';
import { useState } from 'react';

export default function RefreshNotifications() {
  const router = useRouter();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    router.refresh();
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  return (
    <button
      onClick={handleRefresh}
      disabled={isRefreshing}
      className="btn btn-outline btn-sm gap-2"
      title="Benachrichtigungen aktualisieren"
    >
      <RefreshCw size={16} className={isRefreshing ? 'animate-spin' : ''} />
      Aktualisieren
    </button>
  );
}
