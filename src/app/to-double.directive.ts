import { Directive, Renderer2, ElementRef, Input, HostListener, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Directive({
  selector: '[appToDouble]',
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => ToDoubleDirective),
    multi: true,
  }],
})
export class ToDoubleDirective implements ControlValueAccessor {
  onChangeCallback = (_: any) => { };
  onTouchedCallback = () => { };

  @HostListener('input', ['$event.target.value']) input(value: any) {
    const caretPosition = this.getCaretPosition(this._elementRef.nativeElement);
    const currentNumChars = this.countNumericChars(value.substr(0, caretPosition));
    const decimalNumberRegEx = value.match(/([0-9.]*)(,0*)$/);
    const keepEnd = decimalNumberRegEx && caretPosition > decimalNumberRegEx[1].length;
    value = parseFloat(value.replace(/\./g, '').replace(/,/g, '.'));
    if (isNaN(value)) {
      this.onChangeCallback(value);
    } else {
      this.onChangeCallback(value);
      value = value.toLocaleString('de-de') + (keepEnd ? decimalNumberRegEx[2] : '');
      this.writeValue(value, true);
      if (!keepEnd) {
        this.setCaretPosition(this._elementRef.nativeElement, this.retrieveNewPosition(value, currentNumChars));
      }
    }
  }

  @HostListener('blur', []) touched() {
    this.onTouchedCallback();
  }

  constructor(private _renderer: Renderer2, private _elementRef: ElementRef) { }

  writeValue(value: any, skipLocale?: Boolean): void {
    this._renderer.setProperty(this._elementRef.nativeElement, 'value', skipLocale ? value : value.toLocaleString('de-de'));
  }

  registerOnChange(fn: any) {
    this.onChangeCallback = fn;
  }

  registerOnTouched(fn: any) {
    this.onTouchedCallback = fn;
  }

  private getCaretPosition(inputField) {
    return inputField.selectionStart || 0;
  }

  private setCaretPosition(inputElement, position: number) {
    if (inputElement.createTextRange) {
      const range = inputElement.createTextRange();
      range.move('character', position);
      range.select();
    } else {
      if (inputElement.selectionStart) {
        inputElement.focus();
        inputElement.setSelectionRange(position, position);
      } else {
        inputElement.focus();
      }
    }
  }

  private countNumericChars(value: String) {
    return (value.match(/[0-9]/gi) || []).length;
  }

  private retrieveNewPosition(value: String, nums: Number) {
    let count = 0;
    for (let i = 0; i < value.length; i++) {
      if (value[i].match(/[0-9]/)) {
        count++;
      }
      if (count >= nums) {
        return i + 1;
      }
    }
    return value.length;
  }

}
