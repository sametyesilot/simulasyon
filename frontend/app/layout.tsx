import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: 'EVCS Anomaly Platform',
    description: 'Simulation for EV Charging Station Anomalies',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <body className={inter.className + " min-h-screen bg-gray-50 dark:bg-gray-900"}>
                {children}
            </body>
        </html>
    )
}
