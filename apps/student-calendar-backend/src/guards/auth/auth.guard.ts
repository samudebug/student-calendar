import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { auth } from "firebase-admin";
import { DecodedIdToken } from 'firebase-admin/lib/auth/token-verifier';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    return this.verifyToken(request);
  }

  private async verifyToken(req: any): Promise<boolean> {
    const token = req.headers?.authorization;
    if (!token) return false;

    const decodedToken = await auth().verifyIdToken(token);
    if (decodedToken) {

      req.userId = decodedToken.uid;
    }
    return !!decodedToken;
  }
}
