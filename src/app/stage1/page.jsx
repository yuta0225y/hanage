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
    const minX = -100; // 中央から左に125ピクセル
    const maxX = 100;  // 中央から右に125ピクセル

    const handleMovement = () => {
      setPositionX((prevX) => {
        const nextX = prevX + step * direction;

        // 指定された範囲内で方向を反転させる
        if (nextX > maxX) {
          setDirection(-1); // 右端に達したら左に反転
          return maxX; // 綿棒を右端に留める
        } else if (nextX < minX) {
          setDirection(1); // 左端に達したら右に反転
          return minX; // 綿棒を左端に留める
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
    <div className="flex flex-col items-center justify-center h-screen bg-white relative">
      {/* h1タグ */}
      <h1 className="text-5xl text-center mt-20 mb-8">いれろ！！</h1>

      {/* 鼻の画像 */}
      <div className="mb-16"> {/* 鼻の画像とh1の間に50px、綿棒と鼻の間に100px */}
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
        style={{
          transform: `translateX(${positionX}px) translateY(${positionY}px)`,
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
