import { cp, mkdir, rm } from "node:fs/promises";

await rm("dist/public", { recursive: true, force: true });
await mkdir("dist", { recursive: true });
await cp("src/public", "dist/public", { recursive: true });
