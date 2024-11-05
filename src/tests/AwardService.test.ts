import request from "supertest";
import { ProducerIntervals } from "src/types/award";
import { application } from "../app";

describe("AwardService Integration Tests", () => {
  let expectedResult: ProducerIntervals;

  beforeAll(() => {
    expectedResult = {
      min: [
        {
          producer: "Joel Silver",
          interval: 1,
          previousWin: 1990,
          followingWin: 1991,
        },
      ],
      max: [
        {
          producer: "Matthew Vaughn",
          interval: 13,
          previousWin: 2002,
          followingWin: 2015,
        },
      ],
    };
  });

  it("should return producer intervals matching the CSV data", async () => {
    await application.initializeDatabase();

    const response = await request(application.app)
      .get("/api/producers/intervals")
      .expect(200);

    const result = response.body as ProducerIntervals;

    expect(result).toHaveProperty("min");
    expect(result).toHaveProperty("max");
    expect(Array.isArray(result.min)).toBeTruthy();
    expect(Array.isArray(result.max)).toBeTruthy();

    expect(result).toEqual(expectedResult);
  });
});
