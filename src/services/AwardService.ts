import { PrismaClient } from "@prisma/client";
import { ProducerInterval, ProducerIntervals } from "../types/award";

const prisma = new PrismaClient();

class AwardService {
  async getProducerIntervals(): Promise<ProducerIntervals> {
    const winners = await prisma.movie.findMany({
      where: { winner: true },
      orderBy: { year: "asc" },
    });

    const producerWins = this.groupWinsByProducer(winners);
    const intervals = this.calculateIntervals(producerWins);

    return {
      min: this.getMinIntervals(intervals),
      max: this.getMaxIntervals(intervals),
    };
  }

  private groupWinsByProducer(winners: any[]): Record<string, number[]> {
    const producerWins: Record<string, number[]> = {};

    winners.forEach((movie) => {
      const producers = movie.producer
        .split(/,|\sand\s/)
        .map((p: string) => p.trim());

      producers.forEach((producer: string) => {
        if (!producerWins[producer]) {
          producerWins[producer] = [];
        }
        producerWins[producer].push(movie.year);
      });
    });

    return producerWins;
  }

  private calculateIntervals(
    producerWins: Record<string, number[]>
  ): ProducerInterval[] {
    const intervals: ProducerInterval[] = [];

    for (const [producer, years] of Object.entries(producerWins)) {
      if (years.length >= 2) {
        for (let i = 1; i < years.length; i++) {
          intervals.push({
            producer,
            interval: years[i] - years[i - 1],
            previousWin: years[i - 1],
            followingWin: years[i],
          });
        }
      }
    }

    return intervals;
  }

  private getMinIntervals(intervals: ProducerInterval[]): ProducerInterval[] {
    if (intervals.length === 0) return [];
    const minInterval = Math.min(...intervals.map((i) => i.interval));
    return intervals.filter((i) => i.interval === minInterval);
  }

  private getMaxIntervals(intervals: ProducerInterval[]): ProducerInterval[] {
    if (intervals.length === 0) return [];
    const maxInterval = Math.max(...intervals.map((i) => i.interval));
    return intervals.filter((i) => i.interval === maxInterval);
  }
}

export default new AwardService();
