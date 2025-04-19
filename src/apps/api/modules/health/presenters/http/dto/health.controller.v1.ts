import { Controller, Get, Inject } from '@nestjs/common';
import { HealthCheck, HealthCheckService, HttpHealthIndicator } from '@nestjs/terminus';

import { AppConfig } from '@apps/api/modules/configuration/app';
import { DatabaseHealthService } from '@shared/infrastructure/database/health/health.service';

@Controller('v1/health')
export class HealthControllerV1 {
  constructor(
    @Inject(AppConfig) private _config: AppConfig,
    private _health: HealthCheckService,
    private _http: HttpHealthIndicator,
    private _db: DatabaseHealthService,
  ) {}

  @Get()
  @HealthCheck()
  async getHealth() {
    const data = await this._health.check([
      () => this._http.pingCheck('api', `http://localhost:${this._config.port}/reference`),
      () => this._db.isHealthy('database'),
    ]);

    return { ...data, timestamp: Date.now() };
  }
}
