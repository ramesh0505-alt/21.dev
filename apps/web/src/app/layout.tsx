import type { Metadata } from 'next';
import './globals.css';
import { AppShell } from '@/components/layout/app-shell';

export const metadata: Metadata = {
  title: 'DevUI Studio | Personal UI Component Library',
  description: 'Private, local-first UI component discovery, playground, and reuse system inspired by 21st.dev',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-background text-foreground antialiased selection:bg-emerald-500/20 selection:text-emerald-300">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
