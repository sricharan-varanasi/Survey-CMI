export type Subscale = {
  id?: number;
  name: string;
  method: "sum" | "average";
  question_ids: number[];
};

export type Question = {
  id: number;
  text: string;
};
