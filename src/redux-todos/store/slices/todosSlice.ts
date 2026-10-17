import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { todosConfig } from "../../config";
import type { Todo, TodoReflection, TodosState } from "../../types";

const initialState: TodosState = { items: [], demoItems: [], reflections: {} };

const todosSlice = createSlice({
  name: "todos",
  initialState,
  reducers: {
    addDemoTodo(state, { payload }: PayloadAction<Todo>) {
      const id = (state.demoItems[0]?.id ?? 0) - 1;
      state.demoItems.unshift({ ...payload, id });
    },
    addTodo(state, { payload }: PayloadAction<Todo>) {
      if (!state.items.some((item) => item.id === payload.id)) {
        state.items.unshift(payload);
      }
    },
    removeTodo(state, { payload }: PayloadAction<number>) {
      const index = state.items.findIndex((item) => item.id === payload);
      if (index !== -1) state.items.splice(index, 1);
      delete state.reflections[payload];
    },
    toggleTodo(state, { payload }: PayloadAction<number>) {
      const item = state.items.find((todo) => todo.id === payload);
      if (item) item.completed = !item.completed;
    },
    updateTodoReflection(
      state,
      {
        payload,
      }: PayloadAction<{ id: number; changes: Partial<TodoReflection> }>,
    ) {
      if (!state.items.some((todo) => todo.id === payload.id)) return;
      const reflection = state.reflections[payload.id] ?? {
        notes: "",
        rating: null,
      };
      const { notes, rating } = payload.changes;
      if (notes !== undefined) {
        reflection.notes = notes.slice(0, todosConfig.maxNotesLength);
      }
      if (
        rating === null ||
        (rating !== undefined &&
          Number.isInteger(rating) &&
          rating >= 1 &&
          rating <= todosConfig.maxRating)
      ) {
        reflection.rating = rating;
      }
      state.reflections[payload.id] = reflection;
    },
  },
});

export const {
  addTodo,
  removeTodo,
  toggleTodo,
  addDemoTodo,
  updateTodoReflection,
} = todosSlice.actions;
export default todosSlice.reducer;
