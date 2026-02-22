import { skillsUseCases, SkillSummary } from "@/app/application/use-cases/skillsUseCases";

export default async function SkillPage() {
  const skills: SkillSummary[] = await skillsUseCases();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <div className="max-w-2xl w-full">
        <h1 className="text-3xl font-bold mb-8 text-center">技術力判断</h1>
        {skills.length === 0 ? (
          <p className="text-center text-gray-500">スキル情報を取得できませんでした。</p>
        ) : (
          <ul className="space-y-4">
            {skills.map((skill) => (
              <li key={skill.url} className="p-4 border rounded-lg">
                <a href={skill.url} target="_blank" rel="noopener noreferrer"
                   className="text-lg font-semibold text-blue-600 hover:underline">
                  {skill.name}
                </a>
                {skill.primaryLanguage && (
                  <span className="ml-2 text-sm text-gray-500">
                    ({skill.primaryLanguage})
                  </span>
                )}
                {skill.description && (
                  <p className="text-gray-600 mt-1">{skill.description}</p>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
