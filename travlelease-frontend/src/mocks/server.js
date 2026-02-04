import { setupServer } from "msw/node";
import { handlers } from "./handlers";   // ✅ import handlers, not server

export const server = setupServer(...handlers);