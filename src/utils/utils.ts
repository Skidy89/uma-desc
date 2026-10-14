import path from "node:path";
import { fileURLToPath } from "node:url";

export const ___filename = fileURLToPath(import.meta.url);
export const ___dirname = path.dirname(___filename);
