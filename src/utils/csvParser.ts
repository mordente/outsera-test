import fs from "fs";
import { parse } from "csv-parse";
import { prisma } from "../app";

interface CsvRecord {
  year: string;
  title: string;
  studios: string;
  producers: string;
  winner?: string;
}

interface MovieInput {
  year: number;
  title: string;
  producer: string;
  winner: boolean;
}

class CsvParser {
  async importMovies(): Promise<void> {
    const records: MovieInput[] = [];

    const parser = fs.createReadStream("./data/movielist.csv").pipe(
      parse({
        columns: true,
        skip_empty_lines: true,
        trim: true,
        delimiter: ";",
      })
    );

    for await (const record of parser) {
      const producers = this.parseProducers(record.producers);

      for (const producer of producers) {
        const movieInput: MovieInput = {
          year: parseInt(record.year),
          title: record.title,
          producer: producer,
          winner: record.winner === "yes",
        };
        records.push(movieInput);
      }
    }

    try {
      await prisma.movie.createMany({
        data: records,
      });
      console.log(`Imported ${records.length} records successfully`);
    } catch (error) {
      console.error("Error importing records:", error);
      throw error;
    }
  }

  private parseProducers(producersString: string): string[] {
    return producersString
      .split(/,|\sand\s/)
      .map((producer) => producer.trim())
      .filter((producer) => producer.length > 0);
  }
}

export default new CsvParser();
