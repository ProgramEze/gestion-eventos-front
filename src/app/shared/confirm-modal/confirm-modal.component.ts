import {
	Component,
	EventEmitter,
	Input,
	Output,
	Renderer2,
	ElementRef,
	OnInit,
	OnDestroy,
  } from '@angular/core';
  
  @Component({
	selector: 'app-confirm-modal',
	standalone: true,
	templateUrl: './confirm-modal.component.html',
	styleUrls: ['./confirm-modal.component.css'],
  })
  export class ConfirmModalComponent implements OnInit, OnDestroy {
	@Input() message: string = '';
	@Output() confirmAction = new EventEmitter<boolean>();
	@Input() showModal: boolean = false;
  
	constructor(private renderer: Renderer2, private el: ElementRef) {}
  
	ngOnInit(): void {
	  if (this.showModal) {
		this.renderer.addClass(document.body, 'modal-open');
		this.focusModal();
	  }
	}
  
	ngOnDestroy(): void {
	  this.renderer.removeClass(document.body, 'modal-open');
	}
  
	confirm(): void {
	  this.confirmAction.emit(true); // Emitimos true si confirma
	  this.closeModal(false); // Cerramos el modal
	}
  
	closeModal(manual: boolean): void {
	  this.confirmAction.emit(false); // Emitimos false al cerrar sin confirmar
	  this.renderer.removeClass(document.body, 'modal-open');
	  this.showModal = false;
	}
  
	onBackdropClick(event: MouseEvent): void {
	  if ((event.target as HTMLElement).classList.contains('modal')) {
		this.closeModal(false);
	  }
	}
  
	private focusModal(): void {
	  this.el.nativeElement.querySelector('.modal-dialog')?.focus();
	}
  }
  