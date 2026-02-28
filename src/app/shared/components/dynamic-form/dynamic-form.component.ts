import { Component, OnInit, Output, EventEmitter, inject, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { BaseFormField, GridSection, DropdownField } from '../../models/form.model';
import { FormHelperService } from '../../services/form-helper.service';

@Component({
    selector: 'app-dynamic-form',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './dynamic-form.component.html',
    styleUrl: './dynamic-form.component.css'
})
export class DynamicFormComponent implements OnInit {
    fields = input<BaseFormField<any>[]>([]);
    gridSections = input<GridSection[]>([]);
    submitLabel = input<string>('Submit');
    showSubmitButton = input<boolean>(true);
    showValidation = input<boolean>(true);
    isSubmitting = input<boolean>(false);

    formSubmit = output<any>();
    valueChanges = output<any>();

    form!: FormGroup;
    private formHelper = inject(FormHelperService);

    groupedSections: { section: GridSection | null, fields: BaseFormField<any>[] }[] = [];

    ngOnInit() {
        this.form = this.formHelper.toFormGroup(this.fields());
        this.organizeForm();

        this.form.valueChanges.subscribe(val => {
            this.valueChanges.emit(val);
        });
    }

    private organizeForm() {
        const fieldGroups = new Map<string | undefined, BaseFormField<any>[]>();
        this.fields().forEach(f => {
            const group = fieldGroups.get(f.gridKey) || [];
            group.push(f);
            fieldGroups.set(f.gridKey, group);
        });

        fieldGroups.forEach(group => group.sort((a, b) => a.order - b.order));

        const sections: { section: GridSection | null, fields: BaseFormField<any>[] }[] =
            [...this.gridSections()].sort((a, b) => a.order - b.order).map(s => ({
                section: s,
                fields: fieldGroups.get(s.key) || []
            }));

        const orphanFields = fieldGroups.get(undefined) || [];
        if (orphanFields.length > 0) {
            sections.push({ section: null, fields: orphanFields });
        }

        this.groupedSections = sections;
    }

    onSubmit() {
        if (this.form.valid) {
            this.formSubmit.emit(this.form.getRawValue());
        } else {
            this.form.markAllAsTouched();
        }
    }

    resetForm() {
        const resetValues: any = {};
        this.fields().forEach(field => {
            resetValues[field.key] = field.value || (field instanceof DropdownField ? '' : '');
        });
        this.form.reset(resetValues);
    }

    getComponentInputs(field: BaseFormField<any>) {
        return {
            field: field,
            form: this.form,
            showValidation: this.showValidation()
        };
    }

    getFormValue() {
        return this.form?.getRawValue();
    }
}
