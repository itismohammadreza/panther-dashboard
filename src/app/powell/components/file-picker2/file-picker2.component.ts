import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  forwardRef,
  Injector,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import {
  AbstractControl,
  ControlContainer,
  ControlValueAccessor,
  FormControlName,
  FormGroup,
  FormGroupDirective,
  NG_VALUE_ACCESSOR,
  NgControl
} from '@angular/forms';
import {Subject, takeUntil} from "rxjs";
import {NgColor, NgFileResultType, NgFixLabelPosition, NgValidation} from '@powell/models';
import {UtilsService} from "@powell/api";

@Component({
  selector: 'ng-file-picker2',
  templateUrl: './file-picker2.component.html',
  styleUrls: ['./file-picker2.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FilePicker2Component),
      multi: true
    }
  ]
})
export class FilePicker2Component implements OnInit, OnChanges, ControlValueAccessor, OnDestroy {
  @Input() value: any = [];
  @Input() label: string;
  @Input() labelWidth: number;
  @Input() hint: string;
  @Input() rtl: boolean;
  @Input() showRequiredStar: boolean;
  @Input() labelPos: NgFixLabelPosition;
  @Input() validation: NgValidation;
  @Input() disableConfigChangeEffect: boolean;
  @Input() disabled: boolean;
  @Input() readonly: boolean;
  @Input() multiple: boolean = true;
  @Input() isUnknownImageUrl: boolean = false;
  @Input() accept: string;
  @Input() color: NgColor = 'primary';
  @Input() fileLimit: number = 20000;
  @Input() resultType: NgFileResultType = 'base64';
  @Input() chooseLabel: string = 'انتخاب';
  @Output() onSelect = new EventEmitter();
  @Output() onRemove = new EventEmitter();

  inputId: string;
  ngControl: NgControl;
  destroy$ = new Subject();
  filesToShow: { display: string, name: string }[] = [];
  filesToEmit: (string | ArrayBuffer | File)[] = [];
  _chooseLabel: string;
  onModelChange: any = (_: any) => {
  };
  onModelTouched: any = () => {
  };

  constructor(
    private cd: ChangeDetectorRef,
    private injector: Injector,
    private utilsService: UtilsService
  ) {
  }

