import { AbstractControl, ValidationErrors, Validators } from '@angular/forms';

export type AccountingDataParams = ReadonlyMap<string, AccountingDataParam>;

export const accountingDataParams: AccountingDataParams =
    new Map([
        ['revenue', { displayName: 'Umsatzerlöse', showOnCalculation: true }],
        ['additionalIncome', { displayName: 'Sonstige Erlöse', showOnCalculation: true }],
        ['costOfMaterial', { displayName: 'Materialkosten', showOnCalculation: true }],
		['costOfStaff', { displayName: 'Personalkosten', showOnCalculation: true }],
		['depreciation', { displayName: 'Abschreibungen', showOnCalculation: true }],
        ['additionalCosts', { displayName: 'Sonstige Kosten', showOnCalculation: true }],
        ['investments', { displayName: 'Investitionen', showOnCalculation: true }],
        ['divestments', { displayName: 'Desinvestitionen', showOnCalculation: true }],
        ['freeCashFlows', { displayName: 'Free Cash Flow', showOnCalculation: false }],
        ['liabilities', { displayName: 'Fremdkapital', showOnCalculation: undefined, shiftDeterministic: true }],
    ]);

export interface AccountingDataParam { displayName: string; showOnCalculation?: boolean; shiftDeterministic?: boolean; }

const numberValidator = Validators.pattern('^[0-9]+(\.[0-9]+)?$');
const taxRateValidators =
    [numberValidator, Validators.min(0), Validators.max(100)];

export const environmentParams = {
    equityInterestRate: { displayName: 'Eigenkapitalzinsen', id: 'eigenkapitalzinsen', validators: [Validators.required, numberValidator] },
    interestOnLiabilitiesRate: { displayName: 'Zinssatz für Verbindlichkeiten', id: 'verbzinsen', validators: [Validators.required, numberValidator, ...taxRateValidators] },
    businessTaxRate: { displayName: 'Gewerbesteuersatz', id: 'gewerbesteuersatz', validators: [Validators.required, ...taxRateValidators] },
    corporateTaxRate: { displayName: 'Körperschaftssteuersatz', id: 'koerperschaftssteuersatz', validators: [Validators.required, ...taxRateValidators] },
    solidaryTaxRate: { displayName: 'Solidaritätszuschlag', id: 'soli', validators: [Validators.required, ...taxRateValidators] },
};

interface EnvironmentParam { validators: ((control: AbstractControl) => ValidationErrors)[]; }
