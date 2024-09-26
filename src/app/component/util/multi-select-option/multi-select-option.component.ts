import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-multi-select-option',
  templateUrl: './multi-select-option.component.html',
  styleUrl: './multi-select-option.component.css'
})
export class MultiSelectOptionComponent {
  @Input() items: { id: number, name: string }[] = [];
  @Output() selectionChange = new EventEmitter<{ id: number, name: string }[]>();

  @Input() placeholder: string = 'Select District'; 

  selectedItems: any[] = [];
  dropdownOpen = false;

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  onMouseLeave(event: MouseEvent): void {
    this.dropdownOpen=false;
  }

  onCheckboxChange(event: Event, item: { id: number, name: string }) {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement.checked) {
      this.selectedItems.push(item);
    } else {
      this.selectedItems = this.selectedItems.filter(selectedItem => selectedItem.id !== item.id);
    }
    this.selectionChange.emit(this.selectedItems);
  }
  
  

  isSelected(item: any): boolean {
    return this.selectedItems.some(selectedItem => selectedItem.id === item.id);
  }

  getSelectedText() {
    // Remove selected items that are no longer available in the items list
    this.selectedItems = this.selectedItems.filter(selectedItem =>
      this.items.some(item => item.id === selectedItem.id)
    );

    if (this.selectedItems.length === 0) {
      return this.placeholder;
    }
    return this.selectedItems.map(item => item.name).join(', ');
  }

  selectAll() {
    this.selectedItems = [...this.items];
    this.selectionChange.emit(this.selectedItems);
  }

  deselectAll() {
    this.selectedItems = [];
    this.selectionChange.emit(this.selectedItems);
  }

  isAllSelected(): boolean {
    return this.items.length === this.selectedItems.length;
  }
}
