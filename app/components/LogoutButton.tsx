import { signOut } from '@/auth';

export default function LogoutButton() {
  return (
    <form
      action={async () => {
        'use server';
        await signOut({ redirectTo: '/login' });
      }}
    >
      <button
        type="submit"
        className="px-4 py-2 rounded-lg text-sm font-medium bg-white border border-gray-300 text-gray-700 hover:border-gray-400 transition-colors"
      >
        ログアウト
      </button>
    </form>
  );
}
