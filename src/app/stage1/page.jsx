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
  const [noseRect, setNoseRect] = useState(null); // 鼻の座標範囲
  const [rightNoseHole, setRightNoseHole] = useState(null); // 右の鼻の穴の範囲
  const [leftNoseHole, setLeftNoseHole] = useState(null); // 左の鼻の穴の範囲

  const noseRef = useRef(null);
  const cottonBudRef = useRef(null);

  // 綿棒の動き
  useEffect(() => {
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

  // 鼻の位置情報を取得し、鼻の穴の範囲を計算する
  useEffect(() => {
    if (noseRef.current) {
      const noseRect = noseRef.current.getBoundingClientRect();
      setNoseRect(noseRect);

      // 鼻の穴の相対座標を設定（ここで微調整可能）
      const rightNoseHole = { x1: noseRect.left + 30, x2: noseRect.left + 90, y1: noseRect.top + 140, y2: noseRect.top + 200 };
      const leftNoseHole = { x1: noseRect.left + 110, x2: noseRect.left + 170, y1: noseRect.top + 140, y2: noseRect.top + 200 };

      setRightNoseHole(rightNoseHole);
      setLeftNoseHole(leftNoseHole);
    }
  }, []);

  // 綿棒の衝突判定
  useEffect(() => {
    if (clicked) {
      checkCollision();
    }
  }, [positionX, positionY, clicked]);

  const checkCollision = () => {
    if (cottonBudRef.current && noseRect && rightNoseHole && leftNoseHole) {
      const cottonBudRect = cottonBudRef.current.getBoundingClientRect();

      // 綿棒の最上部位置を計算
      const cottonBudTopX = cottonBudRect.left + cottonBudRect.width / 2; // X座標の中心
      const cottonBudTopY = cottonBudRect.top; // Y座標の最上部

      const isInRightNoseHole =
        cottonBudTopX >= rightNoseHole.x1 &&
        cottonBudTopX <= rightNoseHole.x2 &&
        cottonBudTopY >= rightNoseHole.y1 &&
        cottonBudTopY <= rightNoseHole.y2;

      const isInLeftNoseHole =
        cottonBudTopX >= leftNoseHole.x1 &&
        cottonBudTopX <= leftNoseHole.x2 &&
        cottonBudTopY >= leftNoseHole.y1 &&
        cottonBudTopY <= leftNoseHole.y2;

      if (isInRightNoseHole || isInLeftNoseHole) {
        setStatus('成功！');
      } else {
        setStatus('失敗。');
      }
    }
  };

  const handleTouch = () => {
    if (!clicked) {
      setPositionY((prev) => prev - 115);
      setClicked(true);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-white relative" onClick={handleTouch}>
      <h1 className="text-5xl text-center mt-20 mb-8">いれろ！！</h1>
      <p className="text-2xl">{status}</p>

      <div className="mb-16 z-10 relative" ref={noseRef}>
        <Image src={noseImage} alt="Nose" width={200} height={200} priority />
        
        {/* デバッグ用に鼻の穴の範囲を表示 */}
        {rightNoseHole && (
          <div
            style={{
              position: 'absolute',
              top: `${rightNoseHole.y1 - noseRect.top}px`,
              left: `${rightNoseHole.x1 - noseRect.left}px`,
              width: `${rightNoseHole.x2 - rightNoseHole.x1}px`,
              height: `${rightNoseHole.y2 - rightNoseHole.y1}px`,
              backgroundColor: 'rgba(255, 0, 0, 0.3)',
              zIndex: 1000,
            }}
          ></div>
        )}
        {leftNoseHole && (
          <div
            style={{
              position: 'absolute',
              top: `${leftNoseHole.y1 - noseRect.top}px`,
              left: `${leftNoseHole.x1 - noseRect.left}px`,
              width: `${leftNoseHole.x2 - leftNoseHole.x1}px`,
              height: `${leftNoseHole.y2 - leftNoseHole.y1}px`,
              backgroundColor: 'rgba(0, 0, 255, 0.3)',
              zIndex: 1000,
            }}
          ></div>
        )}
      </div>

      <div
        className="relative z-0"
        style={{ transform: `translateX(${positionX}px) translateY(${positionY}px)` }}
        ref={cottonBudRef}
        onClick={(e) => e.stopPropagation()} // 綿棒がクリックされたときのバブルを防ぐ
      >
        <Image src={cottonBudImage} alt="Cotton Bud" width={25} height={50} style={{ width: 'auto', height: 'auto' }} />
      </div>
    </div>
  );
}
