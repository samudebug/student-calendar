import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { IClassesRepository } from './repository/IClassesRepository';
import { Class, Student } from '@prisma/client';
import * as crypto from 'crypto';
import { auth } from 'firebase-admin';
import { Not } from 'typeorm';

@Injectable()
export class ClassesService {
  constructor(private classesRepository: IClassesRepository) {}

  async getByUser(createdBy: string): Promise<Class[]> {
    return this.classesRepository.getByUser(createdBy);
  }

  async getById(id: string): Promise<Class & {students: Student[]}> {
    const currentClass = await this.classesRepository.getById(id);
    if (!currentClass) throw new NotFoundException("Class not found");
    return currentClass;
  }

  async add(
    userId: string,
    newClass: Omit<
      Class,
      'id' | 'createdAt' | 'updatedAt' | 'code' | 'createdBy'
    >
  ): Promise<Class> {
    const code = this.generateCode();
    const user = await auth().getUser(userId);
    return this.classesRepository.add(
      { ...newClass, code, createdBy: userId },
      {
        userId: user.uid,
        name: user.displayName ?? '',
        photoUrl: user.photoURL ?? '',
      }
    );
  }

  async updateById(
    id: string,
    userId: string,
    classToUpdate: Partial<
      Omit<Class, 'id' | 'createdAt' | 'updatedAt' | 'code' | 'createdBy'>
    >
  ): Promise<Class> {
    const currentClass = await this.getById(id);
    if (!currentClass) throw new NotFoundException("Class not found");
    if (currentClass.createdBy !== userId) throw new UnauthorizedException("User cannot update this class");
    return this.classesRepository.updateById(id, userId, classToUpdate);
  }

  async deleteById(id: string, userId: string) {
    const currentClass = await this.getById(id);
    if (!currentClass) throw new NotFoundException("Class not found");
    if (currentClass.createdBy !== userId) throw new UnauthorizedException("User cannot delete this class");
    return this.classesRepository.deleteById(id);
  }

  async removeStudentFromClass(classId: string, userId: string,studentId: string) {
    return this.classesRepository.removeStudentFromClass(classId, userId, studentId);
  }

  async useInviteCode(code: string, userId: string) {
    const user = await auth().getUser(userId);
    const currentClass = await this.classesRepository.getByCode(code);
    if (!currentClass) throw new NotFoundException();
    const isStudentInClass = currentClass.students.some((el) => el.userId === userId);
    if (isStudentInClass) return currentClass;
    return await this.classesRepository.addStudentToClass(currentClass.id, {userId, name: user.displayName ?? "", photoUrl: user.photoURL ?? ""});
  }

  private generateCode() {
    return crypto.randomBytes(6).toString('hex').slice(0, 5).toUpperCase();
  }
}
