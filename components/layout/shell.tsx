import { MainNav } from "./main-nav";
import { UserNav } from "./user-nav";

interface ShellProps {
  children: React.ReactNode;
  user?: {
    email?: string;
    fullName?: string;
    role?: "admin" | "manager" | "cashier";
  };
}

export function Shell({ children, user }: ShellProps) {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="hidden md:flex md:flex-col md:w-64 md:fixed md:inset-y-0 bg-white border-r">
        <div className="flex-1 flex flex-col min-h-0">
          <div className="flex items-center h-16 flex-shrink-0 px-4 border-b">
            <h1 className="text-xl font-bold">POS System</h1>
          </div>
          <div className="flex-1 flex flex-col overflow-y-auto pt-5 pb-4">
            <MainNav userRole={user?.role} />
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="md:pl-64 flex flex-col flex-1">
        <div className="sticky top-0 z-10 flex-shrink-0 h-16 bg-white border-b">
          <div className="flex items-center justify-between px-4 h-full">
            <div />
            <UserNav user={user} />
          </div>
        </div>
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}