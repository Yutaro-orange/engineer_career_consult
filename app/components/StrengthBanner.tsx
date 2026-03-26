export function StrengthBanner({ strengthLanguage }: { strengthLanguage: string | null }) {
  if (!strengthLanguage) return null;
  return (
    <div className="bg-blue-50 rounded-xl p-6 mb-8 text-center">
      <p className="text-2xl font-bold text-blue-800">
        あなたの最大の強みは{strengthLanguage}です
      </p>
    </div>
  );
}