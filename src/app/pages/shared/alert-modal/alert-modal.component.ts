import { Component, EventEmitter, Output, HostListener } from '@angular/core';

@Component({
  selector: 'app-alert-modal',
  templateUrl: './alert-modal.component.html',
  styleUrls: ['./alert-modal.component.css']
})
export class AlertModalComponent {
  @Output() close = new EventEmitter<void>();

  message: string = '';
  type: 'success' | 'error' = 'success';
  isVisible: boolean = false;

  private onConfirmCallback?: () => void;

  // Dynamically control z-index
  modalZIndex: number = 20000;

  openModal(message: string, type: 'success' | 'error' = 'success', onConfirmCallback?: () => void): void {
    this.message = message;
    this.type = type;
    this.onConfirmCallback = onConfirmCallback;
    this.isVisible = true;

    // Dynamically adjust the z-index when modal is shown
    this.modalZIndex = 20000; // Set to a higher number if needed (or based on the last opened modal)
  }

  closeModal(): void {
    this.isVisible = false;

    if (this.onConfirmCallback) {
      this.onConfirmCallback();
      this.onConfirmCallback = undefined;
    }

    this.close.emit();
  }

  getHeaderClass(): string {
    return this.type === 'success' ? 'modal-header-success' : 'modal-header-error';
  }

  // Listen globally for key events (Enter)
  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent): void {
    if (!this.isVisible) return;

    if (event.key === 'Enter') {
      event.preventDefault();
      this.closeModal();
    }
  }
}
