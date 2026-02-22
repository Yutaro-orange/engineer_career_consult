import { skillsUseCases, SkillSummary } from "@/app/application/use-cases/skillsUseCases";

// skill画面表示
export default function SkillPage() {
  const skills: SkillSummary[] = skillsUseCases();

  return (
    <>
      <h1 className="text-3xl font-bold mb-4">Skill Page</h1>
      {skills.length === 0 ? (
        <p>スキル情報を取得できませんでした。</p>
      ) : (
        <ul>
          {skills.map((skill) => (
            <li key={skill.url} className="mb-4 p-4 border rounded">
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
    </>
  );
}
