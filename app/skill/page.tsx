import { skillsUseCases } from "@/app/application/use-cases/skillsUseCases";
import { StrengthBanner } from "../components/StrengthBanner";
import { OverallLanguageChart } from "../components/OverallLanguageChart";
import { RepoCard } from "../components/RepoCard";

export default async function SkillPage() {
  const data = await skillsUseCases();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <div className="max-w-2xl w-full">
        <h1 className="text-3xl font-bold mb-8 text-center">技術力判断</h1>
        {!data.success ? (
          <p className="text-center text-gray-500">スキル情報を取得できませんでした。</p>
        ) : data.repos.length === 0 ? (
          <p className="text-center text-gray-500">リポジトリが見つかりません。</p>
        ) : (
          <>
            <StrengthBanner strengthLanguage={data.strengthLanguage} />
            <OverallLanguageChart languages={data.overallLanguages} />
            <ul className="space-y-4">
              {data.repos.map((repo) => (
                <RepoCard key={repo.url} repo={repo} />
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
}
