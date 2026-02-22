/**
 * 診断結果の分析ロジック
 * 回答データから3つの評価軸でスコアリング・テキスト解説を生成する
 */

export type AxisResult = {
  score: number;
  label: string;
  description: string;
};

export type AnalysisResult = {
  stabilityChallenge: AxisResult;
  specialistManagement: AxisResult;
  workStyle: AxisResult;
};

// 各質問の回答値 → 各軸のスコアへのマッピング
// スコアは0-100の範囲（加重平均で算出）

const stabilityChallengeMap: Record<string, Record<string, number>> = {
  q1: {
    very_satisfied: 15,
    satisfied: 30,
    neutral: 50,
    dissatisfied: 70,
    very_dissatisfied: 85,
  },
  q2: {
    work_life_balance: 15,
    salary_increase: 40,
    management: 50,
    technical_growth: 65,
    new_field: 85,
  },
  q3: {
    full_office: 15,
    hybrid: 40,
    full_remote: 60,
    freelance: 90,
  },
  q4: {
    less_than_1: 30,
    "1_to_3": 40,
    "3_to_5": 55,
    "5_to_10": 65,
    more_than_10: 75,
  },
  q6: {
    not_now: 15,
    within_1_year: 40,
    open: 60,
    immediately: 90,
  },
  q8: {
    enterprise: 15,
    mid_size: 35,
    small_medium: 60,
    startup: 85,
    any: 50,
  },
  q9: {
    rarely: 15,
    as_needed: 30,
    monthly: 50,
    weekly: 70,
    daily: 90,
  },
};

const specialistManagementMap: Record<string, Record<string, number>> = {
  q2: {
    technical_growth: 15,
    new_field: 30,
    work_life_balance: 50,
    salary_increase: 50,
    management: 90,
  },
  q4: {
    less_than_1: 20,
    "1_to_3": 30,
    "3_to_5": 45,
    "5_to_10": 60,
    more_than_10: 75,
  },
  q5: {
    frontend: 20,
    backend: 20,
    infrastructure: 25,
    mobile: 20,
    data_ai: 25,
    fullstack: 60,
  },
  q10: {
    implementer: 10,
    tech_advisor: 25,
    innovator: 40,
    coordinator: 70,
    leader: 90,
  },
};

const workStyleMap: Record<string, Record<string, number>> = {
  q2: {
    work_life_balance: 80,
    new_field: 60,
    salary_increase: 50,
    technical_growth: 40,
    management: 30,
  },
  q3: {
    full_office: 10,
    hybrid: 40,
    full_remote: 70,
    freelance: 95,
  },
  q7: {
    under_400: 20,
    "400_600": 35,
    "600_800": 50,
    "800_1000": 70,
    over_1000: 90,
  },
  q8: {
    enterprise: 15,
    mid_size: 35,
    small_medium: 55,
    startup: 80,
    any: 50,
  },
  q9: {
    rarely: 20,
    as_needed: 35,
    monthly: 50,
    weekly: 65,
    daily: 85,
  },
};

function calcAxisScore(
  answers: Record<string, string>,
  scoreMap: Record<string, Record<string, number>>
): number {
  const questionIds = Object.keys(scoreMap);
  let total = 0;
  let count = 0;

  for (const qId of questionIds) {
    const answer = answers[qId];
    if (answer && scoreMap[qId][answer] !== undefined) {
      total += scoreMap[qId][answer];
      count++;
    }
  }

  if (count === 0) return 50;
  return Math.round(total / count);
}

function getStabilityChallengeResult(score: number): AxisResult {
  let label: string;
  let description: string;

  if (score <= 30) {
    label = "安定志向";
    description =
      "現状に満足しており、安定した環境を好む傾向があります。着実にキャリアを積み上げていくタイプです。大きな環境変化よりも、今の環境を活かしてスキルアップしていくことが向いています。";
  } else if (score <= 45) {
    label = "やや安定志向";
    description =
      "基本的には安定を重視しつつも、成長の機会があれば積極的に取り組む姿勢があります。リスクを最小限に抑えながらキャリアアップを図るバランス型です。";
  } else if (score <= 55) {
    label = "バランス型";
    description =
      "安定と挑戦のバランスを取りながらキャリアを考えています。状況に応じて柔軟に判断できるタイプです。自分の中での優先順位を明確にすると、より効果的なキャリア選択ができるでしょう。";
  } else if (score <= 70) {
    label = "やや挑戦志向";
    description =
      "新しい環境や経験に対して前向きで、成長意欲が高いタイプです。現状に満足せず、より高い目標に向かって進んでいく力があります。適度なリスクを取りながらキャリアを広げていくことが向いています。";
  } else {
    label = "挑戦志向";
    description =
      "変化を恐れず、積極的に新しい挑戦を求めるタイプです。高い目標設定と行動力が強みで、スタートアップやフリーランスなど裁量の大きい環境で力を発揮しやすいでしょう。";
  }

  return { score, label, description };
}

