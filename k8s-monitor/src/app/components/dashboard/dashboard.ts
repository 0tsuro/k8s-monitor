import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KubernetesService } from '../../services/kubernetes';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class DashboardComponent implements OnInit {
  pods: any[] = [];
  services: any[] = [];
  deployments: any[] = [];
  nodes: any[] = [];
  loading = true;

  runningPods = 0;
  pendingPods = 0;
  failedPods = 0;

  constructor(private k8s: KubernetesService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.loading = true;
    let completed = 0;
    const total = 4;

    const done = () => {
      completed++;
      if (completed === total) {
        this.runningPods = this.pods.filter(p => p.status?.phase === 'Running').length;
        this.pendingPods = this.pods.filter(p => p.status?.phase === 'Pending').length;
        this.failedPods = this.pods.filter(p => p.status?.phase === 'Failed').length;
        this.loading = false;
        this.cdr.detectChanges();
      }
    };

    this.k8s.getNodes().subscribe({ next: (data) => { this.nodes = data; done(); }, error: () => done() });
    this.k8s.getPods().subscribe({ next: (data) => { this.pods = data; done(); }, error: () => done() });
    this.k8s.getServices().subscribe({ next: (data) => { this.services = data; done(); }, error: () => done() });
    this.k8s.getDeployments().subscribe({ next: (data) => { this.deployments = data; done(); }, error: () => done() });
  }

  getNodeStatus(node: any): string {
    const ready = node.status?.conditions?.find((c: any) => c.type === 'Ready');
    return ready?.status === 'True' ? 'Ready' : 'NotReady';
  }

  getCPU(node: any): string {
    return node.status?.allocatable?.cpu || 'N/A';
  }

  getMemory(node: any): string {
    const mem = node.status?.allocatable?.memory;
    if (!mem) return 'N/A';
    const gb = Math.round(parseInt(mem) / 1024 / 1024);
    return `${gb} GB`;
  }
}