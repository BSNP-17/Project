import "@testing-library/jest-dom";
import { server } from "./mocks/server";   // ✅ correct path

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());