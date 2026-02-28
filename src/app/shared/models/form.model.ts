import { ValidatorFn, AsyncValidatorFn, FormGroup } from '@angular/forms';
import { Type } from '@angular/core';
import { TextFieldComponent } from '../components/dynamic-form/fields/text-field.component';
import { DropdownFieldComponent } from '../components/dynamic-form/fields/dropdown-field.component';
import { TextareaFieldComponent } from '../components/dynamic-form/fields/textarea-field.component';
import { DateFieldComponent } from '../components/dynamic-form/fields/date-field.component';
import { UploadFieldComponent } from '../components/dynamic-form/fields/upload-field.component';
import { CheckboxFieldComponent } from '../components/dynamic-form/fields/checkbox-field.component';

export enum FileState {
    Attached = 0,
    Added = 1,
    Modified = 2,
    Deleted = 3
}

export interface FilePayload {
    id?: any;
    filename: string;
    base64?: string;
    url?: string;
    state: FileState;
}

export interface GridSection {
    key: string;
    label?: string;
    colSpan: number; // 1-12
    order: number;
}

/**
 * Base abstract model for any form field
 */
export abstract class BaseFormField<T> {
    abstract component: Type<any>; // Each field model knows which component renders it

    value: T | undefined;
    key: string;
    label: string;
    required: boolean;
    order: number;
    validators: ValidatorFn[];
    asyncValidators: AsyncValidatorFn[];
    placeholder: string;
    colSpan: number;
    gridKey?: string;
    readonly: boolean;

    constructor(options: {
        value?: T;
        key?: string;
        label?: string;
        required?: boolean;
        order?: number;
        validators?: ValidatorFn[];
        asyncValidators?: AsyncValidatorFn[];
        placeholder?: string;
        colSpan?: number;
        gridKey?: string;
        readonly?: boolean;
    } = {}) {
        this.value = options.value;
        this.key = options.key || '';
        this.label = options.label || '';
        this.required = !!options.required;
        this.order = options.order === undefined ? 1 : options.order;
        this.validators = options.validators || [];
        this.asyncValidators = options.asyncValidators || [];
        this.placeholder = options.placeholder || '';
        this.colSpan = options.colSpan || 12;
        this.gridKey = options.gridKey;
        this.readonly = !!options.readonly;
    }
}

/**
 * Intermediate class for all Text-based fields
 */
export abstract class TextBoxField extends BaseFormField<string> {
    type: string; // text, password, email, number

    constructor(options: any = {}) {
        super(options);
        this.type = options.type || 'text';
    }
}

/**
 * Specific implementation for a standard Text Input
 */
export class TextField extends TextBoxField {
    component = TextFieldComponent;
    constructor(options: any = {}) {
        super(options);
        this.type = 'text';
    }
}

export class PasswordField extends TextBoxField {
    component = TextFieldComponent;
    constructor(options: any = {}) {
        super(options);
        this.type = 'password';
    }
}

export class DropdownField extends BaseFormField<string> {
    component = DropdownFieldComponent;
    options: { key: string, value: string }[] = [];

    constructor(options: any = {}) {
        super(options);
        this.options = options.options || [];
    }
}

export class TextareaField extends BaseFormField<string> {
    component = TextareaFieldComponent;
    rows: number;

    constructor(options: any = {}) {
        super(options);
        this.rows = options.rows || 3;
    }
}

export class DateField extends BaseFormField<string> {
    component = DateFieldComponent;
}

export class UploadField extends BaseFormField<FilePayload | FilePayload[]> {
    component = UploadFieldComponent;
    multiple: boolean;

    constructor(options: any = {}) {
        super(options);
        this.multiple = !!options.multiple;
    }
}

export class CheckboxField extends BaseFormField<boolean> {
    component = CheckboxFieldComponent;

    constructor(options: any = {}) {
        super(options);
        this.value = !!options.value;
    }
}
