export type Video = {
  title: string;
  channel: string;
  url: string;
};

export type Topic = {
  id: string;
  name: string;
  explanation: string;
  videos: Video[];
};

export type Unit = {
  id: string;
  name: string;
  hours: number;
  topics: Topic[];
};

export type Course = {
  code: string;
  name: string;
  type: "compulsory" | "elective";
  electiveGroup?: "Elective III" | "Elective IV" | "Elective V" | "Elective VI" | null;
  units: Unit[];
};

export type Semester = {
  id: string;
  name: string;
  courses: Course[];
};
