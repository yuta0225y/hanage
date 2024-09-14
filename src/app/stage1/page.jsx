"use client";
import { useState, useEffect } from 'react';
import Image from 'next/image';

// 画像のURLを定義
const cottonBudImage = '/cotton-bud.png';
const noseImage = '/nose.png';

export default function Stage1() {
  const [positionX, setPositionX] = useState(0); // 綿棒のX座標
  const [positionY, setPositionY] = useState(0); // 綿棒のY座標
  const [direction, setDirection] = useState(1); // 移動方向（1: 右, -1: 左）

  useEffect(() => {
    const moveInterval = 100; // 移動の間隔（ミリ秒）
    const step = 5; // 1回の移動量（ピクセル）
    const cottonBudWidth = 25; // 綿棒の幅

    const handleMovement = () => {
      setPositionX((prevX) => {
        const screenWidth = window.innerWidth; // 画面の幅
        const nextX = prevX + step * direction;

        if (nextX > screenWidth - cottonBudWidth || nextX < 0) {
          setDirection((dir) => -dir); // 端まで来たら方向を反対にする
          return prevX; // 方向を反対にした後は現在の位置を保持
        }
        
        return nextX;
      });
    };

    const intervalId = setInterval(handleMovement, moveInterval);
    
    return () => clearInterval(intervalId);
  }, [direction]);

  // 綿棒をクリックしたらY軸の上に移動
  const handleTouch = () => {
    setPositionY((prev) => prev - 125); // Y軸を上に移動
  };

  return (
    <div className="flex items-center justify-center h-screen bg-white relative">
      {/* 鼻の画像 */}
      <div
        className="absolute"
        style={{ top: '100px' }} // 鼻の画像の位置を固定
      >
        <h1 className="text-5xl text-center mb-4">いれろ！！</h1>
        <Image
          src={noseImage}
          alt="Nose"
          width={200}
          height={200}
          priority // LCPのための優先度指定
        />
      </div>

      {/* 綿棒の画像 */}
      <div
        className="absolute"
        style={{
          transform: `translateX(${positionX}px) translateY(${positionY}px)`,
          top: 'calc(200px + 200px + 10px)', // 鼻の画像の下に綿棒を固定
          left: '50px', // 綿棒の位置を鼻と合わせるために調整
        }}
        onClick={handleTouch}
      >
        <Image
          src={cottonBudImage}
          alt="Cotton Bud"
          width={25}
          height={50}
          style={{ width: 'auto', height: 'auto' }} // アスペクト比を維持
        />
      </div>
    </div>
  );
}
