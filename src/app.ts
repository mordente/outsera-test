import express, { Express } from "express";
import { PrismaClient } from "@prisma/client";
import AwardController from "./controllers/AwardController";
import csvParser from "./utils/csvParser";

export const prisma = new PrismaClient();

class App {
  public app: Express;

  constructor() {
    this.app = express();
    this.middleware();
    this.routes();
    this.handleShutdown();
  }

  private middleware(): void {
    this.app.use(express.json());
  }

  private routes(): void {
    const router = express.Router();

    router.get("/producers/intervals", AwardController.getProducerIntervals);

    this.app.use("/api", router);
  }

  private handleShutdown(): void {
    process.on("beforeExit", async () => {
      await prisma.$disconnect();
    });
  }

  public async initializeDatabase(): Promise<void> {
    try {
      await prisma.$executeRaw`DELETE FROM Movie`;
      await csvParser.importMovies();
      console.log("Database initialized successfully");
    } catch (error) {
      console.error("Error initializing database:", error);
      throw error;
    }
  }
}

const application = new App();
export { application };
