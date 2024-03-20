import { Injectable, UnauthorizedException } from '@nestjs/common';
import { IClassesRepository } from './repository/IClassesRepository';
import { Class } from '@prisma/client';
import * as crypto from "crypto";

@Injectable()
export class ClassesService {
  constructor(private classesRepository: IClassesRepository) {

  }

  async getByUser(createdBy: string): Promise<Class[]> {
    return this.classesRepository.getByUser(createdBy);
  }

  async getById(id: string): Promise<Class> {
    return this.classesRepository.getById(id);
  }

  async add(userId: string, newClass: Omit<Class, 'id' | 'createdAt' | 'updatedAt' | 'code' | 'createdBy'>): Promise<Class> {
    const code = this.generateCode();
    return this.classesRepository.add({...newClass, code, createdBy: userId});
  }

  async updateById(id: string, userId: string, classToUpdate: Partial<Omit<Class, 'id' | 'createdAt' | 'updatedAt' | 'code' | 'createdBy'>>): Promise<Class> {
    const currentClass = await this.getById(id);
    if (currentClass.createdBy !== userId) throw new UnauthorizedException();
    return this.classesRepository.updateById(id, userId, classToUpdate);
  }

  async deleteById(id: string, userId: string) {
    const currentClass = await this.getById(id);
    if (currentClass.createdBy !== userId) throw new UnauthorizedException();
    return this.classesRepository.deleteById(id);
  }

  private generateCode() {
    return crypto.randomBytes(6).toString('hex').slice(0,5).toUpperCase();
  }
}
