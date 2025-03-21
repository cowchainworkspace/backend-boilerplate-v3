import { AppConfig } from '@apps/api/modules/configuration/app';
import { Controller, Get, Inject } from '@nestjs/common';
import {
  HealthCheck,
  HealthCheckService,
  HttpHealthIndicator,
} from '@nestjs/terminus';
import { DatabaseHealthService } from '@shared/infrastructure/database/health/health.service';

@Controller('v1/health')
export class HealthControllerV1 {
  constructor(
    @Inject(AppConfig) private config: AppConfig,
    private health: HealthCheckService,
    private http: HttpHealthIndicator,
    private db: DatabaseHealthService,
  ) {}

  @Get()
  @HealthCheck()
  async getHealth() {
    const data = await this.health.check([
      () =>
        this.http.pingCheck(
          'api',
          `http://localhost:${this.config.port}/reference`,
        ),
      () => this.db.isHealthy('database'),
    ]);

    return { ...data, timestamp: Date.now() };
  }
}
