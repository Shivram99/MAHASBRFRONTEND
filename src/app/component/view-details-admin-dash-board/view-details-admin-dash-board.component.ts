import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-view-details-admin-dash-board',
  templateUrl: './view-details-admin-dash-board.component.html',
  styleUrl: './view-details-admin-dash-board.component.css'
})
export class ViewDetailsAdminDashBoardComponent {
  @Input() dummyData: any;

  constructor(public activeModal: NgbActiveModal) { }

  generatePDF() {
    const element = document.getElementById('pdfContent'); // ID of the HTML element you want to convert to PDF
  
    if (!element) {
      console.error('Element with ID "pdfContent" not found.');
      return;
    }
  
    html2canvas(element).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF();
      const imgWidth = 210; // Width of A4 in mm
      const pageHeight = 297; // Height of A4 in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
  
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
        
      }
  
      pdf.save('generated.pdf');
    }).catch((error) => {
      console.error('An error occurred while generating PDF:', error);
    });
  }
}

