import Link from "next/link";

export function Menu() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <div className="max-w-2xl w-full text-center">
        <h1 className="text-3xl font-bold mb-8">メニュー</h1>
        <div className="flex flex-col gap-4 items-center">
          <Link
            href="/chat"
            className="px-8 py-3 rounded-lg font-medium bg-white border-2 border-gray-300 text-gray-700 hover:border-gray-400 transition-colors"
          >
            チャット
          </Link>
          <Link
            href="/skill"
            className="px-8 py-3 rounded-lg font-medium bg-white border-2 border-gray-300 text-gray-700 hover:border-gray-400 transition-colors"
          >
            技術力判断
          </Link>
        </div>
      </div>
    </div>
  );
}
