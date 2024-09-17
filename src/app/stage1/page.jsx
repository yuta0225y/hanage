export const metadata = {
  title: '',
  description: '',
  openGraph: {
    url: 'https://hanage.vercel.app/stage1',
    type: 'website',
    images: [
      {
        url: 'https://hanage.vercel.app/ogp-image.png',
        width: 1200,
        height: 630,
        alt: '鼻毛ゲーム OGP画像',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '',
    description: '',
    images: ['https://hanage.vercel.app/twitter-card.png'],
  },
};

// クライアントコンポーネントをインポート
import Stage1Client from './Stage1Client';

export default function Page() {
  return <Stage1Client />;
}