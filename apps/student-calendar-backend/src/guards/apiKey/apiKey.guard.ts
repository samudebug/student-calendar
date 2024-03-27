import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Observable } from "rxjs";

@Injectable()
export class ApiKeyGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const apikey = request.headers['x-api-key'];
    if (!apikey) return false;
    const buff = Buffer.from(apikey, "base64");
    const decodedKey = buff.toString('ascii');
    return decodedKey === process.env.API_KEY.trim();
  }
}
