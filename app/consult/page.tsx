// app/consult/page.tsx
import { getQuestions } from '@/lib/diagnosis/questions';
import { ConsultContent } from '@/app/components/ConsultContent';

// 質問データを取得してConsultContentコンポーネントに渡す
export default function ConsultPage() {
  const questions = getQuestions();

  return <ConsultContent questions={questions} />;
}
