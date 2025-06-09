"use client";

import "./globals.css";

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {

  return (
    <html lang="en">
      <body className="relative min-h-screen bg-gray-100 text-gray-900">
        
        <main className="">
          {children}
        </main>

      </body>
    </html>
  );
}
