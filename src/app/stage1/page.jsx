"use client";
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

const cottonBudImage = '/cotton-bud.png';
const noseImage = '/nose.png';

export default function Stage1() {
  const [positionX, setPositionX] = useState(0); // 綿棒のX座標
  const [positionY, setPositionY] = useState(0); // 綿棒のY座標
  const [direction, setDirection] = useState(1); // 移動方向（1: 右, -1: 左）
  const [status, setStatus] = useState(''); // 成功/失敗メッセージ
  const [clicked, setClicked] = useState(false); // 綿棒がクリックされたかどうか

  const noseRef = useRef(null);
  const cottonBudRef = useRef(null);

  useEffect(() => {
    // 綿棒がクリックされていない場合のみ移動処理を実行
    if (!clicked) {
      const moveInterval = 100; // 移動の間隔（ミリ秒）
      const step = 5; // 1回の移動量（ピクセル）
      const minX = -130; // 中央から左に行く距離
      const maxX = 130;  // 中央から右に行く距離

      const handleMovement = () => {
        setPositionX((prevX) => {
          const nextX = prevX + step * direction;

          if (nextX > maxX) {
            setDirection(-1);
            return maxX;
          } else if (nextX < minX) {
            setDirection(1);
            return minX;
          }

          return nextX;
        });
      };

      const intervalId = setInterval(handleMovement, moveInterval);

      return () => clearInterval(intervalId);
    }
  }, [direction, clicked]);

  useEffect(() => {
    if (clicked) {
      checkCollision();
    }
  }, [positionX, positionY, clicked]);

  const checkCollision = () => {
    if (cottonBudRef.current && noseRef.current) {
      const cottonBudRect = cottonBudRef.current.getBoundingClientRect();
      const noseRect = noseRef.current.getBoundingClientRect();

      // 鼻の穴の範囲を設定
      const rightNoseHole = { x1: -70, x2: -15, y: 70 }; // 右の鼻の穴
      const leftNoseHole = { x1: 15, x2: 70, y: 70 }; // 左の鼻の穴

      // 綿棒の位置とサイズを取得
      const cottonBudCenterX = cottonBudRect.left + cottonBudRect.width / 2;
      const cottonBudCenterY = cottonBudRect.top + cottonBudRect.height / 2;

      // 鼻の穴の範囲を鼻の画像の位置に合わせて調整
      const adjustedRightNoseHole = {
        x1: noseRect.left + rightNoseHole.x1,
        x2: noseRect.left + rightNoseHole.x2,
        y: noseRect.top + rightNoseHole.y
      };
      const adjustedLeftNoseHole = {
        x1: noseRect.left + leftNoseHole.x1,
        x2: noseRect.left + leftNoseHole.x2,
        y: noseRect.top + leftNoseHole.y
      };

      // 綿棒の中心位置が鼻の穴の範囲内にあるか確認
      const isInRightNoseHole =
        cottonBudCenterX >= adjustedRightNoseHole.x1 &&
        cottonBudCenterX <= adjustedRightNoseHole.x2 &&
        cottonBudCenterY >= adjustedRightNoseHole.y - cottonBudRect.height / 2 &&
        cottonBudCenterY <= adjustedRightNoseHole.y + cottonBudRect.height / 2;

      const isInLeftNoseHole =
        cottonBudCenterX >= adjustedLeftNoseHole.x1 &&
        cottonBudCenterX <= adjustedLeftNoseHole.x2 &&
        cottonBudCenterY >= adjustedLeftNoseHole.y - cottonBudRect.height / 2 &&
        cottonBudCenterY <= adjustedLeftNoseHole.y + cottonBudRect.height / 2;

      if (isInRightNoseHole || isInLeftNoseHole) {
        setStatus('成功！');
      } else {
        setStatus('失敗。');
      }
    }
  };

  const handleTouch = () => {
    if (!clicked) {
      setPositionY((prev) => prev - 115); // Y軸を上に移動
      setClicked(true); // クリックされたことを記録
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-white relative">
      <h1 className="text-5xl text-center mt-20 mb-8">いれろ！！</h1>
      <p className="text-2xl">{status}</p> {/* 成功/失敗メッセージを表示 */}

      {/* 鼻の画像 */}
      <div className="mb-16 z-10" ref={noseRef}>
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
        ref={cottonBudRef}
        onClick={handleTouch}
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
