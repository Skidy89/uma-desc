import { CharacterAI } from "node_characterai";
import DMConversation from "node_characterai/dist/chat/dmConversation.js";

export class CharacterAIClient {
  private client = new CharacterAI();
  private characterId: string = "";
  private dm: DMConversation | null = null;

  constructor(
    private token: string,
    characterId: string,
  ) {
    this.characterId = characterId;
  }
  public isAuthenticated(): boolean {
    if (this.client.authenticated) return true;
    return false;
  }

  public async authenticate(): Promise<void> {
    if (!this.token) throw new Error("Token is not set");
    const isAuthenticated = this.isAuthenticated();
    if (this.dm || isAuthenticated) return;
    await this.client.authenticate(this.token);
    const c = await this.client.fetchCharacter(this.characterId);
    this.dm = await c.DM();
  }

  public async sendMessage(
    message: string,
    image?: string | Buffer,
  ): Promise<string> {
    if (!this.dm) throw new Error("Not authenticated");
    if (image) {
      const data = await this.dm.uploadImageToServer(image);
      const resp = await this.dm.sendMessage(message, {}, { image: data });
      return resp.content;
    }
    const resp = await this.dm.sendMessage(message, {}, {});

    return resp.content;
  }
}

export const meishoClient = new CharacterAIClient(
  process.env.TOKEN || "",
  process.env.MEISHO_CHARID || "",
);
