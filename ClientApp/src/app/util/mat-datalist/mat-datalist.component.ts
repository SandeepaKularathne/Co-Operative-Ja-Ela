import { Component, forwardRef, Input } from '@angular/core';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  NG_VALIDATORS,
  Validator,
  ValidationErrors,
  AbstractControl
} from '@angular/forms';

@Component({
  selector: 'mat-datalist',
  templateUrl: './mat-datalist.component.html',
  styleUrls: ['./mat-datalist.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MatDatalistComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => MatDatalistComponent),
      multi: true
    }
  ]
})
export class MatDatalistComponent implements ControlValueAccessor, Validator {
  @Input() options: any[] = [];
  @Input() valueProperty: string = 'value';
  @Input() displayValue: string = 'value';
  @Input() placeholder: string = 'value';

  value: string = '';
  displayProperty: string = '';

  private onChange = (value: string) => {
    this.options.forEach((op) => {this.displayValue=op})
  };
  private onTouched = () => {};

  writeValue(value: any): void {
    this.value = value;
    const selectedOption = this.options.find(option => option[this.valueProperty] === value[this.valueProperty]);
    if (selectedOption) {
      this.displayProperty = selectedOption[this.displayValue];
    }
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  onInput(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const selectedOption = this.options.find(option => option[this.displayValue] === inputElement.value);
    if (selectedOption) {
      this.value = selectedOption;
      this.displayProperty = selectedOption[this.displayValue];
      this.onChange(this.value);
    } else {
      this.displayProperty = inputElement.value;
      this.onChange('');
    }
    this.onTouched();
  }

  validate(control: AbstractControl): ValidationErrors | null {
    const isValid = this.options.some(option => option[this.valueProperty] === control.value);
    return isValid ? null : { invalidValue: true };
  }
}
