import {
  CallHandler,
  ExecutionContext,
  UseInterceptors,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { plainToClass } from 'class-transformer';
import { UserDto } from 'src/users/dto/user.dto';

export class SerializeInterceptor implements NestInterceptor {
  constructor(private dto: any) {}
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
