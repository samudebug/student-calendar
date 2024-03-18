import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { auth } from "firebase-admin";

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers?.authorization;
    if (!token) return false;
    return this.verifyToken(token);
  }

  private async verifyToken(token: string): Promise<boolean> {
    const decodedToken = await auth().verifyIdToken(token);
    return !!decodedToken;
  }
}
