import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { todosConfig } from "../config";
import type { Todo } from "../types";

export const todosApi = createApi({
  reducerPath: "todosApi",
  baseQuery: fetchBaseQuery({ baseUrl: todosConfig.baseUrl }),
  tagTypes: ["Todo"],
  endpoints: (builder) => ({
    getTodos: builder.query<Todo[], void>({
      query: () => todosConfig.listPath,
      providesTags: ["Todo"],
    }),
    addTodo: builder.mutation<Todo, Omit<Todo, "id">>({
      query: (body) => ({ method: "POST", url: "/todos", body }),
      invalidatesTags: ["Todo"],
    }),
  }),
});

export const { useGetTodosQuery, useAddTodoMutation } = todosApi;
