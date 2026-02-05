export interface Note {
  day: number;
  date: string; // ISO date string
  image: string | null; // base64 or URL
  description: string;
}
