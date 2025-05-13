import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Report } from './report.entity';
import { User } from '@/users/users.entity';
@Injectable()
export class ReportsService {
  constructor(@InjectRepository(Report) private repo: Repository<Report>) { }

  async createReport(
    make: string,
    model: string,
    year: number,
    lng: number,
    lat: number,
    mileage: number,
    price: number,
    user: User,
  ) {
    const newReport = this.repo.create({
      make,
      model,
      year,
      lng,
      lat,
      mileage,
      price,
    });
    newReport.user = user;
    return await this.repo.save(newReport);
  }
}
