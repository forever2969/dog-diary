import type {Metadata} from "next";
import './globals.css';
import LogoutButton from '@/components/LogoutButton';
import { createClient } from '@/lib/supabase-server';

export const metadata: Metadata = {
    title: '퐁이 일지',
    description: '퐁이 케어 캘린더 기록',
    appleWebApp: {
        capable: true,
        title: '퐁이 일지',
        statusBarStyle: 'default',
    },
};

export const viewport = {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    themeColor: '#fbbf24',
};

export default async function RootLayout({
    children
}: {
   children: React.ReactNode;
}) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    return (
        <html lang="ko">
            <head>
                <link rel="apple-touch-icon" href="/pong.jpeg" />
            </head>
            <body className="bg-amber-50 min-h-screen">
                <header className="bg-white border-b border-amber-100 px-4 py-3 sticky top-0 z-10 flex items-center justify-between">
                    <h1 className="text-lg font-bold text-amber-800">퐁이 일지</h1>
                    {user ? <LogoutButton /> : null}
                </header>

                <main className="max-w-lg mx-auto px-4 py-6">
                    {children}
                </main>
            </body>
        </html>
    )
}