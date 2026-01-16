import type { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary-50 via-background to-primary-100 p-4 dark:from-primary-950 dark:via-background dark:to-primary-900">
      <div className="w-full max-w-md animate-slide-up">{children}</div>
    </div>
  );
}
