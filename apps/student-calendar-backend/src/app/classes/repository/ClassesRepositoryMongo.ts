
import { Class } from "@prisma/client";
import { IClassesRepository } from "./IClassesRepository";
import { PrismaService } from "../../prisma.service";

export class ClassRepositoryMongo
  implements IClassesRepository
{
  constructor(private prismaService: PrismaService) {

  }
  async deleteById(id: string): Promise<boolean> {
    return !!(await this.prismaService.class.delete({
      where: {
        id,
      },
    }));
  }
  add({name, code, createdBy}: Omit<Class, 'id' | 'createdAt' | 'updatedAt'>): Promise<Class> {
    return this.prismaService.class.create({
      data: {
        name,
        code,
        createdBy,
        students: {
          create: {
            userId: createdBy
          }
        }
      }
    })
  }
  updateById(
    id: string,
    userId: string,
    {name}: Omit<Class, 'id' | 'createdAt' | 'updateAt' | 'code' | 'createdBy'>
  ) {
    return this.prismaService.class.update({
      where: {
        id,
        createdBy: userId
      },
      data: {
        name
      }
    })
  }
  getByUser(userId: string): Promise<Class[]> {
    return this.prismaService.class.findMany({
      where: {
        students: {
          some: {
            userId
          }
        }
      }
    })
  }
  getById(id: string): Promise<Class> {
    return this.prismaService.class.findFirst({
      where: {
        id
      }
    })
  }
}
