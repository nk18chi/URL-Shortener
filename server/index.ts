import { App } from "./server";
import dotenv from "dotenv";

dotenv.config();
const app = new App();
app.start();