function getSpecialistManagementResult(score: number): AxisResult {
  let label: string;
  let description: string;

  if (score <= 30) {
    label = "スペシャリスト志向";
    description =
      "技術的な深さを追求し、特定の専門領域でのエキスパートを目指すタイプです。技術的な課題解決や実装に強いやりがいを感じます。テックリードやアーキテクトといったキャリアパスが合っています。";
  } else if (score <= 45) {
    label = "ややスペシャリスト志向";
    description =
      "技術力を軸にしながらも、チームへの技術的な貢献にも関心があります。技術的な相談役として頼られる存在を目指すことで、専門性とチーム貢献の両立が図れます。";
  } else if (score <= 55) {
    label = "バランス型";
    description =
      "技術とマネジメントの両方に関心があり、状況に応じてどちらの役割も担えるタイプです。プレイングマネージャーやテクニカルPMのような、両面を活かせるポジションが向いています。";
  } else if (score <= 70) {
    label = "ややマネジメント志向";
    description =
      "技術的なバックグラウンドを持ちながらも、チームの成果を最大化することに関心が高いタイプです。エンジニアリングマネージャーとして技術とピープルマネジメントを両立するキャリアが考えられます。";
  } else {
    label = "マネジメント志向";
    description =
      "チームをまとめ、プロジェクトを推進していくことに強い関心があります。リーダーシップを発揮し、組織全体の成長に貢献するタイプです。VPoEやCTOといった経営レイヤーのキャリアパスも視野に入ります。";
  }

  return { score, label, description };
}

function getWorkStyleResult(score: number): AxisResult {
  let label: string;
  let description: string;

  if (score <= 30) {
    label = "組織重視・堅実型";
    description =
      "安定した組織の中で、チームメンバーと密にコミュニケーションを取りながら働くスタイルが向いています。大企業や中堅企業での正社員として、福利厚生やキャリアパスが整った環境が合っているでしょう。";
  } else if (score <= 45) {
    label = "チーム協調型";
    description =
      "適度な自由度がありつつも、チームとの連携を大切にする働き方が向いています。ハイブリッド勤務や中規模企業で、バランスの取れた環境が最も力を発揮できるでしょう。";
  } else if (score <= 55) {
    label = "柔軟バランス型";
    description =
      "働き方に対して柔軟な考えを持ち、状況に応じて適応できるタイプです。リモートワークとオフィス勤務を使い分けながら、自分のペースで成果を出せる環境が向いています。";
  } else if (score <= 70) {
    label = "自律・成長型";
    description =
      "自分のペースで働きながら、積極的にスキルアップを図るスタイルが向いています。リモートワーク中心で裁量の大きい環境や、成長フェーズの企業で力を発揮できるでしょう。";
  } else {
    label = "自由裁量・独立型";
    description =
      "高い自律性を持ち、自分で仕事をコントロールすることを重視するタイプです。フリーランスやスタートアップなど、裁量が大きく成果で評価される環境が最も合っているでしょう。";
  }

  return { score, label, description };
}

export function analyzeAnswers(
  answers: Record<string, string>
): AnalysisResult {
  const scScore = calcAxisScore(answers, stabilityChallengeMap);
  const smScore = calcAxisScore(answers, specialistManagementMap);
  const wsScore = calcAxisScore(answers, workStyleMap);

  return {
    stabilityChallenge: getStabilityChallengeResult(scScore),
    specialistManagement: getSpecialistManagementResult(smScore),
    workStyle: getWorkStyleResult(wsScore),
  };
}
