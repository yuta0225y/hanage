import localFont from "next/font/local";
import Head from 'next/head';
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: "鼻毛エクスプロージョン",
  description: "爆破させずに鼻毛をぬいてみよ！",
  openGraph: {
    title: "鼻毛エクスプロージョン",
    description: "爆破させずに鼻毛をぬいてみよ！",
    images: [
      {
        url: "https://hanage.vercel.app/ogp-image.png",
        width: 1200,
        height: 630,
      },
    ],
    url: "https://hanage.vercel.app/",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "鼻毛エクスプロージョン",
    description: "爆破させずに鼻毛をぬいてみよ！",
    images: [
      "https://hanage.vercel.app/ogp-image.png",
    ],
    url: "https://hanage.vercel.app/",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="ja">
      <Head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
        <meta property="og:title" content={metadata.openGraph.title} />
        <meta property="og:description" content={metadata.openGraph.description} />
        <meta property="og:url" content={metadata.openGraph.url} />
        <meta property="og:type" content={metadata.openGraph.type} />
        <meta property="og:image" content={metadata.openGraph.images[0].url} />
        <meta property="og:image:width" content={metadata.openGraph.images[0].width} />
        <meta property="og:image:height" content={metadata.openGraph.images[0].height} />
        <meta property="og:image:alt" content={metadata.openGraph.images[0].alt} />
        
        {/* Twitterカードメタタグ */}
        <meta name="twitter:card" content={metadata.twitter.card} />
        <meta name="twitter:title" content={metadata.twitter.title} />
        <meta name="twitter:description" content={metadata.twitter.description} />
        <meta name="twitter:image" content={metadata.twitter.images[0]} />
      </Head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
