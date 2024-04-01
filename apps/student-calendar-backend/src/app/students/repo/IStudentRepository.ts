import { Student, User } from '@prisma/client';

export abstract class IStudentRepository {
  abstract getStudentByUserId(
    userId: string,
    classId: string
  ): Promise<Student>;
  abstract getStudentsByClass(
    classId: string
  ): Promise<(Student & {user: User})[]>
}
