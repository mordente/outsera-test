export interface ProducerInterval {
  producer: string;
  interval: number;
  previousWin: number;
  followingWin: number;
}

export interface ProducerIntervals {
  min: ProducerInterval[];
  max: ProducerInterval[];
}
