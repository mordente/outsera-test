import { Request, Response } from "express";
import AwardService from "../services/AwardService";

class AwardController {
  async getProducerIntervals(req: Request, res: Response): Promise<Response> {
    try {
      const intervals = await AwardService.getProducerIntervals();
      return res.json(intervals);
    } catch (error) {
      return res
        .status(500)
        .json({
          error: error instanceof Error ? error.message : "Unknown error",
        });
    }
  }
}

export default new AwardController();
