import { PrismaClient } from "@prisma/client";
import { diagnosisQuestions } from "../lib/diagnosis/questions";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // 既存のデータを削除（開発用）
  console.log("Deleting existing data...");
  await prisma.diagnosisOption.deleteMany();
  await prisma.diagnosisQuestion.deleteMany();

  // 質問データを一括登録
  console.log(`Inserting ${diagnosisQuestions.length} questions...`);

  for (let i = 0; i < diagnosisQuestions.length; i++) {
    const questionData = diagnosisQuestions[i];

    const question = await prisma.diagnosisQuestion.create({
      data: {
        question: questionData.question,
        options: {
          create: questionData.options.map((opt, index) => ({
            label: opt.label,
            value: opt.value,
            order: index + 1,
          })),
        },
      },
      include: { options: true },
    });

    console.log(`  ✅ Q${i + 1}: ${question.question}`);
  }

  // 登録結果を確認
  const totalQuestions = await prisma.diagnosisQuestion.count();
  const totalOptions = await prisma.diagnosisOption.count();

  console.log("\n📊 Seed completed:");
  console.log(`  - Questions: ${totalQuestions}`);
  console.log(`  - Options: ${totalOptions}`);
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
