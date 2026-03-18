import {
  Sidebar
} from '..'

export const MainLayout = ({
  children,
}: {
  children: React.ReactNode
}) => {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-6 bg-muted/40">
        <div className='p-10 rounded bg-white h-[calc(100vh-60px)] w-full'>
          {children}
        </div>
      </main>
    </div>
  )
}
