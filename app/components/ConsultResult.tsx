//"use client";

import type { AnalysisResult } from "@/lib/diagnosis/analysis";
import Link from "next/link";

type Props = {
  result: AnalysisResult;
  onRetry: () => void;
};

function ScoreBar({
  score,
  leftLabel,
  rightLabel,
}: {
  score: number;
  leftLabel: string;
  rightLabel: string;
}) {
  return (
    <div>
      <div className="flex justify-between text-sm text-gray-500 mb-1">
        <span>{leftLabel}</span>
        <span>{rightLabel}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-3 relative">
        <div
          className="bg-black h-3 rounded-full transition-all duration-500"
          style={{ width: `${score}%` }}
        />
      </div>
      <div className="text-right text-sm text-gray-400 mt-1">{score}/100</div>
    </div>
  );
}

function AxisSection({
  title,
  label,
  description,
  score,
  leftLabel,
  rightLabel,
}: {
  title: string;
  label: string;
  description: string;
  score: number;
  leftLabel: string;
  rightLabel: string;
}) {
  return (
    <div className="bg-gray-50 rounded-xl p-6 mb-6">
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <div className="mb-4">
        <span className="inline-block bg-black text-white text-sm font-medium px-3 py-1 rounded-full">
          {label}
        </span>
      </div>
      <ScoreBar score={score} leftLabel={leftLabel} rightLabel={rightLabel} />
      <p className="text-gray-700 mt-4 leading-relaxed">{description}</p>
    </div>
  );
}

export function ConsultResult({ result, onRetry }: Props) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <div className="max-w-2xl w-full">
        <h1 className="text-3xl font-bold mb-2 text-center">診断結果</h1>
        <p className="text-center text-gray-500 mb-8">
          あなたのキャリア傾向を分析しました
        </p>

        <AxisSection
          title="安定志向 vs 挑戦志向"
          label={result.stabilityChallenge.label}
          description={result.stabilityChallenge.description}
          score={result.stabilityChallenge.score}
          leftLabel="安定志向"
          rightLabel="挑戦志向"
        />

        <AxisSection
          title="スペシャリスト vs マネジメント"
          label={result.specialistManagement.label}
          description={result.specialistManagement.description}
          score={result.specialistManagement.score}
          leftLabel="スペシャリスト"
          rightLabel="マネジメント"
        />

        <AxisSection
          title="理想の働き方"
          label={result.workStyle.label}
          description={result.workStyle.description}
          score={result.workStyle.score}
          leftLabel="組織重視"
          rightLabel="自由裁量"
        />

        <div className="flex justify-center gap-4 mt-8">
          <button
            onClick={onRetry}
            className="px-8 py-3 rounded-lg font-medium bg-white border-2 border-gray-300 text-gray-700 hover:border-gray-400 transition-colors"
          >
            もう一度診断する
          </button>
          <Link
            href="/menu"
            className="px-8 py-3 rounded-lg font-medium bg-white border-2 border-gray-300 text-gray-700 hover:border-gray-400 transition-colors"
          >
            メニューへ
          </Link>
        </div>
      </div>
    </div>
  );
}
