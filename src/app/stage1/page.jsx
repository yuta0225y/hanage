"use client";
import { useState, useEffect } from 'react'; // useEffectをインポート
import Image from 'next/image';

// 画像のURLを定義
const cottonBudImage = '/cotton-bud.png';
const noseImage = '/nose.png';

export default function Stage1() {
  const [positionX, setPositionX] = useState(0); // 綿棒のX座標
  const [positionY, setPositionY] = useState(0); // 綿棒のY座標
  const [direction, setDirection] = useState(1); // 移動方向

  // 綿棒を左右に動かすアニメーション
  useEffect(() => {
    const interval = setInterval(() => {
      setPositionX((prev) => {
        if (prev >= 100 || prev <= -100) {
          setDirection((dir) => -dir); // 端まで来たら方向を変える
        }
        return prev + direction * 5;
      });
    }, 100);
    
    return () => clearInterval(interval);
  }, [direction]);

  // 綿棒をクリックしたらY軸の上に移動
  const handleTouch = () => {
    setPositionY((prev) => prev - 20); // Y軸を上に移動
  };

  return (
    <div className="flex items-center justify-center h-screen bg-white relative">
      {/* 鼻の画像 */}
      <div className="absolute top-20">
        <h1 className="text-5xl text-center mb-4">いれろ！！</h1>
        <Image src={noseImage} alt="Nose" width={200} height={200} />
      </div>

      {/* 綿棒の画像 */}
      <div
        className="absolute"
        style={{ transform: `translateX(${positionX}px)` }}
        onClick={handleTouch}
      >
        <Image src={cottonBudImage} alt="Cotton Bud" width={50} height={100} />
      </div>
    </div>
  );
}