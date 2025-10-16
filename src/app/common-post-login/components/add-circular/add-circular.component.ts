import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Circular } from '../../../interface/circular';
import { CircularService } from '../../../services/Circular/circular.service';
import Swal from 'sweetalert2';
import { fileRequiredValidator } from '../../../model/file-validator';
import { ErrorHandlerService } from '../../../services/errorHandler/error-handler.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { MarathiInputService } from '../../../services/marathi-input.service';
import { environment } from '../../../../environments/environment.development';
@Component({
  selector: 'app-add-circular',
  standalone: false,
  templateUrl: './add-circular.component.html',
  styleUrl: './add-circular.component.css'
})
export class AddCircularComponent {

  circularForm!: FormGroup;
  selectedFile!: File;
  circulars: Circular[] = [];
  editMode: boolean = false;
  editingCircularId!: number;

  searchText: string = '';
  filteredCirculars: any[] = [];
  paginatedCirculars: any[] = [];

  itemsPerPage: number = 5;
  currentPage: number = 1;
  totalPages: number = 1;
  totalPagesArray: number[] = [];

  temsPerPage: number = 5;
  pageSizeOptions: number[] = [5, 10, 25, 50];

  visiblePages: number[] = [];

  pdfUrl: SafeResourceUrl | string | null = null; // Safe type
  pdfTitle = '';
  isPdfModalOpen = false;
  private modalRef?: bootstrap.Modal;

  
  inputText = '';
  marathiSuggestions: string[] = [];
  selectedIndex = -1;


  applicantName = '';
  fatherName = '';

  constructor(
    private fb: FormBuilder,
    private circularService: CircularService,
    private errorHandler: ErrorHandlerService,
    private sanitizer: DomSanitizer,
    private marathiService: MarathiInputService
  ) { }

  ngOnInit(): void {
    this.circularForm = this.fb.group({
      subject: ['', Validators.required],
      date: ['', Validators.required],
      file: [null, fileRequiredValidator],
      marathiInput: [''],
      
    });
    this.loadCirculars();
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    const file = event.target.files[0];
    this.circularForm.get('file')?.setValue(file);
  }

  submit() {
    if (this.circularForm.invalid || (!this.selectedFile && !this.editMode)) return;

    const formData = new FormData();
    if (this.editMode && this.editingCircularId) {
      formData.append('id', this.editingCircularId.toString());
    }

    formData.append('subject', this.circularForm.get('subject')?.value);
    formData.append('date', this.circularForm.get('date')?.value);

    // Only append file if a new file is selected
    if (this.selectedFile) {
      formData.append('file', this.selectedFile);
    }

    if (this.editMode) {
      // Edit flow
      this.circularService.updateCircular(this.editingCircularId, formData).subscribe({
        next: () => {
          Swal.fire('Success', 'Circular updated successfully', 'success');
          this.resetForm();
          this.loadCirculars();
        },
        error: (err) => {
          const msg = this.errorHandler.getErrorMessage(err);
          Swal.fire('Error', msg, 'error');
        }
      });
    } else {
      // Create flow
      this.circularService.createCircular(formData).subscribe({
        next: () => {
          Swal.fire('Success', 'Circular created successfully', 'success');
          this.resetForm();
          this.loadCirculars();
        },
        error: (err) => {
          const msg = this.errorHandler.getErrorMessage(err);
          Swal.fire('Error', msg, 'error');
        }
      });
    }
  }

  previousFileUrl: string | null = null;

  editCircular(circular: Circular) {
    this.editMode = true;
    this.editingCircularId = circular.id!;

    this.circularForm.patchValue({
      subject: circular.subject,
      date: circular.date,
    });

    // Show existing file if available
    if (circular.fileUrl) {
      this.previousFileUrl = `${environment.apiUrl}/citizenSearch/files/${circular.fileUrl}`;
    } else {
      this.previousFileUrl = null;
    }

    // Reset file input for optional new upload
    this.selectedFile = null!;
    this.circularForm.get('file')?.reset();
  }

  resetForm() {
    this.editMode = false;
    this.editingCircularId = 0;
    this.circularForm.reset();
    this.selectedFile = null!;
    this.circularForm.get('file')?.reset();
  }

  loadCirculars(): void {
    this.circularService.getAllCirculars().subscribe({
      next: (data) => {
        this.circulars = data || [];
        this.filteredCirculars = data || [];
        this.updatePagination();
      },
      error: (error) => {
        console.error('Error fetching circulars:', error);
        Swal.fire('Error', this.errorHandler.getErrorMessage(error), 'error');
      }
    });
  }

