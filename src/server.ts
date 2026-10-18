import "dotenv/config";
import express from "express";
import path from "node:path";

import { CharacterId, characters } from "./characters.js";
import {
  createNewConversation,
  getConversationMessages,
  saveNewMessage,
} from "./message-handler.js";
import { ___filename } from "./utils/utils.js";
import { fileURLToPath } from "node:url";
import { readFile } from "node:fs/promises";
(async () => {
  const app = express();
  const port = Number(process.env.PORT) || 5127;

  const source = path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    ".",
  );
  const publicsrc = path.join(source, "public");
  await Promise.allSettled(
    Object.values(characters).map((character) =>
      character.client.authenticate(),
    ),
  );

  app.use(express.json({ limit: "32kb" }));

  app.get(
    "/api/characters/:id/conversations/:conversationId/messages",
    (req, res) => {
      if (!(req.params.id in characters)) {
        res.status(404).json({ error: "Character not found" });
        return;
      }

      const conversationId = req.params.conversationId;
      const messages = getConversationMessages(conversationId);
      res.json({ messages });
    },
  );

  app.post("/api/characters/:id/messages", async (req, res) => {
    if (!(req.params.id in characters)) {
      res.status(404).json({ error: "Character not found" });
      return;
    }

    const conversationId = req.body?.conversationId;
    const content =
      typeof req.body?.content === "string" ? req.body.content.trim() : "";
    if (
      typeof conversationId !== "string" ||
      conversationId.length > 100 ||
      !content ||
      content.length > 2000
    ) {
      res.status(400).json({ error: "Invalid conversation or message" });
      return;
    }
    const character = characters[req.params.id as CharacterId];

    createNewConversation(conversationId);
    saveNewMessage(conversationId, "user", content);
    const reply = await character.client.sendMessage(content);
    saveNewMessage(conversationId, "assistant", reply);
    res.json({ reply });
  });

  app.get("/characters/:id/", async (req, res, next) => {
    const character = characters[req.params.id as CharacterId];

    if (!character) {
      res.status(404).send("Character not found");
      return;
    }

    try {
      const htmlFilePath = path.resolve(publicsrc, character.view);
      const html = await readFile(htmlFilePath, "utf8");
      const isAuthenticated = character.client.isAuthenticated();

      const script = `
      <script>
        const dot = document.querySelector(".status-dot");

        if (dot) {
          dot.classList.toggle("status-dot--online", ${isAuthenticated});
          dot.classList.toggle("status-dot--offline", !${isAuthenticated});
        }
      </script>
    `;

      res.type("html").send(html.replace("</body>", `${script}</body>`));
    } catch (error) {
      next(error);
    }
  });

  app.get("/", async (_req, res, next) => {
    try {
      const indexPath = path.join(publicsrc, "index.html");
      const html = await readFile(indexPath, "utf8");

      res.type("html").send(html);
    } catch (error) {
      next(error);
    }
  });

  app.use(express.static(publicsrc));

  app.use((_req, res) => {
    res.status(404).send("404 Not Found");
  });

  app.use(
    (
      error: unknown,
      _req: express.Request,
      res: express.Response,
      next: express.NextFunction,
    ) => {
      if (res.headersSent) {
        next(error);
        return;
      }

      console.error("HTTP request failed:", error);
      res.status(500).json({ error: "Internal server error" });
    },
  );

  app.listen(port, "0.0.0.0", () => {
    console.log("HTTPS server started");
  });
})();
