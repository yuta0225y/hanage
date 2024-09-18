"use client";
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

const cottonBudImage = '/cotton-bud.png';
const noseImage = '/nose.png';
const hairImage = '/ke.png';

export default function Stage1Client() {
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
  const [showHair, setShowHair] = useState(false); // 綿棒の先に鼻毛を表示するか
  const [movementEnded, setMovementEnded] = useState(false); // 綿棒の動きが終わったかどうか
  const [showExplosion, setShowExplosion] = useState(false); // 爆発アニメーションを表示するか
  const [animationCompleted, setAnimationCompleted] = useState(false); // すべてのアニメーションが完了したかどうかを追跡する
  const [timeLeft, setTimeLeft] = useState(0.5); // 残り時間を追跡するための状態

  const noseRef = useRef(null);
  const cottonBudRef = useRef(null);
  const timerRef = useRef(null); // タイマーを管理するためのRef

  // 綿棒の動き
  useEffect(() => {
    if (!clicked && !resetting) {
      const moveInterval = 30; // 移動の間隔（ミリ秒）
      const step = 10; // 1回の移動量（ピクセル）
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

  // 0.5秒以内にタップしないと爆発 & カウントダウンの表示
  useEffect(() => {
    if (!clicked && !animationCompleted) {
      setTimeLeft(0.5); // タイマーをリセット

      // setIntervalではなくsetTimeoutを使用
      timerRef.current = setTimeout(() => {
        setShowExplosion(true);
        setAnimationCompleted(true);
      }, 1000); // 0.5秒後に爆発
    }

    // クリーンアップ
    return () => clearTimeout(timerRef.current);
  }, [clicked, animationCompleted]);

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
    if (isSuccess || animationCompleted) return; // 複数のトリガーを防止

    if (cottonBudRef.current && noseRect && rightNoseHole && leftNoseHole) {
      const cottonBudRect = cottonBudRef.current.getBoundingClientRect();

      // 綿棒の上部中心の位置を計算
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
        // **成功シナリオ**
        setStatus('');
        setIsSuccess(true); // 成功をマーク
        setShowHair(true); // 鼻毛を表示

        // 綿棒の位置をリセット
        handleReset();

        // リセット後、シェアボタンを表示
        setTimeout(() => {
          setAnimationCompleted(true);
        }, 3000); // リセットの時間に応じて調整
      } else {
        // **失敗シナリオ**
        setStatus('');
        setShowExplosion(true); // 爆発アニメーションを表示

        // 爆発アニメーション後、リトライボタンを表示
        setTimeout(() => {
          setShowExplosion(false); // 爆発を非表示
          setAnimationCompleted(true);
        }, 500); // 爆発アニメーションの長さ
      }
    }
  };

  const handleTouch = () => {
    if (!clicked && !animationCompleted) { // アニメーション中のクリックを防止
      setClicked(true); // クリックを無効化
      clearTimeout(timerRef.current); // タイマーをクリア
      setTimeLeft(0); // カウントダウンを0に設定
      const moveUpInterval = 50; // 移動の間隔（ミリ秒）
      const moveUpStep = 15; // 1回の移動量（ピクセル）
      const totalMoveUp = 115; // 合計移動量（ピクセル）
      let movedUp = 0; // 現在の移動量

      const moveUp = () => {
        setPositionY((prev) => prev - moveUpStep);
        movedUp += moveUpStep;
        if (movedUp >= totalMoveUp) {
          clearInterval(moveUpId);
          setMovementEnded(true); // 動きが終了したことを通知
        }
      };

      const moveUpId = setInterval(moveUp, moveUpInterval);
    }
  };

  // 成功した場合に綿棒をスタート地点に戻す
  const handleReset = () => {
    setResetting(true); // リセット中の移動を防止
    const resetInterval = 100; // リセット速度
    const resetStep = 5; // 1回のリセット量（ピクセル）

    const resetMovement = () => {
      setPositionY((prevY) => {
        if (prevY < -25) { // リセットのターゲットを調整
          return prevY + resetStep;
        } else {
          clearInterval(resetId); // リセット完了
          setResetting(false);
          return -25; // 最終リセット位置
        }
      });
      setPositionX((prevX) => {
        if (prevX > 0) {
          return prevX - resetStep; // 左に移動
        } else if (prevX < 0) {
          return prevX + resetStep; // 右に移動
        } else {
          return 0;
        }
      });
    };

    const resetId = setInterval(resetMovement, resetInterval);
  };

  // リトライボタンが押されたときの処理
  const handleRetry = () => {
    setPositionX(0);
    setPositionY(0);
    setDirection(1);
    setStatus('');
    setClicked(false);
    setResetting(false);
    setIsSuccess(false);
    setShowHair(false);
    setMovementEnded(false);
    setShowExplosion(false);
    setAnimationCompleted(false);
    setTimeLeft(0.5); // タイマーをリセット

    // 再度タイマーを開始（setTimeoutを使用）
    timerRef.current = setTimeout(() => {
      setShowExplosion(true);
      setAnimationCompleted(true);
    }, 500); // 0.5秒後に爆発
  };

  return (
    <div
      className="flex flex-col items-center justify-center h-screen bg-white relative"
      onClick={handleTouch}
    >
      {/* カウントダウンタイマーの表示 */}
      {!clicked && !animationCompleted && (
        <div className="timer absolute top-4 right-4 text-4xl font-bold">
          {timeLeft}秒
        </div>
      )}

      {/* ステータスメッセージ */}
      <p className="text-2xl mb-4">{status}</p>

      {/* 鼻の画像 */}
      <div className="mb-16 z-10 relative" ref={noseRef}>
        <Image
          src={noseImage}
          alt="鼻"
          width={200}
          height={200}
          priority
          onLoad={() => setImageLoaded(true)} // 画像がロードされたら通知
        />
      </div>

      {/* 爆発アニメーション */}
      {showExplosion && (
        <div className="explosion-animation absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
          <Image src="/explosion.gif" alt="爆発" width={1000} height={1000} />
        </div>
      )}

      {/* 綿棒 */}
      <div
        className="relative z-0"
        style={{
          transform: `translateX(${positionX}px) translateY(${positionY}px)`,
          transition: 'transform 0.1s linear', // スムーズな動き
        }}
        ref={cottonBudRef}
        onClick={(e) => e.stopPropagation()} // イベントのバブリングを防止
      >
        <Image
          src={cottonBudImage}
          alt="綿棒"
          width={25}
          height={50}
          style={{ width: 'auto', height: 'auto' }}
        />

        {/* 鼻毛の画像 */}
        {showHair && (
          <div
            className="fade-in-scale"
            style={{
              position: 'absolute',
              top: '-150px', // 位置を上にずらす
              left: '50%',
              transform: 'translateX(-50%)',
              width: '300px', // 幅を大きく
              height: '300px', // 高さを大きく
            }}
          >
            <Image
              src={hairImage}
              alt="鼻毛"
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              style={{ objectFit: 'contain' }}
            />
          </div>
        )}
      </div>

 {/* リトライおよびシェアボタンのオーバーレイ */}
 {animationCompleted && (
        <div className="overlay fixed top-0 left-0 w-full h-full bg-white bg-opacity-90 flex flex-col items-center justify-center z-50">
          <p className="message text-4xl mb-4">
            {isSuccess ? '毛どうぞどうぞ' : 'きびしいって！'}
          </p>
          <div className="flex space-x-4">
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                isSuccess
                  ? '毛タクさん沢山ほしい？ #鼻毛エクスプロージョン #RUNTEQ祭'
                  : '毛ほしい？ #鼻毛エクスプロージョン #RUNTEQ祭'
              )}&url=${encodeURIComponent(
                typeof window !== 'undefined' ? window.location.href : ''
              )}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <button className="share-button bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded">
                毛をシェアする
              </button>
            </a>
            <button
              onClick={handleRetry}
              className="retry-button bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded"
            >
              毛ほしい？ ▷はい いいえ
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
