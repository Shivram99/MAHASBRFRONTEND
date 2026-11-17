import { Component, DestroyRef, Inject, PLATFORM_ID } from '@angular/core';
import { Observable } from 'rxjs';
import { PaginatedResponse } from '../../interface/paginated-response';
import { MstRegistryDetailsPage } from '../../model/mst-registry-details-page';
import { FileUploadService } from '../../services/file-upload.service';
import { RegistryRecordsPageBase } from '../../shared/registry-records-page.base';

@Component({
  selector: 'app-duplicatedeatils',
  templateUrl: './duplicatedeatils.component.html',
  styleUrl: './duplicatedeatils.component.css',
  standalone: false
})
export class DuplicatedeatilsComponent extends RegistryRecordsPageBase {
  constructor(
    private readonly fileUploadService: FileUploadService,
    @Inject(PLATFORM_ID) platformId: object,
    destroyRef: DestroyRef
  ) {
    super(platformId, destroyRef);
  }

  get deuplicateDetails(): MstRegistryDetailsPage[] {
    return this.records;
  }

  loadDuplicateDetails(page: number, size: number, sortBy: string): void {
    this.loadRecords(page, size, sortBy);
  }

  protected fetchRecords(
    page: number,
    size: number,
    sortBy: string
  ): Observable<PaginatedResponse<MstRegistryDetailsPage>> {
    return this.fileUploadService.getDuplicateDetailsPage(page, size, sortBy);
  }
}
