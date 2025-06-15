import { z } from "zod";

export const CreateAccountSchema = z.object({
  accountName: z.string().min(1, "Account name is required"),
  website: z.string().url("Invalid website URL").optional(),
});


export const UpdateAccountSchema = CreateAccountSchema.partial();