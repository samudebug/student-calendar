import { Class, Student } from "@prisma/client";
import { PaginatedResult } from "../../../models/paginatedResult";

export abstract class IClassesRepository {
  abstract getByUser(createdBy: string, page?: number): Promise<PaginatedResult<Class>>;
  abstract getById(id: string): Promise<Class & {students: Student[]}>;
  abstract getByCode(code: string): Promise<Class & {students: Student[]}>;
  abstract addStudentToClass(classId: string, student: {userId: string, name: string, photoUrl: string});
  abstract add(
    newClass: Omit<Class, 'id' | 'createdAt' | 'updatedAt'>,
    user: {userId: string, name: string, photoUrl: string}
  ): Promise<Class>;
  abstract updateById(
    id: string,
    userId: string,
    classToUpdate: Partial<Omit<
      Class,
      'id' | 'createdAt' | 'updatedAt' | 'code' | 'createdBy'
    >>
  );
  abstract deleteById(id: string): Promise<boolean>;
  abstract removeStudentFromClass(classId: string, studentId: string): Promise<boolean>;
}
