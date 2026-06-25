import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { map, Observable } from 'rxjs';
import { dataInterface } from '../../../interfaces/user-interceptors.interface';

@Injectable()
export class DataResponseInterceptor implements NestInterceptor {
  constructor(private readonly configService: ConfigService) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data: dataInterface) => ({
        apiVersion: this.configService.get<string>('appConfig.apiVersion'),
        data: data,
      })),
    );
  }
}
