import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ViewDetailsAdminDashBoardComponent } from '../../component/view-details-admin-dash-board/view-details-admin-dash-board.component';

@Injectable({
  providedIn: 'root'
})
export class DialogService {
  constructor(private modalService: NgbModal) { }

  openDialog() {
    const modalRef = this.modalService.open(ViewDetailsAdminDashBoardComponent ,{
      size: 'xl', // optional, adjusts the size of the modal
      centered: true, // optional, centers the modal vertically
      windowClass: 'modal-full' // custom CSS class for full width
    });
    modalRef.componentInstance.dummyData = 'Dummy Data'; // Pass data to dialog
  }
}
