import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const schemaPath = path.join(__dirname, "..", "prisma", "schema.prisma");
const dbUrl = process.env.DATABASE_URL || "";

let provider = "sqlite";
if (dbUrl.startsWith("postgres://") || dbUrl.startsWith("postgresql://")) {
  provider = "postgresql";
} else if (dbUrl.startsWith("file:") || dbUrl.includes(".db") || !dbUrl) {
  provider = "sqlite";
}

try {
  let schemaContent = fs.readFileSync(schemaPath, "utf-8");
  const regex = /datasource\s+db\s+\{[\s\S]*?provider\s*=\s*"[^"]*"[\s\S]*?\}/;

  const newDatasource = `datasource db {
  provider = "${provider}"
  url      = env("DATABASE_URL")
}`;

  schemaContent = schemaContent.replace(regex, newDatasource);
  fs.writeFileSync(schemaPath, schemaContent, "utf-8");
  console.log(`[PRISMA PREPARE] Dynamic provider set to "${provider}" (from DATABASE_URL)`);
} catch (err) {
  console.error("[PRISMA PREPARE ERROR] Failed to adjust schema provider:", err);
}
