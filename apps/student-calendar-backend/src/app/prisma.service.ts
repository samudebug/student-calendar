import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleDestroy() {
    Logger.log("Disconnecting from database");
    await this.$disconnect();
  }
  async onModuleInit() {

    Logger.log("Connecting to database");
    await this.$connect();
  }
}
