import type { ChainId } from "./wallet/config";

export type Address = {
  [key in ChainId]?: string;
}
