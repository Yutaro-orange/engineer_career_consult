/**
 * 診断質問データ
 * 質問を追加・編集する場合はこのファイルを変更してください
 */

export type Option = {
  id: string;
  label: string;
  value: string;
  order: number;
};

export type Question = {
  id: string;
  question: string;
  options: Option[];
};

// 質問データを定義し、自動的にIDとorderを付与
const rawQuestions = [
  {
    question: '現在の仕事にどの程度満足していますか？',
    options: [
      { label: 'とても満足', value: 'very_satisfied' },
      { label: 'やや満足', value: 'satisfied' },
      { label: 'どちらでもない', value: 'neutral' },
      { label: 'やや不満', value: 'dissatisfied' },
      { label: 'とても不満', value: 'very_dissatisfied' },
    ],
  },
  {
    question: '今後のキャリアで最も重視したいことは何ですか？',
    options: [
      { label: '技術力の向上', value: 'technical_growth' },
      { label: 'マネジメント経験', value: 'management' },
      { label: 'ワークライフバランス', value: 'work_life_balance' },
      { label: '年収アップ', value: 'salary_increase' },
      { label: '新しい分野への挑戦', value: 'new_field' },
    ],
  },
  {
    question: '希望する働き方はどれですか？',
    options: [
      { label: 'フルリモート', value: 'full_remote' },
      { label: 'ハイブリッド（週2〜3日出社）', value: 'hybrid' },
      { label: 'フル出社', value: 'full_office' },
      { label: 'フリーランス・業務委託', value: 'freelance' },
    ],
  },
  {
    question: 'エンジニアとしての経験年数はどのくらいですか？',
    options: [
      { label: '1年未満', value: 'less_than_1' },
      { label: '1〜3年', value: '1_to_3' },
      { label: '3〜5年', value: '3_to_5' },
      { label: '5〜10年', value: '5_to_10' },
      { label: '10年以上', value: 'more_than_10' },
    ],
  },
  {
    question: '最も得意な技術領域はどれですか？',
    options: [
      { label: 'フロントエンド', value: 'frontend' },
      { label: 'バックエンド', value: 'backend' },
      { label: 'インフラ・DevOps', value: 'infrastructure' },
      { label: 'モバイルアプリ', value: 'mobile' },
      { label: 'データ・AI/ML', value: 'data_ai' },
      { label: 'フルスタック', value: 'fullstack' },
    ],
  },
  {
    question: '現在の転職意欲はどの程度ですか？',
    options: [
      { label: 'すぐにでも転職したい', value: 'immediately' },
      { label: '良い案件があれば転職したい', value: 'open' },
      { label: '1年以内に転職を考えている', value: 'within_1_year' },
      { label: '今は転職を考えていない', value: 'not_now' },
    ],
  },
  {
    question: '希望する年収レンジはどれですか？',
    options: [
      { label: '400万円未満', value: 'under_400' },
      { label: '400〜600万円', value: '400_600' },
      { label: '600〜800万円', value: '600_800' },
      { label: '800〜1000万円', value: '800_1000' },
      { label: '1000万円以上', value: 'over_1000' },
    ],
  },
  {
    question: '希望する企業規模はどれですか？',
    options: [
      { label: 'スタートアップ（〜50人）', value: 'startup' },
      { label: '中小企業（50〜300人）', value: 'small_medium' },
      { label: '中堅企業（300〜1000人）', value: 'mid_size' },
      { label: '大企業（1000人以上）', value: 'enterprise' },
      { label: '規模にこだわらない', value: 'any' },
    ],
  },
  {
    question: '新しい技術の学習にどの程度時間を使っていますか？',
    options: [
      { label: '毎日学習している', value: 'daily' },
      { label: '週に数回学習している', value: 'weekly' },
      { label: '月に数回学習している', value: 'monthly' },
      { label: '必要な時だけ学習している', value: 'as_needed' },
      { label: 'ほとんど学習していない', value: 'rarely' },
    ],
  },
  {
    question: 'チームでどのような役割を担うことが多いですか？',
    options: [
      { label: 'リーダー・まとめ役', value: 'leader' },
      { label: '技術的な相談役', value: 'tech_advisor' },
      { label: '実装を担当するメンバー', value: 'implementer' },
      { label: '新しいアイデアを提案する人', value: 'innovator' },
      { label: '調整・コミュニケーション役', value: 'coordinator' },
    ],
  },
];

// IDとorderを自動付与してエクスポート
export const diagnosisQuestions: Question[] = rawQuestions.map((q, qIndex) => ({
  id: `q${qIndex + 1}`,
  question: q.question,
  options: q.options.map((opt, optIndex) => ({
    id: `q${qIndex + 1}_opt${optIndex + 1}`,
    label: opt.label,
    value: opt.value,
    order: optIndex + 1,
  })),
}));

// 質問を取得する関数
export function getQuestions(): Question[] {
  return diagnosisQuestions;
}
