import { Component } from '@angular/core';

@Component({
  selector: 'app-citizen-dashboard',
  templateUrl: './citizen-dashboard.component.html',
  styleUrl: './citizen-dashboard.component.css'
})
export class CitizenDashboardComponent {
  fileInfo: string = '';

  onFileChange(event: any): void {
    const files = event.target.files;
    const filesCount = files.length;

    if (filesCount === 1) {
      const fileName = files[0].name;
      this.fileInfo = fileName;
    } else {
      this.fileInfo = `${filesCount} files selected`;
    }
  }
}
