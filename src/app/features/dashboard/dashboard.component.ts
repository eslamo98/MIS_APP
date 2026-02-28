import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/serivces/auth.service';
import { SearchResultsComponent } from '../../shared/components/search-results/search-results.component';
import { TableColumn, Modules } from '../../shared/models/common.model';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [CommonModule, SearchResultsComponent],
    template: `
    <div class="row g-4">
      <!-- Welcome Header -->
      <div class="col-12 mb-2">
        <h2 class="fw-bold text-white h1 mb-1">Dashboard</h2>
        <p class="text-muted">Welcome back, {{ authService.currentUserValue()?.nickname || 'User' }}! Here's what's happening.</p>
      </div>

      <!-- Stats Cards -->
      <div class="col-12 col-md-6 col-lg-3">
        <div class="dash-card p-4">
          <div class="d-flex justify-content-between mb-3">
            <div class="icon-box bg-primary-soft text-primary">
              <i class="fas fa-shopping-bag"></i>
            </div>
            <span class="badge bg-success-soft text-success">+12.5%</span>
          </div>
          <div class="dash-label">Total Orders</div>
          <div class="dash-value">1,280</div>
        </div>
      </div>

      <div class="col-12 col-md-6 col-lg-3">
        <div class="dash-card p-4">
          <div class="d-flex justify-content-between mb-3">
            <div class="icon-box bg-purple-soft text-purple">
              <i class="fas fa-users"></i>
            </div>
            <span class="badge bg-success-soft text-success">+8.2%</span>
          </div>
          <div class="dash-label">New Customers</div>
          <div class="dash-value">345</div>
        </div>
      </div>

      <div class="col-12 col-md-6 col-lg-3">
        <div class="dash-card p-4">
          <div class="d-flex justify-content-between mb-3">
            <div class="icon-box bg-blue-soft text-blue">
              <i class="fas fa-chart-line"></i>
            </div>
            <span class="badge bg-danger-soft text-danger">-2.4%</span>
          </div>
          <div class="dash-label">Net Sales</div>
          <div class="dash-value">$42,900</div>
        </div>
      </div>

      <div class="col-12 col-md-6 col-lg-3">
        <div class="dash-card p-4">
          <div class="d-flex justify-content-between mb-3">
            <div class="icon-box bg-orange-soft text-orange">
              <i class="fas fa-clock"></i>
            </div>
            <span class="badge bg-blue-soft text-blue">Stable</span>
          </div>
          <div class="dash-label">Avg. Service Time</div>
          <div class="dash-value">4.2m</div>
        </div>
      </div>

      <!-- Main Content Grid -->
      <div class="col-12 col-lg-8">
        <div class="dash-card h-100 p-0 overflow-hidden border-0 bg-transparent">
          <div class="p-4 border-0 d-flex justify-content-between align-items-center">
            <h5 class="mb-0 fw-bold">Recent Transactions</h5>
            <button class="btn btn-sm btn-outline-primary rounded-pill">View All</button>
          </div>
          
          <app-search-results 
            [data]="recentTransactions" 
            [columns]="transactionColumns"
            [moduleName]="Modules.Orders"
            [showEdit]="true"
            [showDelete]="true"
            [isPaged]="false">
          </app-search-results>
        </div>
      </div>

      <div class="col-12 col-lg-4">
        <div class="dash-card p-4 h-100">
          <h5 class="fw-bold mb-4">Quick Actions</h5>
          <div class="d-grid gap-3">
            <button class="btn btn-light border p-3 text-start d-flex align-items-center gap-3">
              <i class="fas fa-plus text-primary"></i> Create New Order
            </button>
            <button class="btn btn-light border p-3 text-start d-flex align-items-center gap-3">
              <i class="fas fa-file-export text-success"></i> Export Report
            </button>
            <button class="btn btn-light border p-3 text-start d-flex align-items-center gap-3">
              <i class="fas fa-cog text-muted"></i> System Settings
            </button>
          </div>
        </div>
      </div>

    </div>
  `,
    styles: [`
    .dash-card {
      background: var(--bg-surface);
      border-radius: 20px;
      border: 1px solid var(--border-color);
      height: 100%;
      box-shadow: var(--shadow-sm);
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }
    .dash-card:hover {
      transform: translateY(-5px);
      box-shadow: var(--card-shadow);
    }
    .icon-box {
      width: 52px;
      height: 52px;
      border-radius: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
    }
    .dash-label {
      color: var(--text-muted);
      font-size: 0.95rem;
      font-weight: 600;
      margin-bottom: 6px;
    }
    .dash-value {
      font-size: 2rem;
      font-weight: 800;
      color: var(--text-main);
      letter-spacing: -1px;
    }
    
    /* Stats Soft Colors - Themed */
    .bg-primary-soft { background: rgba(99, 102, 241, 0.12); color: #6366f1; }
    .bg-purple-soft { background: rgba(168, 85, 247, 0.12); color: #a855f7; }
    .bg-blue-soft { background: rgba(59, 130, 246, 0.12); color: #3b82f6; }
    .bg-orange-soft { background: rgba(249, 115, 22, 0.12); color: #f97316; }
    .bg-success-soft { background: rgba(34, 197, 94, 0.12); color: #22c55e; }
    .bg-danger-soft { background: rgba(239, 68, 68, 0.12); color: #ef4444; }
    
    .table-dark {
      background-color: var(--bg-app) !important;
      color: var(--text-main) !important;
      border: none !important;
    }
    .table { color: var(--text-main); }
    .table td { 
      border-color: var(--border-color); 
      padding: 1rem 0.75rem;
      color: var(--text-main);
    }
    .table tr:hover { background: rgba(99, 102, 241, 0.02); }
    .text-muted { color: var(--text-muted) !important; }
    .text-white { color: var(--text-main) !important; }
  `]
})
export class DashboardComponent {
    authService = inject(AuthService);
    Modules = Modules;

    transactionColumns: TableColumn[] = [
        { key: 'product', label: 'Product' },
        { key: 'status', label: 'Status', type: 'badge' },
        { key: 'date', label: 'Date', type: 'date' },
        { key: 'amount', label: 'Amount', type: 'currency' }
    ];

    recentTransactions = [
        { product: 'Ref: #ORD-001', status: 'Completed', date: new Date(), amount: 450.00 },
        { product: 'Ref: #ORD-002', status: 'Pending', date: new Date(), amount: 120.50 },
        { product: 'Ref: #ORD-003', status: 'Completed', date: new Date(), amount: 99.00 },
        { product: 'Ref: #ORD-004', status: 'Cancelled', date: new Date(), amount: 300.25 },
        { product: 'Ref: #ORD-005', status: 'Completed', date: new Date(), amount: 1500.00 }
    ];
}
