import "./globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning data-grammarly="false">
      <head>
        <link rel="icon" href="/icon.ico" />
      </head>
      <body suppressHydrationWarning >
        {children}
      </body>
    </html>
  );
}
