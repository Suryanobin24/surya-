import './globals.css';

export const metadata = {
  title: 'Zoho KYCFlow',
  description: 'Modern KYC workflow app with OpenAI and ChatAPI integration'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
