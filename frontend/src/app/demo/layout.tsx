/* import { Sidebar } from '@/components/layout/sidebar';
import { TopNav } from '@/components/layout/top-nav'; */

export default function DemoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <main>
        {children}
      </main>
    </div>
  );
}