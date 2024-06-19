export function generateSpotNames(numberOfSpots: number): string[] {
  const spotNames: string[] = [];
  const rows = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  let row = 0;
  let number = 1;

  for (let i = 0; i < numberOfSpots; i++) {
    spotNames.push(`${rows[row]}${number}`);
    number++;
    if (number > 10) {
      number = 1;
      row++;
    }
  }

  return spotNames;
}

export function customSort(a: string, b: string): number {
  const matchA = a.match(/^([A-Za-z]+)(\d+)$/);
  const matchB = b.match(/^([A-Za-z]+)(\d+)$/);

  if (!matchA || !matchB) {
    return a.localeCompare(b);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, letterA, numberA] = matchA;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [__, letterB, numberB] = matchB;

  const letterComparison = letterA.localeCompare(letterB);
  if (letterComparison !== 0) {
    return letterComparison;
  }

  return parseInt(numberA) - parseInt(numberB);
}
