import type { Metadata } from "next";
import { Inter } from "next/font/google";
import ConvexClientProvider from "./ConvexClientProvider";
import { ClerkProvider, useAuth } from "@clerk/clerk-react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import Head from 'next/head';
import "./globals.css";
import Header from "./Header";
import { Toaster } from "@/components/ui_copy/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Documate",
  description: "Compile everything you read online.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Head>
      <link  href="/favicon.ico" />
    </Head>
      <body className={inter.className}>
        <div className="flex flex-col h-screen w-screen bg-black m-0 p-0">
        <ConvexClientProvider>
        <main className="container flex-grow m-0 bg-black p-0">
        {children}
        </main >
        <Toaster />
        </ConvexClientProvider>
        {/* <footer className="flex justify-center items-center">Made with ❤️ and&nbsp;<a href="https://convex.dev" target="_blank">Convex</a></footer> */}
        </div>
        </body>
    </html>
  );
}
