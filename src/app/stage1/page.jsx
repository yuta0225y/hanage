"use client";
import { useState, useEffect } from 'react';
import Image from 'next/image';

const cottonBudImage = '/cotton-bud.png';
const noseImage = '/nose.png';

export default function Stage1() {
  const [positionX, setPositionX] = useState(0); // 綿棒のX座標
  const [positionY, setPositionY] = useState(0); // 綿棒のY座標
  const [direction, setDirection] = useState(1); // 移動方向（1: 右, -1: 左）

  useEffect(() => {
    const moveInterval = 100; // 移動の間隔（ミリ秒）
    const step = 5; // 1回の移動量（ピクセル）
    const minX = -80; // 中央から左いく距離
    const maxX = 80;  // 中央から右に行く距離

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
    setPositionY((prev) => prev - 115); // Y軸を上に移動
  };

  return (
    <div
      className="flex flex-col items-center justify-center h-screen bg-white relative"
      onClick={handleTouch} // onClickイベントハンドラを最外部のdivに移動
    >
      <h1 className="text-5xl text-center mt-20 mb-8">いれろ！！</h1>
  
      {/* 鼻の画像 */}
      <div className="mb-16 z-10">
        <Image
          src={noseImage}
          alt="Nose"
          width={200}
          height={200}
          priority
        />
      </div>
  
      {/* 綿棒の画像 */}
      <div
        className="relative z-0"
        style={{
          transform: `translateX(${positionX}px) translateY(${positionY}px)`,
        }}
      >
        <Image
          src={cottonBudImage}
          alt="Cotton Bud"
          width={25}
          height={50}
          style={{ width: 'auto', height: 'auto' }}
        />
      </div>
    </div>
  );
}
