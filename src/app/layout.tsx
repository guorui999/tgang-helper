import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { Noto_Sans_SC } from 'next/font/google';
import './globals.css';
import NavigationBar from '@/components/NavigationBar';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const notoSansSC = Noto_Sans_SC({
  variable: '--font-noto-sans-sc',
  subsets: ['latin', 'vietnamese'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'tgang-helper | 提肛助手',
  description: '科学盆底肌训练 — 凯格尔运动助手',
  manifest: '/manifest.json',
  icons: {
    icon: '/icons/192.png',
    apple: '/icons/152.png',
  },
  appleWebApp: {
    capable: true,
    title: '提肛助手',
    statusBarStyle: 'default',
  },
  other: {
    'mobile-web-app-capable': 'yes',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#4CAF50',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN" className={`${geistSans.variable} ${geistMono.variable} ${notoSansSC.variable}`}>
      <head>
        <link rel="apple-touch-icon" href="/icons/152.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-title" content="提肛助手" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="application-name" content="提肛助手" />
      </head>
      <body className="pb-16 min-h-screen">
        <main className="max-w-lg mx-auto px-4 pt-4 pb-4">
          {children}
        </main>
        <NavigationBar />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js');
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
