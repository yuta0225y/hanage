"use client";
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

const cottonBudImage = '/cotton-bud.png';
const noseImage = '/nose.png';
const hairImage = '/ke.png'; // 毛の画像

export default function Stage1() {
  const [positionX, setPositionX] = useState(0); // 綿棒のX座標
  const [positionY, setPositionY] = useState(0); // 綿棒のY座標
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
  const [movementEnded, setMovementEnded] = useState(false); // 綿棒の動きが終わったかどうか
  const [showExplosion, setShowExplosion] = useState(false); // Controls explosion animation display
  const [animationCompleted, setAnimationCompleted] = useState(false); // Tracks if all animations are done

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
      const rightNoseHole = { 
        x1: noseRect.left + 30, 
        x2: noseRect.left + 90, 
        y1: noseRect.top + 140, 
        y2: noseRect.top + 200 
      };
      const leftNoseHole = { 
        x1: noseRect.left + 110, 
        x2: noseRect.left + 170, 
        y1: noseRect.top + 140, 
        y2: noseRect.top + 200 
      };

      setRightNoseHole(rightNoseHole);
      setLeftNoseHole(leftNoseHole);
    }
  }, [imageLoaded]); // 画像がロードされた後に計算を行う

  // 綿棒の衝突判定
  useEffect(() => {
    if (clicked && movementEnded) {
      // 動きが終わった後に0.5秒待機してから判定を行う
      const waitTime = 500; // 待機時間（ミリ秒）
      const timerId = setTimeout(() => {
        checkCollision();
      }, waitTime);

      return () => clearTimeout(timerId);
    }
  }, [positionX, positionY, clicked, movementEnded]);

  const checkCollision = () => {
    if (isSuccess || animationCompleted) return; // Prevent multiple triggers

    if (cottonBudRef.current && noseRect && rightNoseHole && leftNoseHole) {
      const cottonBudRect = cottonBudRef.current.getBoundingClientRect();

      // Calculate the top center position of the cotton bud
      const cottonBudTopX = cottonBudRect.left + cottonBudRect.width / 2;
      const cottonBudTopY = cottonBudRect.top;

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
        // **Success Scenario**
        setStatus('Oh,Yeah!');
        setIsSuccess(true); // Mark as success
        setShowHair(true); // Display hair

        // Reset cotton bud's position
        handleReset();

        // After reset, show share button
        setTimeout(() => {
          setAnimationCompleted(true);
        }, 1000); // Adjust the timeout as needed based on reset duration
      } else {
        // **Failure Scenario**
        setStatus('Oh my god...');
        setShowExplosion(true); // Trigger explosion animation

        // After explosion animation, show share button
        setTimeout(() => {
          setShowExplosion(false); // Hide explosion
          setAnimationCompleted(true);
        }, 1000); // Duration of explosion animation
      }
    }
  };

  const handleTouch = () => {
    if (!clicked && !animationCompleted) { // Prevent clicking during animations
      setClicked(true); // Disable further clicks
      const moveUpInterval = 50; // Movement interval in ms
      const moveUpStep = 15; // Pixels to move up each step
      const totalMoveUp = 115; // Total pixels to move up
      let movedUp = 0; // Pixels moved up so far

      const moveUp = () => {
        setPositionY((prev) => prev - moveUpStep);
        movedUp += moveUpStep;
        if (movedUp >= totalMoveUp) {
          clearInterval(moveUpId);
          setMovementEnded(true); // Notify that movement has ended
        }
      };

      const moveUpId = setInterval(moveUp, moveUpInterval);
    }
  };

  // 成功した場合に綿棒をスタート地点に戻す
  const handleReset = () => {
    setResetting(true); // Prevent movement during reset
    const resetInterval = 100; // Reset speed
    const resetStep = 5; // Pixels to reset each step

    const resetMovement = () => {
      setPositionY((prevY) => {
        if (prevY < -25) { // Adjusted reset target
          return prevY + resetStep;
        } else {
          clearInterval(resetId); // Reset complete
          setResetting(false);
          return -25; // Final reset position
        }
      });
      setPositionX((prevX) => {
        if (prevX > 0) {
          return prevX - resetStep; // Move left
        } else if (prevX < 0) {
          return prevX + resetStep; // Move right
        } else {
          return 0;
        }
      });
    };

    const resetId = setInterval(resetMovement, resetInterval);
  };

  return (
    <div
      className="flex flex-col items-center justify-center h-screen bg-white relative"
      onClick={handleTouch}
    >
      {/* Status Message */}
      <p className="text-2xl mb-4">{status}</p>

      {/* Nose Image */}
      <div className="mb-16 z-10 relative" ref={noseRef}>
        <Image
          src={noseImage}
          alt="Nose"
          width={200}
          height={200}
          priority
          onLoad={() => setImageLoaded(true)} // Monitor image load
        />
      </div>

      {/* Explosion Animation */}
      {showExplosion && (
        <div className="explosion-animation absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
          <Image src="/explosion.gif" alt="Explosion" width={200} height={200} />
        </div>
      )}

      {/* Cotton Bud */}
      <div
        className="relative z-0"
        style={{
          transform: `translateX(${positionX}px) translateY(${positionY}px)`,
          transition: 'transform 0.1s linear', // Smooth movement
        }}
        ref={cottonBudRef}
        onClick={(e) => e.stopPropagation()} // Prevent event bubbling
      >
        <Image
          src={cottonBudImage}
          alt="Cotton Bud"
          width={25}
          height={50}
          style={{ width: 'auto', height: 'auto' }}
        />

        {/* Hair Image */}
        {showHair && (
          <div
            style={{
              position: 'absolute',
              top: '0px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '100px',
              height: '50px',
            }}
          >
            <Image
              src={hairImage}
              alt="Hair"
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              style={{ objectFit: 'cover' }}
            />
          </div>
        )}
      </div>

      {/* X Share Button Overlay */}
      {animationCompleted && (
        <div className="overlay fixed top-0 left-0 w-full h-full bg-white bg-opacity-90 flex flex-col items-center justify-center z-50">
          <p className="message text-4xl mb-4">
            {isSuccess ? '成功！' : '失敗。'}
          </p>
          <a
            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
              isSuccess
                ? '綿棒で鼻毛を抜くのに成功しました！'
                : '綿棒で鼻毛を抜くのに失敗しました。'
            )}&url=${encodeURIComponent(window.location.href)}`} // Use current URL
            target="_blank"
            rel="noopener noreferrer"
          >
            <button className="share-button bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded">
              Xでシェアする
            </button>
          </a>
        </div>
      )}
    </div>
  );
}
