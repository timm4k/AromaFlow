export interface Todo {
  id: number;
  title: string;
  completed: boolean;
  userId: number;
}

export interface TodosState {
  items: Todo[];
  demoItems: Todo[];
  reflections: Record<number, TodoReflection>;
}

export interface TodoReflection {
  notes: string;
  rating: number | null;
}
