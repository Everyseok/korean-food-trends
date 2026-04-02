import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '한국 푸드 트렌드',
  description: '지금 가장 핫한 한국 음식 트렌드와 판매점을 한 곳에서.',
  openGraph: {
    title: '한국 푸드 트렌드',
    description: '지금 가장 핫한 한국 음식 트렌드와 판매점을 한 곳에서.',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className="bg-[#F5F5F7] min-h-screen font-sans text-[#1D1D1F]">
        {children}
      </body>
    </html>
  );
}
