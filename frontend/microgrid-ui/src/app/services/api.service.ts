import { Injectable } from '@angular/core';
export interface ApiResult<T=unknown> { ok: boolean; data?: T; error?: string; }
@Injectable({ providedIn: 'root' })
export class ApiService {
  base = '/api/v1';
  async validate(_: unknown): Promise<ApiResult>{ return { ok:true, data:{ issues: [] } }; }
  async simulate(_: { zni: string }): Promise<ApiResult<{ runId: string }>>{ return { ok:true, data:{ runId:'demo-run-001' } }; }
  async results(_: string): Promise<ApiResult<{ kpis: any }>>{ return { ok:true, data:{ kpis:{ lcoe:0.124, served:0.967, nse:0.033, p_inst:120 } } }; }
}
