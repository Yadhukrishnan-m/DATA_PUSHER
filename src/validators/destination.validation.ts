import { z } from "zod";

export const createDestinationSchema = z.object({
  url: z.string().url({ message: "Invalid URL format" }),
  httpMethod: z.enum(["POST", "PUT", "PATCH","GET","put","patch","post","get","delete","DELETE"], {
    required_error: "HTTP method is required",
    invalid_type_error: "HTTP method must be one of: POST, PUT, PATCH",
  }),
  headers: z.record(z.string()).refine((obj) => Object.keys(obj).length > 0, {
    message: "Headers must contain at least one key-value pair",
  }),
});


export const updateDestinationSchema = createDestinationSchema.partial();