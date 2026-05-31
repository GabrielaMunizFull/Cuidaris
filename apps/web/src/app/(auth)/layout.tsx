export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="flex justify-center mb-8">
          <span className="text-2xl font-bold text-[var(--ink)] tracking-tight">
            Cuidaris
          </span>
        </div>
        {children}
      </div>
    </div>
  );
}
