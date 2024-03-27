import { Student } from "@prisma/client";

export abstract class IStudentRepository {
  abstract getStudentByUserId(userId: string, classId: string): Promise<Student>;
}
