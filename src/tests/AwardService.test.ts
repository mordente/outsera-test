import { PrismaClient } from "@prisma/client";
import AwardService from "../services/AwardService";
import { ProducerInterval } from "src/types/award";

describe("AwardService Integration Tests", () => {
  let prisma: PrismaClient;

  beforeAll(async () => {
    prisma = new PrismaClient();

    await prisma.movie.deleteMany({});

    await prisma.movie.createMany({
      data: [
        { title: "Movie 1", year: 1986, producer: "Producer 1", winner: true },
        { title: "Movie 2", year: 1990, producer: "Producer 1", winner: true },
        { title: "Movie 3", year: 2000, producer: "Producer 2", winner: true },
        { title: "Movie 4", year: 2015, producer: "Producer 2", winner: true },
        { title: "Movie 5", year: 2001, producer: "Producer 3", winner: true },
        { title: "Movie 6", year: 2002, producer: "Producer 3", winner: true },
        {
          title: "Movie 7",
          year: 1999,
          producer: "Producer 4, Producer 5",
          winner: true,
        },
        {
          title: "Movie 8",
          year: 2004,
          producer: "Producer 4 and Producer 5",
          winner: true,
        },
      ],
    });
  });

  afterAll(async () => {
    await prisma.movie.deleteMany({});
    await prisma.$disconnect();
  });

  it("should return correct producer intervals", async () => {
    const result = await AwardService.getProducerIntervals();

    expect(result.min).toHaveLength(1);
    expect(result.min[0]).toEqual({
      producer: "Producer 3",
      interval: 1,
      previousWin: 2001,
      followingWin: 2002,
    });

    expect(result.max).toHaveLength(1);
    expect(result.max[0]).toEqual({
      producer: "Producer 2",
      interval: 15,
      previousWin: 2000,
      followingWin: 2015,
    });
  });

  it("should handle multiple producers in the same movie", async () => {
    const result = await AwardService.getProducerIntervals();

    const allIntervals = (AwardService as any).calculateIntervals(
      (AwardService as any).groupWinsByProducer(
        await prisma.movie.findMany({ where: { winner: true } })
      )
    );

    const producer4Interval = allIntervals.find(
      (i: ProducerInterval) => i.producer === "Producer 4"
    );
    const producer5Interval = allIntervals.find(
      (i: ProducerInterval) => i.producer === "Producer 5"
    );

    expect(producer4Interval).toBeDefined();
    expect(producer5Interval).toBeDefined();
    expect(producer4Interval).toEqual({
      producer: "Producer 4",
      interval: 5,
      previousWin: 1999,
      followingWin: 2004,
    });
    expect(producer5Interval).toEqual({
      producer: "Producer 5",
      interval: 5,
      previousWin: 1999,
      followingWin: 2004,
    });

    expect(result.min).not.toContainEqual(producer4Interval);
    expect(result.max).not.toContainEqual(producer4Interval);
  });
});
