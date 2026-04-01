import { prisma } from '@/lib/prisma';

export async function getAccessToken(userId: string): Promise<string | null> {
  try {
    const account = await prisma.account.findFirst({
      where: { userId, provider: 'github' },
      select: { access_token: true },
    });
    return account?.access_token ?? null;
  } catch (error) {
    console.error('Failed to retrieve access token:', error);
    return null;
  }
}
