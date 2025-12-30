'use client';

import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

export interface TabItem {
  id: string;
  label: string;
  icon: LucideIcon;
  count?: number;
  activeClassName?: string;
}

interface PageTabsProps<T extends string> {
  tabs: readonly TabItem[] | TabItem[];
  activeTab: T;
  onTabChange: (tab: T) => void;
  className?: string;
}

export function PageTabs<T extends string>({
  tabs,
  activeTab,
  onTabChange,
  className,
}: PageTabsProps<T>) {
  return (
    <div className={cn('overflow-x-auto scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0', className)}>
      <div className="glass-card rounded-xl md:rounded-2xl p-1 md:p-1.5 inline-flex min-w-max">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          const activeStyle =
            tab.activeClassName || 'bg-primary text-primary-foreground shadow-lg shadow-primary/25';

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id as T)}
              className={cn(
                'flex items-center gap-1.5 md:gap-2 px-3 md:px-5 py-2 md:py-2.5 rounded-lg md:rounded-xl font-medium transition-all text-xs md:text-sm whitespace-nowrap',
                isActive
                  ? activeStyle
                  : 'text-muted-foreground hover:text-foreground hover:bg-black/5 dark:hover:bg-white/5'
              )}
            >
              <Icon className="h-3.5 w-3.5 md:h-4 md:w-4" />
              {tab.label}
              {tab.count !== undefined && (
                <span className="ml-1 text-xs opacity-80">({tab.count})</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
