import { TypeOrmModuleOptions } from "@nestjs/typeorm";
export const typeOrmConfig: TypeOrmModuleOptions = {
  type: "mongodb",
  host: "localhost",
  port: 27017,
  database: "student-calendar",
  synchronize: true,
  logging: true,
  entities: [__dirname + "/../**/*.entity.{js,ts}"]
}
