"use client";

import { useRouter } from "next/navigation";

export default function Home() {
    const router = useRouter();
    
    const handleStart = () => {
        // 設問画面に遷移
        router.push("/consult");
    };

    return (
        <>
            <h1>エンジニアキャリア診断</h1>
            <p>あなたのキャリアを診断します</p>
            <button
                onClick={handleStart}
                className="w-48 bg-black text-white hover:bg-black/90 px-6 py-3 rounded-md"
            >
                診断を開始する
            </button>
        </>
    );
}