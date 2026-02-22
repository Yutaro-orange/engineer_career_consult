import * as fs from "fs";
import * as path from "path";
import { generateKey, encrypt } from "../packages/server-core/utilities/encryption";

const PROJECT_ROOT = path.resolve(__dirname, "..");
const KEY_FILE = path.join(PROJECT_ROOT, ".env.key");

function getOrCreateKey(): string {
  if (fs.existsSync(KEY_FILE)) {
    const key = fs.readFileSync(KEY_FILE, "utf8").trim();
    console.log(".env.key から既存の秘密鍵を読み込みました");
    return key;
  }

  const key = generateKey();
  fs.writeFileSync(KEY_FILE, key, "utf8");
  console.log(".env.key に新しい秘密鍵を生成・保存しました");
  return key;
}

function main() {
  const token = process.argv[2];
  if (!token) {
    console.error("使い方: npx tsx scripts/encrypt-token.ts <GITHUB_TOKEN>");
    process.exit(1);
  }

  const key = getOrCreateKey();
  const encrypted = encrypt(token, key);

  console.log("\n--- 暗号化結果 ---");
  console.log(`GITHUB_TOKEN_ENCRYPTED="${encrypted}"`);
  console.log("\n上記の値を .env に設定してください。");
}

main();
