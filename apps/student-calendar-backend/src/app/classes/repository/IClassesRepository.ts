import { Injectable } from "@nestjs/common";
import { Class } from "@prisma/client";

export abstract class IClassesRepository {
  abstract getByUser(createdBy: string): Promise<Class[]>;
  abstract getById(id: string): Promise<Class>;
  abstract add(
    newClass: Omit<Class, 'id' | 'createdAt' | 'updatedAt'>
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
