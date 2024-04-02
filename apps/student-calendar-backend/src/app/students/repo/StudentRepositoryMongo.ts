import { Student, User } from "@prisma/client";
import { PrismaService } from "../../prisma.service";
import { IStudentRepository } from "./IStudentRepository";

export class StudentRepositoryMongo implements IStudentRepository {
  constructor(private prismaService: PrismaService) { }
  getStudentByUserId(userId: string, classId: string): Promise<Student> {
    return this.prismaService.student.findUnique({
      where: {
        userId,
        classId
      }
    });
  }
  async getStudentsByClass(classId: string): Promise<(Student & { user: User })[]> {
    return this.prismaService.student.findMany({
      where: {
        classId
      },
      include: {
        user: true
      }
    })
  }
}
