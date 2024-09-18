import Head from 'next/head';
import dynamic from 'next/dynamic';

const Stage1Client = dynamic(() => import('./Stage1Client'), { ssr: false });

export const metadata = {
  title: '鼻毛ゲーム - ステージ1',
  description: '鼻毛ゲームのステージ1をお楽しみください。',
  openGraph: {
    url: 'https://hanage.vercel.app',
    type: 'website',
    images: [
      {
        url: 'https://hanage.vercel.app/ogp-image.png',
        width: 1200,
        height: 630,
        alt: '鼻毛ゲーム OGP画像',
      },
    ],
    title: '鼻毛ゲーム - ステージ1', // 追加
    description: '鼻毛ゲームのステージ1をお楽しみください。' // 追加
  },
  twitter: {
    card: 'summary_large_image',
    title: '鼻毛ゲーム - ステージ1',
    description: '鼻毛ゲームのステージ1をお楽しみください。',
    images: ['https://hanage.vercel.app/twitter-card.png'],
  },
};

export default function Page() {
  return (
    <>
      <Head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
        <meta property="og:title" content={metadata.openGraph.title || metadata.title} />
        <meta property="og:description" content={metadata.openGraph.description || metadata.description} />
        <meta property="og:url" content={metadata.openGraph.url} />
        <meta property="og:type" content={metadata.openGraph.type} />
        <meta property="og:image" content={metadata.openGraph.images[0].url} />
        <meta property="og:image:width" content={metadata.openGraph.images[0].width} />
        <meta property="og:image:height" content={metadata.openGraph.images[0].height} />
        <meta property="og:image:alt" content={metadata.openGraph.images[0].alt} />
        <meta name="twitter:card" content={metadata.twitter.card} />
        <meta name="twitter:title" content={metadata.twitter.title} />
        <meta name="twitter:description" content={metadata.twitter.description} />
        <meta name="twitter:image" content={metadata.twitter.images[0]} />
      </Head>
      <Stage1Client />
    </>
  );
}
