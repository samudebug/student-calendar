import { Injectable } from '@nestjs/common';
import { IStudentRepository } from './repo/IStudentRepository';
import { Student, User } from '@prisma/client';

@Injectable()
export class StudentsService {
  constructor(private repo: IStudentRepository) {}

  async getStudentByUserIdAndClassId(userId: string, classId: string): Promise<Student> {
    return this.repo.getStudentByUserId(userId, classId);
  }

  async getStudentsByClassId(classId: string): Promise<(Student & {user: User})[]> {
    return this.repo.getStudentsByClass(classId);
  }
}
