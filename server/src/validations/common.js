import { z } from "zod";

export const idParam = z.object({ params: z.object({ id: z.string().min(1) }) });
export const emptyQuery = z.object({ query: z.object({}).passthrough().optional() });
export const roleEnum = z.enum(["ADMIN", "FACULTY", "STUDENT"]);
export const attendanceStatusEnum = z.enum(["PRESENT", "ABSENT", "LATE"]);
export const objectId = z.string().regex(/^[a-f\d]{24}$/i, "Invalid MongoDB ObjectId");
