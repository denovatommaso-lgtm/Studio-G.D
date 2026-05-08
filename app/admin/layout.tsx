export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#111624] text-[#e8e4d8] font-sans antialiased">
      {children}
    </div>
  )
}
