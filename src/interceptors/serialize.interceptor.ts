import {
  CallHandler,
  ExecutionContext,
  UseInterceptors,
  NestInterceptor,
  Type,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { plainToClass } from 'class-transformer';

export function Serialize<T>(dto: Type<T>) {
  return UseInterceptors(new SerializeInterceptor(dto));
}

export class SerializeInterceptor<T> implements NestInterceptor {
  constructor(private dto: Type<T>) {}
  intercept(context: ExecutionContext, handler: CallHandler): Observable<any> {
    // console.log('Before the request is handled...', context);
    return handler.handle().pipe(
      map((data: any) => {
        // console.log('Before the response is sent...', data);
        return plainToClass(this.dto, data, { excludeExtraneousValues: true });
      }),
    );
  }
}
