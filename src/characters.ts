import { CharacterAIClient, meishoClient } from "./char-ai.js";

type Character = {
  id: string;
  name: string;
  view: string;
  client: CharacterAIClient;
};

export const characters: Record<string, Character> = {
  meisho: {
    id: "meisho",
    name: "Meisho Doto",
    view: "characters/meisho/meisho.html",
    client: meishoClient,
  },
  oguri: {
    id: "oguri",
    name: "Oguri",
    view: "characters/oguri/oguri.html",
    client: meishoClient,
  },
  goldship: {
    id: "goldship",
    name: "Gold Ship",
    view: "characters/goldship/goldship.html",
    client: meishoClient,
  }
} as const;

export type CharacterId = keyof typeof characters;
