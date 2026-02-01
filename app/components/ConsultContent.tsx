"use client";

import { useState } from "react";
import type { Question } from "@/lib/diagnosis/questions";

type Props = {
  questions: Question[];
};

export function ConsultContent({ questions }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const currentQuestion = questions[currentIndex];
  const isLastQuestion = currentIndex === questions.length - 1;
  const isFirstQuestion = currentIndex === 0;

  const handleSelectOption = (questionId: string, value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const handleNext = () => {
    if (!isLastQuestion) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (!isFirstQuestion) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleSubmit = () => {
    console.log("回答結果:", answers);
    alert("診断が完了しました！\n回答: " + JSON.stringify(answers, null, 2));
  };

  if (questions.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8">
        <div className="max-w-2xl w-full text-center">
          <h1 className="text-3xl font-bold mb-4">診断</h1>
          <p className="text-gray-600">質問データがありません。</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <div className="max-w-2xl w-full">
        {/* ヘッダー */}
        <h1 className="text-3xl font-bold mb-8 text-center">エンジニアキャリア診断</h1>

        {/* 進捗表示 */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-500 mb-2">
            <span>質問 {currentIndex + 1} / {questions.length}</span>
            <span>{Math.round(((currentIndex + 1) / questions.length) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-black h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>

        {/* 質問カード */}
        <div className="bg-gray-50 rounded-xl p-8 mb-8">
          <h2 className="text-xl font-semibold mb-6">{currentQuestion.question}</h2>

          {/* 選択肢 */}
          <div className="space-y-3">
            {currentQuestion.options.map((option) => (
              <label
                key={option.id}
                className={`block p-4 bg-white border-2 rounded-lg cursor-pointer transition-all ${
                  answers[currentQuestion.id] === option.value
                    ? "border-black bg-gray-100"
                    : "border-gray-200 hover:border-gray-400"
                }`}
              >
                <input
                  type="radio"
                  name={currentQuestion.id}
                  value={option.value}
                  checked={answers[currentQuestion.id] === option.value}
                  onChange={() => handleSelectOption(currentQuestion.id, option.value)}
                  className="sr-only"
                />
                <span className="text-gray-800">{option.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* ナビゲーションボタン */}
        <div className="flex justify-between">
          <button
            onClick={handlePrev}
            disabled={isFirstQuestion}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              isFirstQuestion
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-white border-2 border-gray-300 text-gray-700 hover:border-gray-400"
            }`}
          >
            前へ
          </button>

          {isLastQuestion ? (
            <button
              onClick={handleSubmit}
              disabled={!answers[currentQuestion.id]}
              className={`px-8 py-3 rounded-lg font-medium transition-colors ${
                answers[currentQuestion.id]
                  ? "bg-black text-white hover:bg-gray-800"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
            >
              診断結果を見る
            </button>
          ) : (
            <button
              onClick={handleNext}
              disabled={!answers[currentQuestion.id]}
              className={`px-8 py-3 rounded-lg font-medium transition-colors ${
                answers[currentQuestion.id]
                  ? "bg-black text-white hover:bg-gray-800"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
            >
              次へ
            </button>
          )}
        </div>
      </div>
    </div>
  );
}