import { Component, OnInit, Inject, AfterViewInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { VisleanElement } from 'src/app/models/data.model';
import { FormBuilder, NgForm, Validators, FormGroup } from '@angular/forms';

@Component( {
  selector: 'app-dialog-form',
  templateUrl: './dialog-form.component.html',
  styleUrls: ['./dialog-form.component.sass']
} )
export class DialogFormComponent implements OnInit, AfterViewInit {

  public visLeanForm: FormGroup;
  constructor ( @Inject( MAT_DIALOG_DATA ) public inputData: { element: VisleanElement, isNewForm: boolean }, private fb: FormBuilder ) { }
  public data: VisleanElement;
  public isNewForm: boolean;
  ngOnInit (): void {
    this.data = this.inputData.element;
    this.isNewForm = this.inputData.isNewForm;
    this.visLeanForm = this.fb.group( {
      actId: [this.data.actId, Validators.required],
      orgName: [this.data.orgName, Validators.required],
      owner: [this.data.owner, Validators.required],
      taskName: [this.data.taskName, Validators.required],
      status: [this.data.status, [Validators.required, Validators.min( 1 ), Validators.max( 10 )]],
      taskType: [this.data.taskType, Validators.required]
    } );
  }
  ngAfterViewInit (): void {
    console.log( this.data );

  }
  onSubmit (): void {
    console.log( this.visLeanForm );
  }

}
