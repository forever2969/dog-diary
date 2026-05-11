import type {Metadata} from "next";
import './globals.css';
import LogoutButton from '@/components/LogoutButton';
import ServiceWorkerRegister from '@/components/ServiceWorkerRegister';
import ProfileButton from '@/components/ProfileButton';
import SplashScreen from '@/components/SplashScreen';
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
                <link rel="apple-touch-icon" href="/pong.jpeg?v=4" />
                <style>{`html, body { background-color: #fffbeb; }`}</style>
                {/* iPhone SE / 8 */}
                <link rel="apple-touch-startup-image" media="(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2)" href="/splash-screen?w=750&h=1334" />
                {/* iPhone X / XS / 11 Pro */}
                <link rel="apple-touch-startup-image" media="(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3)" href="/splash-screen?w=1125&h=2436" />
                {/* iPhone XR / 11 */}
                <link rel="apple-touch-startup-image" media="(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2)" href="/splash-screen?w=828&h=1792" />
                {/* iPhone XS Max / 11 Pro Max */}
                <link rel="apple-touch-startup-image" media="(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3)" href="/splash-screen?w=1242&h=2688" />
                {/* iPhone 12 / 13 / 14 */}
                <link rel="apple-touch-startup-image" media="(device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3)" href="/splash-screen?w=1170&h=2532" />
                {/* iPhone 12 Pro Max / 13 Pro Max / 14 Plus */}
                <link rel="apple-touch-startup-image" media="(device-width: 428px) and (device-height: 926px) and (-webkit-device-pixel-ratio: 3)" href="/splash-screen?w=1284&h=2778" />
                {/* iPhone 14 Pro / 15 / 15 Pro */}
                <link rel="apple-touch-startup-image" media="(device-width: 393px) and (device-height: 852px) and (-webkit-device-pixel-ratio: 3)" href="/splash-screen?w=1179&h=2556" />
                {/* iPhone 14 Pro Max / 15 Plus / 15 Pro Max */}
                <link rel="apple-touch-startup-image" media="(device-width: 430px) and (device-height: 932px) and (-webkit-device-pixel-ratio: 3)" href="/splash-screen?w=1290&h=2796" />
            </head>
            <body className="bg-amber-50 min-h-screen">
                <header className="bg-white border-b border-amber-100 px-4 py-3 sticky top-0 z-10 flex items-center justify-between">
                    <h1 className="text-lg font-bold text-amber-800">퐁이 일지</h1>
                    {user ? (
                        <div className="flex items-center gap-2">
                            <ProfileButton />
                            <LogoutButton />
                        </div>
                    ) : null}
                </header>

                <SplashScreen />
                <ServiceWorkerRegister />
                <main className="max-w-lg mx-auto px-4 py-6">
                    {children}
                </main>
            </body>
        </html>
    )
}