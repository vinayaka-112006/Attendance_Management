import { z } from "zod";
import { attendanceStatusEnum, objectId, roleEnum } from "./common.js";

export const registerSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(6),
    role: roleEnum.default("STUDENT")
  })
});

export const studentRegisterSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(6),
    role: roleEnum.default("STUDENT"),
    rollNo: z.string().optional(),
    name: z.string().optional(),
    sectionId: objectId.optional(),
    semester: z.coerce.number().int().positive().optional(),
    department: z.string().optional(),
    employeeId: z.string().optional(),
    photoUrl: z.string().url().optional().or(z.literal(""))
  }).superRefine((data, ctx) => {
    if (data.role === "STUDENT") {
      for (const field of ["rollNo", "name", "sectionId", "semester"]) {
        if (!data[field]) ctx.addIssue({ code: z.ZodIssueCode.custom, path: [field], message: `${field} is required for students` });
      }
    }
    if (data.role === "FACULTY") {
      for (const field of ["name", "department", "employeeId"]) {
        if (!data[field]) ctx.addIssue({ code: z.ZodIssueCode.custom, path: [field], message: `${field} is required for faculty` });
      }
    }
  })
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(1)
  })
});

export const userCreateSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(6),
    role: roleEnum
  })
});

export const studentSchema = z.object({
  body: z.object({
    email: z.string().email().optional(),
    password: z.string().min(6).optional(),
    userId: z.string().optional(),
    rollNo: z.string().min(1),
    name: z.string().min(1),
    sectionId: objectId,
    semester: z.coerce.number().int().positive(),
    photoUrl: z.string().url().optional().or(z.literal(""))
  }).refine((data) => data.userId || (data.email && data.password), {
    message: "Provide either userId or both email and password",
    path: ["email"]
  })
});

export const studentUpdateSchema = z.object({
  body: z.object({
    rollNo: z.string().min(1),
    name: z.string().min(1),
    sectionId: objectId,
    semester: z.coerce.number().int().positive(),
    photoUrl: z.string().url().optional().or(z.literal(""))
  })
});

export const facultySchema = z.object({
  body: z.object({
    email: z.string().email().optional(),
    password: z.string().min(6).optional(),
    userId: z.string().optional(),
    name: z.string().min(1),
    department: z.string().min(1),
    employeeId: z.string().min(1)
  }).refine((data) => data.userId || (data.email && data.password), {
    message: "Provide either userId or both email and password",
    path: ["email"]
  })
});

export const facultyUpdateSchema = z.object({
  body: z.object({
    name: z.string().min(1),
    department: z.string().min(1),
    employeeId: z.string().min(1)
  })
});

export const sectionSchema = z.object({
  body: z.object({
    name: z.string().min(1),
    batchYear: z.coerce.number().int(),
    department: z.string().min(1)
  })
});

export const subjectSchema = z.object({
  body: z.object({
    name: z.string().min(1),
    code: z.string().min(1),
    semester: z.coerce.number().int().positive(),
    facultyId: objectId,
    sectionId: objectId
  })
});

export const attendanceMarkSchema = z.object({
  body: z.object({
    subjectId: objectId,
    date: z.string().min(1),
    entries: z.array(z.object({
      studentId: objectId,
      status: attendanceStatusEnum.default("ABSENT")
    })).min(1)
  })
});

export const attendanceUpdateSchema = z.object({
  body: z.object({
    status: attendanceStatusEnum,
    reason: z.string().min(3).optional()
  })
});

export const correctionSchema = z.object({
  body: z.object({
    status: attendanceStatusEnum,
    reason: z.string().min(3)
  })
});

export const reportQuerySchema = z.object({
  query: z.object({
    studentId: z.string().optional(),
    subjectId: z.string().optional(),
    sectionId: z.string().optional(),
    from: z.string().optional(),
    to: z.string().optional()
  })
});
