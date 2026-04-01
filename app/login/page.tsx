import LoginButton from "@/app/components/LoginButton";

interface LoginPageProps {
  searchParams: Promise<{ error?: string; callbackUrl?: string }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { error } = await searchParams;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <div className="max-w-2xl w-full text-center">
        <h1 className="text-3xl font-bold mb-4">エンジニアキャリア診断</h1>
        <p className="text-gray-600 mb-8 text-lg">
          GitHubアカウントでログインして、あなたの技術力を分析しましょう
        </p>

        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
            ログインに失敗しました。もう一度お試しください。
          </div>
        )}

        <LoginButton />
      </div>
    </div>
  );
}
