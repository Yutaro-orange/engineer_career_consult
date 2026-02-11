import { NextResponse } from "next/server";
import { analyzeAnswers } from "@/lib/diagnosis/analysis";

export async function POST(request: Request) {
  const body = await request.json();
  const answers: Record<string, string> = body.answers;

  if (!answers || typeof answers !== "object") {
    return NextResponse.json(
      { error: "回答データが不正です" },
      { status: 400 }
    );
  }

  const result = analyzeAnswers(answers);
  return NextResponse.json(result);
}
