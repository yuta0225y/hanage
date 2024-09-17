"use client";
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

const cottonBudImage = '/cotton-bud.png';
const noseImage = '/nose.png';
const hairImage = '/ke.png';  // 毛の画像

export default function Stage1() {
  const [positionX, setPositionX] = useState(0); // 綿棒のX座標
  const [positionY, setPositionY] = useState(50); // 綿棒のY座標
  const [direction, setDirection] = useState(1); // 移動方向（1: 右, -1: 左）
  const [status, setStatus] = useState(''); // 成功/失敗メッセージ
  const [clicked, setClicked] = useState(false); // 綿棒がクリックされたかどうか
  const [noseRect, setNoseRect] = useState(null); // 鼻の座標範囲
  const [rightNoseHole, setRightNoseHole] = useState(null); // 右の鼻の穴の範囲
  const [leftNoseHole, setLeftNoseHole] = useState(null); // 左の鼻の穴の範囲
  const [imageLoaded, setImageLoaded] = useState(false); // 画像がロードされたかどうか
  const [resetting, setResetting] = useState(false); // 成功後にリセット中かどうか
  const [isSuccess, setIsSuccess] = useState(false); // 成功判定が固定されたかどうか
  const [showHair, setShowHair] = useState(false); // 綿棒の先に毛を表示するか

  const noseRef = useRef(null);
  const cottonBudRef = useRef(null);

  // 綿棒の動き
  useEffect(() => {
    if (!clicked && !resetting) {
      const moveInterval = 60; // 移動の間隔（ミリ秒）
      const step = 7; // 1回の移動量（ピクセル）
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
  }, [direction, clicked, resetting]);

  // 鼻の位置情報を取得し、鼻の穴の範囲を計算する
  useEffect(() => {
    if (imageLoaded && noseRef.current) {
      const noseRect = noseRef.current.getBoundingClientRect();
      setNoseRect(noseRect);

      // 鼻の穴の相対座標を設定（ここで微調整可能）
      const rightNoseHole = { x1: noseRect.left + 30, x2: noseRect.left + 90, y1: noseRect.top + 140, y2: noseRect.top + 200 };
      const leftNoseHole = { x1: noseRect.left + 110, x2: noseRect.left + 170, y1: noseRect.top + 140, y2: noseRect.top + 200 };

      setRightNoseHole(rightNoseHole);
      setLeftNoseHole(leftNoseHole);
    }
  }, [imageLoaded]); // 画像がロードされた後に計算を行う

  // 綿棒の衝突判定
  useEffect(() => {
    if (clicked) {
      checkCollision();
    }
  }, [positionX, positionY, clicked]);

  const checkCollision = () => {
    if (isSuccess) return; // 一度成功したら判定を変えない

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
        // setStatus('成功！');
        setIsSuccess(true); // 成功判定を固定
        setShowHair(true);  // 毛を表示する
        handleReset(); // 綿棒を元の位置に戻す処理を呼び出す
      } else {
        // setStatus('失敗。');
        setClicked(true); // 失敗時にはクリック不可にする
      }
    }
  };

  const handleTouch = () => {
    if (!clicked) {
      setClicked(true); // 一度クリックしたら再クリック不可
  
      const moveUpInterval = 50; // 上に移動する間隔（ミリ秒）
      const moveUpStep = 15; // 一度に上に進むピクセル数
      const totalMoveUp = 165; // 全体で上に進むピクセル数
      let movedUp = 0; // これまでに上に進んだピクセル数
  
      const moveUp = () => {
        setPositionY((prev) => prev - moveUpStep);
        movedUp += moveUpStep;
        if (movedUp >= totalMoveUp) {
          clearInterval(moveUpId);
        }
      };
  
      const moveUpId = setInterval(moveUp, moveUpInterval);
    }
  };

  // 成功した場合に綿棒をスタート地点に戻す
  const handleReset = () => {
    setResetting(true); // リセット中は動かない
    const resetInterval = 100; // リセットの速度
    const resetStep = 5; // 一度に戻るピクセル量

    const resetMovement = () => {
      setPositionY((prevY) => {
        if (prevY < 0) {
          return prevY + resetStep; // 徐々にY軸を戻す
        } else {
          clearInterval(resetId); // 戻りきったらリセット終了
          setResetting(false);
          return 0;
        }
      });
      setPositionX((prevX) => {
        if (prevX > 0) {
          return prevX - resetStep; // X軸も戻す
        } else if (prevX < 0) {
          return prevX + resetStep;
        } else {
          return 0;
        }
      });
    };

    const resetId = setInterval(resetMovement, resetInterval);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-white relative" onClick={handleTouch}>
      {/* <h1 className="text-5xl text-center mt-20 mb-8">いれろ！！</h1> */}
      <p className="text-2xl">{status}</p>

      <div className="mb-16 z-10 relative" ref={noseRef}>
        <Image 
          src={noseImage} 
          alt="Nose" 
          width={200} 
          height={200} 
          priority 
          onLoad={() => setImageLoaded(true)} // 画像のロード完了を監視
        />
      </div>

      <div
        className="relative z-0"
        style={{ transform: `translateX(${positionX}px) translateY(${positionY}px)` }}
        ref={cottonBudRef}
        onClick={(e) => e.stopPropagation()} // 綿棒がクリックされたときのバブルを防ぐ
      >
        <Image src={cottonBudImage} alt="Cotton Bud" width={25} height={50} style={{ width: 'auto', height: 'auto' }} />

        {/* 毛の画像を綿棒の先端に重ねる */}
        {showHair && (
          <div style={{ position: 'absolute', top: '0px', left: '50%', transform: 'translateX(-50%)', width: '100px', height: '50px',}}>
            <Image src={hairImage} alt="Hair" layout="fill" objectFit="cover" />
          </div>
        )}
      </div>
    </div>
  );
}
