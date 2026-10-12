import { z } from "zod";

export const feedbackLimits = {
  nameMin: 2,
  name: 50,
  commentMin: 10,
  comment: 300,
  ratingMin: 1,
  ratingMax: 5,
};

export const feedbackSchema = z.object({
  name: z
    .string({ required_error: "Your name is required" })
    .trim()
    .min(feedbackLimits.nameMin, "Use at least 2 characters for your name")
    .max(feedbackLimits.name, "Your name must not exceed 50 characters"),
  email: z
    .string({ required_error: "Your email is required" })
    .trim()
    .email("Enter a valid email address"),
  rating: z
    .number({ required_error: "Choose a rating" })
    .int("Choose a whole number of stars")
    .min(feedbackLimits.ratingMin, "Choose at least 1 star")
    .max(feedbackLimits.ratingMax, "Choose no more than 5 stars"),
  comment: z
    .string({ required_error: "Write your feedback" })
    .trim()
    .min(
      feedbackLimits.commentMin,
      "Write at least 10 characters about your experience",
    )
    .max(
      feedbackLimits.comment,
      "Your feedback must not exceed 300 characters",
    ),
  isAnonymous: z.boolean().default(false),
});

export type FeedbackFormData = z.infer<typeof feedbackSchema>;
export type FeedbackFormInput = z.input<typeof feedbackSchema>;

export const feedbackDefaults: FeedbackFormData = {
  name: "",
  email: "",
  rating: feedbackLimits.ratingMax,
  comment: "",
  isAnonymous: false,
};

export function formatFeedback(data: FeedbackFormData): string {
  return `Name: ${data.isAnonymous ? "Anonymous" : data.name}\nEmail: ${data.email}\nRating: ${data.rating} ★\nFeedback: ${data.comment}`;
}
