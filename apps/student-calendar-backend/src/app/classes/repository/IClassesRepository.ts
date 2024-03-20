import { Class, Student } from "@prisma/client";

export abstract class IClassesRepository {
  abstract getByUser(createdBy: string): Promise<Class[]>;
  abstract getById(id: string): Promise<Class>;
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
}
