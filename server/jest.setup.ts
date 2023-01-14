import dotenv from "dotenv";
dotenv.config();

beforeAll(async () => {
  jest.spyOn(console, "log").mockImplementation(() => {});
});
