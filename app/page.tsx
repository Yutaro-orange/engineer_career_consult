"use client";

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const handleStart = () => {
    router.push("/consult");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <div className="max-w-2xl w-full text-center">
        <h1 className="text-3xl font-bold mb-4">エンジニアキャリア診断</h1>
        <p className="text-gray-600 mb-8 text-lg">
          あなたのキャリアを診断します
        </p>
        <p className="text-gray-500 mb-8 text-sm">
          10問の質問に回答して、あなたに最適なキャリアパスを見つけましょう。
          <br />
          所要時間：約3分
        </p>
        <button
          onClick={handleStart}
          className="bg-black text-white hover:bg-gray-800 px-8 py-4 rounded-lg text-lg font-medium transition-colors"
        >
          診断を開始する
        </button>
      </div>
    </div>
  );
}