// src/app/stage1/page.jsx

// メタデータの設定
export const metadata = {
  title: '鼻毛ゲーム - 綿棒チャレンジ',
  description: '綿棒を使って鼻の穴に挑戦！タイミングが鍵です。',
  openGraph: {
    title: '鼻毛ゲーム - 綿棒チャレンジ',
    description: '綿棒を使って鼻の穴に挑戦！タイミングが鍵です。',
    url: 'https://hanage.vercel.app/stage1', // 実際のURLに置き換えてください
    type: 'website',
    images: [
      {
        url: '/ogp-image.png',
        width: 1200,
        height: 630,
        alt: '鼻毛ゲーム OGP画像',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/twitter-card.png'],
  },
};

// クライアントコンポーネントをインポート
import Stage1Client from './Stage1Client';

export default function Page() {
  return <Stage1Client />;
}
