import React from 'react';
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import Script from 'next/script';
import './globals.css';
import configuration from '@/configuration/configuration';

const geistSans = Geist({
    variable: '--font-geist-sans',
    subsets: ['latin'],
});

const geistMono = Geist_Mono({
    variable: '--font-geist-mono',
    subsets: ['latin'],
});

const projectName = configuration.app.name;
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://shrnkly.com';
const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'support@shrnkly.com';

export const metadata: Metadata = {
    metadataBase: new URL(baseUrl),
    title: {
        default: `${projectName} – Smart URL Shortener, Text Sharing & QR Code Generator`,
        template: `%s | ${projectName}`,
    },
    description: 'Free URL shortener with analytics, secure text sharing, and custom QR codes. Create trackable links, share code snippets, and generate QR codes in seconds. No signup required.',
    keywords: [
        'URL shortener',
        'link shortener',
        'QR code generator',
        'text sharing',
        'code sharing',
        'analytics',
        'track links',
        'custom QR codes',
        'free URL shortener',
        'secure text sharing',
        'pastebin alternative',
        'link management',
    ],
    authors: [{ name: projectName }],
    creator: projectName,
    publisher: projectName,
    formatDetection: {
        email: false,
        address: false,
        telephone: false,
    },
    openGraph: {
        type: 'website',
        locale: 'en_US',
        url: baseUrl,
        title: projectName,
        description: 'Free URL shortener with analytics, secure text sharing, and custom QR codes.',
        siteName: projectName,
        images: [
            {
                url: `${baseUrl}/og-image.png`,
                width: 1200,
                height: 630,
                alt: `${projectName} - Smart URL Shortener`,
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: projectName,
        description: 'Free URL shortener with analytics, secure text sharing, and custom QR codes.',
        images: [`${baseUrl}/twitter-image.png`],
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
    alternates: {
        canonical: baseUrl,
        languages: {
            'en-US': `${baseUrl}/en`,
            'es-ES': `${baseUrl}/es`,
            'fr-FR': `${baseUrl}/fr`,
            'de-DE': `${baseUrl}/de`,
            'ar-SA': `${baseUrl}/ar`,
            'zh-CN': `${baseUrl}/zh`,
            'hi-IN': `${baseUrl}/hi`,
            'ur-PK': `${baseUrl}/ur`,
            'bn-BD': `${baseUrl}/bn`,
        },
    },
    verification: {
        other: {
            'contact': contactEmail,
        },
    },
    appleWebApp: {
        capable: true,
        statusBarStyle: 'default',
        title: projectName,
    },
    manifest: `${baseUrl}/manifest.json`,
    icons: {
        icon: '/favicon.ico',
        shortcut: '/favicon-16x16.png',
        apple: '/apple-touch-icon.png',
    },
};

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
            >
                {children}
                <Script
                    id="support-kori-widget"
                    src="https://www.supportkori.com/widget.js"
                    data-id="montasim"
                    data-message="Support montasim"
                    data-color="#FFDD00"
                    data-position="right"
                    strategy="afterInteractive"
                />
            </body>
        </html>
    );
}
