"use client";

// 診断後に遷移するメニュー画面
import Link from "next/link";
import { useRouter } from "next/navigation";

// チャット画面に遷移

// githubのリポジトリに遷移


export function Menu() {
    const router = useRouter();
    const pageMove = (pageName: string) => {
        router.push(pageName);
    }
    return(
        <div>
            <h1 className="text-2xl font-bold mb-6">メニュー</h1>
            <button
            onClick={() => pageMove("/chat")}
            className="px-8 py-3 rounded-lg font-medium bg-white border-2 border-gray-300 text-gray-700 hover:border-gray-400 transition-colors"
            >
            チャット
            </button>
            <button
            onClick={() => pageMove("/skill")}
            className="px-8 py-3 rounded-lg font-medium bg-white border-2 border-gray-300 text-gray-700 hover:border-gray-400 transition-colors"
            >
            技術力判断
            </button>
        </div>

    );
}