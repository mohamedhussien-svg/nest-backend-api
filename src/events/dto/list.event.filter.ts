export enum When {
  Today = 1,
  Tomorrow,
  ThisWeek,
  NextWeek
}

export class ListEventFilter {
  when?: When;
  page?: number;
  size?: number;
  total?: boolean = true;
}
