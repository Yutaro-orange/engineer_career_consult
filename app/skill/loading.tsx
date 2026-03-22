// Next.jsのSuspense境界に対応したローディングコンポーネント
export default function Loading() {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-20 w-20 border-4 border-blue-400 border-t-transparent" />
    </div>
  );
}