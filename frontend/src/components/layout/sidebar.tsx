"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  ArrowDownToLine,
  ArrowUpFromLine,
  History,
  Layers,
  Wrench,
  Link2,
  Zap,
  Settings,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SettingsDialog } from "@/components/settings-dialog";

const sidebarNavItems = [
  {
    title: "Overview",
    href: "/",
    icon: Home,
  },
  {
    title: "Receive",
    href: "/receive",
    icon: ArrowDownToLine,
  },
  {
    title: "Send",
    href: "/send",
    icon: ArrowUpFromLine,
  },
  {
    title: "Payments",
    href: "/payments",
    icon: History,
  },
  {
    title: "Channels",
    href: "/channels",
    icon: Layers,
  },
  {
    title: "Tools",
    href: "/tools",
    icon: Wrench,
  },
  {
    title: "LNURL",
    href: "/lnurl",
    icon: Link2,
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);

  // Persist state in localStorage
  useEffect(() => {
    const saved = localStorage.getItem("sidebar-expanded");
    if (saved !== null) {
      setExpanded(saved === "true");
    }
  }, []);

  const toggleExpanded = () => {
    const newValue = !expanded;
    setExpanded(newValue);
    localStorage.setItem("sidebar-expanded", String(newValue));
  };

  return (
    <>
      <aside
        className={cn(
          "warm-sidebar relative flex h-full flex-col py-6 transition-all duration-300 ease-out",
          expanded ? "w-[220px] px-4" : "w-[88px] items-center"
        )}
      >
        {/* Logo & Brand */}
        <div className={cn("mb-8", expanded ? "px-2" : "")}>
          <div className={cn("flex items-center gap-3", expanded ? "" : "justify-center")}>
            <div className="relative flex-shrink-0">
              <div className="icon-circle !w-12 !h-12 !bg-gradient-to-br !from-primary/20 !to-accent/20">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <div className="absolute inset-0 rounded-full bg-primary/20 blur-xl -z-10" />
            </div>
            {expanded && (
              <div className="overflow-hidden">
                <h1 className="font-bold text-lg tracking-tight whitespace-nowrap">Phoenixd</h1>
                <p className="text-xs text-muted-foreground whitespace-nowrap">Dashboard</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className={cn("flex flex-1 flex-col gap-1.5", expanded ? "" : "items-center")}>
          {sidebarNavItems.map((item) => {
            const isActive = pathname === item.href;

            return (
              <Link key={item.href} href={item.href} title={expanded ? undefined : item.title}>
                <div
                  className={cn(
                    "group flex items-center gap-3 transition-all duration-200",
                    expanded
                      ? cn(
                          "px-3 py-2.5 rounded-xl",
                          isActive
                            ? "bg-primary text-white shadow-lg shadow-primary/20"
                            : "hover:bg-black/5 dark:hover:bg-white/5 text-muted-foreground hover:text-foreground"
                        )
                      : cn(
                          "icon-circle",
                          isActive && "active"
                        )
                  )}
                >
                  <item.icon
                    className={cn(
                      "h-5 w-5 flex-shrink-0 transition-all duration-200",
                      isActive
                        ? "text-white"
                        : "text-muted-foreground group-hover:text-foreground"
                    )}
                  />
                  {expanded && (
                    <span
                      className={cn(
                        "text-sm font-medium whitespace-nowrap transition-colors",
                        isActive ? "text-white" : ""
                      )}
                    >
                      {item.title}
                    </span>
                  )}
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div
          className={cn(
            "flex flex-col gap-2 pt-6 border-t border-black/5 dark:border-white/5",
            expanded ? "" : "items-center"
          )}
        >
          {/* Settings Button */}
          <button
            onClick={() => setSettingsOpen(true)}
            className={cn(
              "group flex items-center gap-3 transition-all duration-200",
              expanded
                ? "px-3 py-2.5 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 text-muted-foreground hover:text-foreground"
                : "icon-circle"
            )}
            title={expanded ? undefined : "Settings"}
          >
            <Settings className="h-5 w-5 flex-shrink-0 text-muted-foreground group-hover:text-foreground transition-colors" />
            {expanded && (
              <span className="text-sm font-medium whitespace-nowrap">Settings</span>
            )}
          </button>

          {/* Network Indicator */}
          <div
            className={cn(
              "mt-3 flex items-center gap-2",
              expanded ? "px-3 py-2" : "flex-col gap-1"
            )}
          >
            <div className="h-3 w-3 rounded-full bg-bitcoin shadow-[0_0_10px_hsl(var(--bitcoin))] flex-shrink-0" />
            <span
              className={cn(
                "font-medium uppercase tracking-wider text-muted-foreground",
                expanded ? "text-xs" : "text-[9px]"
              )}
            >
              {expanded ? "Mainnet" : "Main"}
            </span>
          </div>

          {/* Expand/Collapse Button */}
          <button
            onClick={toggleExpanded}
            className={cn(
              "mt-2 flex items-center justify-center gap-2 transition-all duration-200",
              expanded
                ? "px-3 py-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 text-muted-foreground hover:text-foreground w-full"
                : "icon-circle !w-10 !h-10"
            )}
            title={expanded ? "Collapse sidebar" : "Expand sidebar"}
          >
            {expanded ? (
              <>
                <ChevronLeft className="h-4 w-4" />
                <span className="text-xs font-medium">Collapse</span>
              </>
            ) : (
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            )}
          </button>
        </div>
      </aside>

      {/* Settings Dialog */}
      <SettingsDialog open={settingsOpen} onOpenChange={setSettingsOpen} />
    </>
  );
}
