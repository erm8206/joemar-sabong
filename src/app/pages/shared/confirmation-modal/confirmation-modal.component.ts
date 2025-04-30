import { Component, EventEmitter, Output, HostListener } from '@angular/core';

@Component({
  selector: 'app-confirmation-modal',
  templateUrl: './confirmation-modal.component.html',
  styleUrls: ['./confirmation-modal.component.css']
})
export class ConfirmationModalComponent {
  @Output() result = new EventEmitter<boolean>();

  title: string = '';
  message: string = '';
  isVisible: boolean = false;
  modalZIndex: number = 20000;

  openModal(title: string, message: string): void {
    this.title = title;
    this.message = message;
    this.isVisible = true;
    // Dynamically adjust the z-index when modal is shown
    this.modalZIndex = 20000; // Set to a higher number if needed (or based on the last opened modal)
  }

  onConfirm(): void {
    this.result.emit(true);
    this.isVisible = false;
  }

  onClose(value: boolean): void {
    this.result.emit(value);
    this.isVisible = false;
  }

  // 🔑 Handle Enter and Escape keys globally when modal is visible
  @HostListener('window:keydown', ['$event'])
  handleKeydown(event: KeyboardEvent): void {
    if (!this.isVisible) return;

    if (event.key === 'Enter') {
      event.preventDefault();
      this.onConfirm();
    } else if (event.key === 'Escape') {
      event.preventDefault();
      this.onClose(false);
    }
  }
}
