import '../styles/globals.css';

export const metadata = {
  title: 'Real-Time Chat with Translation',
  description: 'A chat app for international trade with real-time translation.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <main>{children}</main>
      </body>
    </html>
  );
}
