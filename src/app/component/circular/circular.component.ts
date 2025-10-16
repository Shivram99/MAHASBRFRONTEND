import { Component } from '@angular/core';
import { CircularService } from '../../services/Circular/circular.service';
import { ErrorHandlerService } from '../../services/errorHandler/error-handler.service';
import { Circular } from '../../interface/circular';
import Swal from 'sweetalert2';
import { environment } from '../../../environments/environment.development';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Modal } from 'bootstrap';
@Component({
    selector: 'app-circular',
    templateUrl: './circular.component.html',
    styleUrl: './circular.component.css',
    standalone: false
})
export class CircularComponent {
    baseUrl = environment.apiUrl
    circulars: Circular[] = [];
     filteredCirculars: any[] = [];
    pdfUrl: SafeResourceUrl| string | null = null; // Safe type
    pdfTitle = '';
    isPdfModalOpen = false;
    private modalRef?: bootstrap.Modal;

    // PDF Viewer controls
  page = 1;
  totalPages = 0;
  zoom = 1.0;
    constructor(private circularService: CircularService, private errorHandler: ErrorHandlerService, private sanitizer: DomSanitizer) {
        this.loadCirculars();
    }

     // initially all shown

  searchText: string = '';
  fromDate: string = '';
  toDate: string = '';

    loadCirculars(): void {
        this.circularService.getAllCircularsForCitizen().subscribe({
            next: (data) => {
                this.circulars = data || [];
                  this.circulars = data || [];
        this.filteredCirculars = [...this.circulars]; 
            },
            error: (error) => {
                console.error('Error fetching circulars:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Failed to Load Circulars',
                    text: this.errorHandler.getErrorMessage(error),
                    confirmButtonColor: '#d33',
                });
            }
        });
    }

   openPdfModal(fileName: string, title: string) {
    this.circularService.getCircularFile(fileName).subscribe({
      next: (blob: Blob) => {
        if (!blob || blob.size === 0) {
          alert('PDF is empty or not found!');
          return;
        }

        const url = URL.createObjectURL(blob);
        this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
        this.pdfTitle = title;
        this.isPdfModalOpen = true;
        this.page = 1;
        this.zoom = 1.0;
      },
      error: (err) => {
        console.error('Failed to load PDF', err);
        alert('Failed to load PDF');
      }
    });
  }

  closePdfModal() {
    this.isPdfModalOpen = false;
    this.pdfUrl = null;
  }


   applyFilter() {
    this.filteredCirculars = this.circulars.filter(c => {
      const circularDate = new Date(c.date);
      const from = this.fromDate ? new Date(this.fromDate) : null;
      const to = this.toDate ? new Date(this.toDate) : null;

      const matchesSearch = this.searchText
        ? c.subject.toLowerCase().includes(this.searchText.toLowerCase())
        : true;

      const matchesDate =
        (!from || circularDate >= from) &&
        (!to || circularDate <= to);

      return matchesSearch && matchesDate;
    });
  }

}

