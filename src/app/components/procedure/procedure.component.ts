import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ScheduleFormComponent } from 'src/app/pages/schedule/schedule-form/schedule-form.component';
import { ScheduleService } from 'src/app/service/schedule.service';

@Component({
  selector: 'app-procedure',
  templateUrl: './procedure.component.html',
  styleUrls: ['./procedure.component.scss'],
})
export class ProcedureComponent implements OnInit {
  formValue: FormGroup;
  loading = false;

  constructor(
    public dialogRef: MatDialogRef<ScheduleFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public fb: FormBuilder,
    private scheduleService: ScheduleService
  ) {
    this.formValue = this.fb.group({
      procedures: this.fb.array([]),
    });
  }

  ngOnInit(): void {
    if (this.data && this.data.procedures) {
      this.data.procedures.forEach((procedure: any) =>
        this.addProcedure(
          procedure.id,
          procedure.name,
          procedure.done,
          procedure.procedureDate
        )
      );
    }
  }

  get procedures(): FormArray {
    return this.formValue.get('procedures') as FormArray;
  }

  addProcedure(
    id: string = null,
    name: string = '',
    done: boolean = false,
    procDate: string = null
  ) {
    const procedureGroup = this.fb.group({
      id: [id, null],
      name: [name, Validators.required],
      done: [done, null],
      procedureDate: [procDate ? procDate.split('T')[0] : null],
    });
    this.procedures.push(procedureGroup);
  }

  removeProcedure(index: number) {
    this.procedures.removeAt(index);
  }

  onChangeCheck(index: number, checked: boolean): void {
    const procedure = this.procedures.at(index);
    procedure.patchValue({ done: checked });
  }

  onSave() {
    if (this.formValue.valid) {
      this.loading = true;
      this.scheduleService
        .updateProcedures(this.data.scheduleId, this.procedures.value)
        .subscribe(
          () => {
            this.dialogRef.close(true);
            this.loading = false;
          },
          () => {
            this.loading = false;
          }
        );
    }
  }

  onClose(): void {
    this.dialogRef.close(false);
  }
}
