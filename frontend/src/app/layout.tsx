import './globals.css';

export const metadata = {
  title: 'TaskMastery - Professional Task Management',
  description: 'Transform your productivity with our cutting-edge task management platform',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased bg-gradient-to-br from-gray-900 via-emerald-900/10 to-black">
        {children}
      </body>
    </html>
  );
}