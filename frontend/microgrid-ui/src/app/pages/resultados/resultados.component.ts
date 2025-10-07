import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../services/api.service';
@Component({
  standalone: true, imports:[CommonModule], selector:'app-resultados',
  templateUrl:'./resultados.component.html', styleUrls:['./resultados.component.css']
}) export class ResultadosComponent implements OnInit {
  kpis:any=null; loading=true; error='';
  constructor(private route: ActivatedRoute, private api: ApiService){}
  async ngOnInit(){ const runId = this.route.snapshot.queryParamMap.get('runId') ?? 'demo-run-001';
    const res = await this.api.results(runId); this.loading=false;
    if(!res.ok){ this.error = res.error ?? 'No hay resultados'; return; }
    this.kpis = res.data!.kpis; }
}