  ngOnInit() {
    //store user defined label for single selection mode
    this._chooseLabel = this.chooseLabel;
    this.inputId = this.getId();
    let parentForm: FormGroup;
    let rootForm: FormGroupDirective;
    let currentControl: AbstractControl;
    const controlContainer = this.injector.get(
      ControlContainer,
      null,
      {optional: true, host: true, skipSelf: true}
    ) as FormGroupDirective;
    this.ngControl = this.injector.get(NgControl, null);
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
      currentControl = this.ngControl.control;
      if (controlContainer) {
        parentForm = controlContainer.control;
        rootForm = controlContainer.formDirective as FormGroupDirective;
        if (this.ngControl instanceof FormControlName) {
          currentControl = parentForm.get(this.ngControl.name.toString());
        }
        rootForm.ngSubmit.pipe(takeUntil(this.destroy$)).subscribe(() => {
          if (!this.disabled) {
            currentControl.markAsTouched();
          }
        });
      }
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.value) {
      this.init(this.value);
    }
  }

  _onSelect(event: any) {
    if (this.multiple) {
      this.onMultipleSelect(event)
    } else if (!this.multiple) {
      this.onSingleSelect(event)
    }
  }

  async onSingleSelect(event: any) {
    const file: File = event.target.files[0];
    this.filesToShow = [];
    this.filesToEmit = [];
    await this.handleFile(file);
    this.onSelect.emit(this.filesToEmit[0]);
    this.onModelChange(this.filesToEmit[0]);
  }

  onSingleDelete() {
    this.filesToEmit = [];
    this.filesToShow = [];
    this.chooseLabel = this._chooseLabel;
    this.onRemove.emit();
    this.onModelChange(null);
  }

  async onMultipleSelect(event: any) {
    const file: File = event.target.files[0];
    if (this.filesToShow.findIndex(f => f.name == file.name) > -1) {
      return
    }
    await this.handleFile(file);
    this.onSelect.emit(this.filesToEmit);
    this.onModelChange(this.filesToEmit);
  }

  onMultipleDelete(event: any, index: number) {
    event.stopPropagation();
    this.onRemove.emit(this.filesToEmit[index]);
    this.filesToShow.splice(index, 1);
    this.filesToEmit.splice(index, 1);
    this.onModelChange(this.filesToEmit);
  }

  async handleFile(item: File) {
    if (this.utilsService.isImage(item)) {
      const blobUrl = window.URL.createObjectURL(new Blob([item], {type: item.type}));
      this.filesToShow.push({display: blobUrl, name: item.name});
    } else {
      this.filesToShow.push({display: null, name: item.name});
    }
    this.chooseLabel = item.name;
    if (this.resultType == 'base64') {
      const base64 = await this.utilsService.fileToBase64(item);
      this.filesToEmit.push(base64);
    } else if (this.resultType == 'file') {
      this.filesToEmit.push(item);
    }
  }

  async b(item) {
    let a: string | ArrayBuffer | File = item;
    if(this.utilsService.isValidURL(item)){
      a = await this.utilsService.urlToBase64(item);
    }
    if (item.indexOf('base64') == -1) {
    }
    const file = this.utilsService.base64toFile(a, item.split('/').pop());
    let blobUrl = null;
    if (this.utilsService.isImage(item)) {
      blobUrl = window.URL.createObjectURL(new Blob([file], {type: file.type}));
    }
    this.filesToShow.push({display: blobUrl, name: file.name});

    this.chooseLabel = file.name;

    if (this.resultType == 'base64') {
      this.filesToEmit.push(a);
    } else if (this.resultType == 'file') {
      this.filesToEmit.push(file);
    }
  }

  async handleStringValue(item: string) {
    let a: string | ArrayBuffer = item;
    if (item.indexOf('base64') == -1) {
      a = await this.utilsService.urlToBase64(item)
    }
    const file = this.utilsService.base64toFile(a, item.split('/').pop());
    const blobUrl = window.URL.createObjectURL(new Blob([file], {type: file.type}));
    this.filesToShow.push({display: blobUrl, name: file.name});

    if (this.resultType == 'base64') {
      this.filesToEmit.push(a);
    } else if (this.resultType == 'file') {
      this.filesToEmit.push(file);
    }
  }

  getFileType(file: any) {
    const isImage = !!file && ((typeof file == 'string' && file.includes('blob')) || this.isUnknownImageUrl);
    if (isImage) {
      return 'image';
    } else {
      return 'file';
    }


    // if (item.indexOf('base64') != -1) {
    //   const file = this.utilsService.base64toFile(item, item.split('/').pop());
    //   const blobUrl = window.URL.createObjectURL(new Blob([file], {type: file.type}));
    //   this.filesToShow.push({display: blobUrl, name: file.name});
    //
    //   if (this.resultType == 'base64') {
    //     this.filesToEmit.push(item);
    //   } else if (this.resultType == 'file') {
    //     this.filesToEmit.push(file);
    //   }
    // } else {
    //   const base64 = await this.utilsService.urlToBase64(item);
    //   const file = this.utilsService.base64toFile(base64, item.split('/').pop());
    //   const blobUrl = window.URL.createObjectURL(new Blob([file], {type: file.type}));
    //   this.filesToShow.push({display: blobUrl, name: file.name});
    //
    //   if (this.resultType == 'base64') {
    //     this.filesToEmit.push(base64);
    //   } else if (this.resultType == 'file') {
    //     const file = this.utilsService.base64toFile(base64, item.split('/').pop())
    //     this.filesToEmit.push(file);
    //   }
    // }
  }

  async init(value: any) {
    if (!value) {
      return
    }
    this.filesToShow = [];
    this.filesToEmit = [];
    if (Array.isArray(value) && this.multiple) {
      for (const item of value) {
        if (item instanceof File) {
          await this.handleFile(item);
        }
        if (typeof item == 'string') {
          await this.handleStringValue(item);
        }
      }
      this.onModelChange(this.filesToEmit);
    } else if (value instanceof File) {
      await this.handleFile(value)
      this.onModelChange(this.filesToEmit[0]);
    } else if (typeof value == 'string') {
      await this.handleStringValue(value)
      this.onModelChange(this.filesToEmit[0]);
    }
    this.cd.markForCheck();
  }

  getId() {
    return "id" + Math.random().toString(16).slice(2)
  }

  isInvalid() {
    if (this.ngControl) {
      const control = this.ngControl.control;
      return (!this.disabled && (control.touched || control.dirty) && control.invalid);
    }
    return false
  }

  hasError(type: string): boolean {
    return this.isInvalid() && this.ngControl.control.hasError(type);
  }

  showHint() {
    let hasError = false;
    for (const errorKey in this.validation) {
      if (this.hasError(errorKey)) {
        hasError = true;
      }
    }
    return !hasError;
  }

  writeValue(value: any) {
    this.init(value);
  }

  registerOnChange(fn) {
    this.onModelChange = fn;
  }

  registerOnTouched(fn) {
    this.onModelTouched = fn;
  }

  setDisabledState(val: boolean) {
    this.disabled = val;
    this.cd.markForCheck();
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
