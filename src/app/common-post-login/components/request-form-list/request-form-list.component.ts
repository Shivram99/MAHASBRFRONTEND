import { Component, OnInit } from '@angular/core';
import { RequestFormService } from '../../../services/RequestForm/request-form.service';

@Component({
  selector: 'app-request-form-list',
  standalone: false,
  templateUrl: './request-form-list.component.html',
  styleUrl: './request-form-list.component.css'
})
export class RequestFormListComponent  implements OnInit {

  requestList: any[] = [];
  loading = false;

  constructor(private requestFormService: RequestFormService) {}

  ngOnInit(): void {
    this.loadRequests();
  }

  loadRequests(): void {
    this.loading = true;
    this.requestFormService.getAllRequests().subscribe({
      next: (res) => {
        if (res.success) {
          this.requestList = res.data;
        }
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  // Optional UI actions
  edit(id: number) {
    console.log("Edit clicked:", id);
  }

  delete(id: number) {
    console.log("Delete clicked:", id);
  }
}
