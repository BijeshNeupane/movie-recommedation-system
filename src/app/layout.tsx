import { Providers } from "@/components/Providers";
import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata = {
  title: "My Next App",
  description: "Awesome PWA-enabled app",
  themeColor: "#00a79e",
  icons: {
    icon: "/icons/icon-192x192.png",
    apple: "/icons/icon-192x192.png",
  },
  manifest: "/manifest.json",
};


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Navbar />
          <main className="container mx-auto p-4">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