  deleteCircular(id: number): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This circular will be permanently deleted.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6'
    }).then((result) => {
      if (result.isConfirmed) {
        this.circularService.deleteCircular(id).subscribe({
          next: () => {
            Swal.fire({ icon: 'success', title: 'Deleted!', text: 'Circular deleted successfully.', timer: 1500, showConfirmButton: false });
            this.loadCirculars();
          },
          error: (error) => Swal.fire('Error', this.errorHandler.getErrorMessage(error), 'error')
        });
      }
    });
  }

  onInputChange(): void {
    if (this.inputText.trim()) {
      this.marathiService.getMarathiSuggestion(this.inputText).subscribe({
        next: (response) => {
          if (response && response[0] === 'SUCCESS' && response[1]?.[0]?.[1]) {
            this.marathiSuggestions = response[1][0][1];
            this.selectedIndex = -1; // reset selection on new input
          } else {
            this.marathiSuggestions = [];
          }
        },
        error: (err) => {
          console.error('Error fetching Marathi suggestions:', err);
          this.marathiSuggestions = [];
        }
      });
    } else {
      this.marathiSuggestions = [];
    }
  }

  onKeyDown(event: KeyboardEvent): void {
    if (this.marathiSuggestions.length === 0) return;

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      this.selectedIndex = (this.selectedIndex + 1) % this.marathiSuggestions.length;
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      this.selectedIndex =
        this.selectedIndex <= 0 ? this.marathiSuggestions.length - 1 : this.selectedIndex - 1;
    } else if (event.key === 'Enter') {
      event.preventDefault();
      if (this.selectedIndex >= 0 && this.selectedIndex < this.marathiSuggestions.length) {
        this.selectSuggestion(this.marathiSuggestions[this.selectedIndex]);
      }
    }
  }

  selectSuggestion(selectedWord: string): void {
    this.inputText = selectedWord;
    this.marathiSuggestions = [];
    this.selectedIndex = -1;
  }

  cancelEdit() {
    this.editMode = false;
    this.previousFileUrl = null;
    this.circularForm.reset();
  }


  filterCirculars() {
    const search = this.searchText.toLowerCase().trim();

    if (!search) {
      this.filteredCirculars = this.circulars;
    } else {
      this.filteredCirculars = this.circulars.filter(c =>
        c.subject.toLowerCase().includes(search) ||
        c.date.toString().toLowerCase().includes(search)
      );
    }

    this.currentPage = 1;
    this.updatePagination();
  }

  updatePagination() {
    this.totalPages = Math.ceil(this.filteredCirculars.length / this.itemsPerPage);

    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = this.currentPage * this.itemsPerPage;

    this.paginatedCirculars = this.filteredCirculars.slice(startIndex, endIndex);
    this.updateVisiblePages();
  }

  updateVisiblePages() {
    const pages: number[] = [];
    const start = Math.max(1, this.currentPage - 2);
    const end = Math.min(this.totalPages, this.currentPage + 2);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    this.visiblePages = pages;
  }

  changePage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.updatePagination();
  }

  onItemsPerPageChange() {
    this.currentPage = 1;
    this.updatePagination();
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

  
onMarathiInputChange(): void {
  const inputText = this.circularForm.get('marathiInput')?.value?.trim();
  if (inputText) {
    this.marathiService.getMarathiSuggestion(inputText).subscribe({
      next: (response) => {
        if (response && response[0] === 'SUCCESS' && response[1]?.[0]?.[1]) {
          this.marathiSuggestions = response[1][0][1];
          this.selectedIndex = -1;
        } else {
          this.marathiSuggestions = [];
        }
      },
      error: (err) => {
        console.error('Error fetching Marathi suggestions:', err);
        this.marathiSuggestions = [];
      }
    });
  } else {
    this.marathiSuggestions = [];
  }
}

onMarathiKeyDown(event: KeyboardEvent): void {
  if (this.marathiSuggestions.length === 0) return;

  if (event.key === 'ArrowDown') {
    event.preventDefault();
    this.selectedIndex = (this.selectedIndex + 1) % this.marathiSuggestions.length;
  } else if (event.key === 'ArrowUp') {
    event.preventDefault();
    this.selectedIndex =
      this.selectedIndex <= 0 ? this.marathiSuggestions.length - 1 : this.selectedIndex - 1;
  } else if (event.key === 'Enter') {
    event.preventDefault();
    if (this.selectedIndex >= 0 && this.selectedIndex < this.marathiSuggestions.length) {
      this.selectMarathiSuggestion(this.marathiSuggestions[this.selectedIndex]);
    }
  }
}

selectMarathiSuggestion(selectedWord: string): void {
  this.circularForm.get('marathiInput')?.setValue(selectedWord);
  this.marathiSuggestions = [];
  this.selectedIndex = -1;
}
}
