import { NextResponse } from 'next/server';
import { analyzeAnswers } from '@/lib/diagnosis/analysis';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const answers = body.answers;

    if (!answers || typeof answers !== 'object' || Array.isArray(answers)) {
      return NextResponse.json({ error: '回答データが不正です' }, { status: 400 });
    }

    for (const value of Object.values(answers)) {
      if (typeof value !== 'string') {
        return NextResponse.json({ error: '回答データの形式が不正です' }, { status: 400 });
      }
    }

    const result = analyzeAnswers(answers as Record<string, string>);
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: 'リクエストの処理に失敗しました' }, { status: 400 });
  }
}
