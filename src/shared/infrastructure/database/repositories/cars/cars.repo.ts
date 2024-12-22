import { ICarsRepository } from '@apps/api/modules/cars/application/contracts';
import { Car } from '@domain/cars/car.entity';
import { Injectable } from '@nestjs/common';
import { BaseRepository } from '@shared/infrastructure/database/repositories/core';
import { cars } from '@shared/infrastructure/database/schemas';
import { eq, sql } from 'drizzle-orm';

@Injectable()
export class CarsRepository extends BaseRepository implements ICarsRepository {
  async getOneById(id: string): Promise<Car | undefined> {
    const model = await this._drizzle.query.cars.findFirst({
      where: (cars, { eq }) => eq(cars.id, id),
    });
    return Car.fromDatabaseModel(model);
  }

  async create({ model }: { model: string }): Promise<Car> {
    const [car] = await this._drizzle
      .insert(cars)
      .values({ model })
      .returning();
    return Car.fromDatabaseModel(car);
  }

  async getAll(): Promise<Car[]> {
    const allCars = await this._drizzle.select().from(cars);
    return allCars.map((car) => Car.fromDatabaseModel(car));
  }

  async delete(id: string): Promise<void> {
    await this._drizzle.delete(cars).where(eq(cars.id, id));
  }

  async incrementRidesCount(id: string): Promise<Car> {
    const [car] = await this._drizzle
      .update(cars)
      .set({ ridesCount: sql`${cars.ridesCount} + 1` } as any)
      .where(eq(cars.id, id))
      .returning();
    return Car.fromDatabaseModel(car);
  }
}
