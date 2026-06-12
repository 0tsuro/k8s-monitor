import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { KubernetesService } from '../../services/kubernetes';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './services.html',
  styleUrl: './services.scss'
})
export class ServicesComponent implements OnInit {
  services: any[] = [];
  filtered: any[] = [];
  loading = true;
  search = '';

  constructor(private k8s: KubernetesService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.loadServices();
  }

  loadServices() {
    this.loading = true;
    this.k8s.getServices().subscribe({
      next: (data) => {
        this.services = data;
        this.applyFilters();
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => console.error(err)
    });
  }

  applyFilters() {
    this.filtered = this.services.filter(s =>
      s.metadata?.name.toLowerCase().includes(this.search.toLowerCase())
    );
  }

  getType(service: any): string {
    return service.spec?.type || 'ClusterIP';
  }

  getTypeClass(service: any): string {
    const type = service.spec?.type;
    if (type === 'LoadBalancer') return 'badge-blue';
    if (type === 'NodePort') return 'badge-yellow';
    return 'badge-gray';
  }

  getPorts(service: any): string {
    const ports = service.spec?.ports || [];
    return ports.map((p: any) => `${p.port}${p.nodePort ? ':' + p.nodePort : ''}/${p.protocol}`).join(', ');
  }

  getClusterIP(service: any): string {
    return service.spec?.clusterIP || 'N/A';
  }

  getAge(service: any): string {
    const created = new Date(service.metadata?.creationTimestamp);
    const now = new Date();
    const diff = Math.floor((now.getTime() - created.getTime()) / 1000 / 60);
    if (diff < 60) return `${diff}m`;
    if (diff < 1440) return `${Math.floor(diff / 60)}h`;
    return `${Math.floor(diff / 1440)}d`;
  }
}