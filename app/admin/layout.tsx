export const metadata = {
  title: 'Admin Dashboard - Rizwan Construction',
  description: 'Admin panel for managing construction projects and content',
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-stone-50">
      {children}
    </div>
  )
}