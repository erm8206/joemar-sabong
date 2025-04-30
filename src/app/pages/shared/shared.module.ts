// shared/shared.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmationModalComponent } from './confirmation-modal/confirmation-modal.component';
import { AlertModalComponent } from './alert-modal/alert-modal.component';

@NgModule({
  declarations: [ConfirmationModalComponent, AlertModalComponent],
  imports: [CommonModule],
  exports: [ConfirmationModalComponent, AlertModalComponent]  // Export the modal component for use in other modules
})
export class SharedModule { }
