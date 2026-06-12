import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { KubernetesService } from '../../services/kubernetes';

@Component({
  selector: 'app-pods',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pods.html',
  styleUrl: './pods.scss'
})
export class PodsComponent implements OnInit {
  pods: any[] = [];
  filtered: any[] = [];
  loading = true;
  search = '';
  selectedStatus = 'all';

  constructor(private k8s: KubernetesService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.loadPods();
  }

  loadPods() {
    this.loading = true;
    this.k8s.getPods().subscribe({
      next: (data) => {
        this.pods = data;
        this.applyFilters();
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => console.error(err)
    });
  }

  applyFilters() {
    this.filtered = this.pods.filter(pod => {
      const matchSearch = pod.metadata?.name
        .toLowerCase()
        .includes(this.search.toLowerCase());
      const matchStatus = this.selectedStatus === 'all' ||
        pod.status?.phase === this.selectedStatus;
      return matchSearch && matchStatus;
    });
  }

  getStatus(pod: any): string {
    return pod.status?.phase || 'Unknown';
  }

  getStatusClass(pod: any): string {
    const phase = pod.status?.phase;
    if (phase === 'Running') return 'badge-green';
    if (phase === 'Pending') return 'badge-yellow';
    if (phase === 'Failed') return 'badge-red';
    return '';
  }

  getAge(pod: any): string {
    const created = new Date(pod.metadata?.creationTimestamp);
    const now = new Date();
    const diff = Math.floor((now.getTime() - created.getTime()) / 1000 / 60);
    if (diff < 60) return `${diff}m`;
    if (diff < 1440) return `${Math.floor(diff / 60)}h`;
    return `${Math.floor(diff / 1440)}d`;
  }

  getRestarts(pod: any): number {
    const containers = pod.status?.containerStatuses || [];
    return containers.reduce((sum: number, c: any) => sum + (c.restartCount || 0), 0);
  }

  getContainerCount(pod: any): number {
    return pod.spec?.containers?.length || 0;
  }
}