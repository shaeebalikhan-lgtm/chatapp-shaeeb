import "./globals.css";
import { Toaster } from "react-hot-toast";


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>ChatApp</title>
      </head>

      <body className="min-h-full flex flex-col">
        

        {children}

        <Toaster />
      </body>
    </html>
  );
}
