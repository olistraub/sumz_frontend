export class Scenario {
    id: number;
    scenarioName: string;
    scenarioDescription: string;
    periods: number;
    scenarioColor: string;

    equityInterestRate: number;
    interestOnLiabilitiesRate: number;
    businessTaxRate: number;
    corporateTaxRate: number;
    solidaryTaxRate: number;
    stochastic: Boolean;

    additionalIncome: AccountingFigure;
    additionalCosts: AccountingFigure;
    investments: AccountingFigure;
    divestments: AccountingFigure;
    depreciation: AccountingFigure;
    revenue: AccountingFigure;
    costOfMaterial: AccountingFigure;
    costOfStaff: AccountingFigure;
    liabilities: AccountingFigure;
    freeCashflows: AccountingFigure;

    companyValueDistribution: DistributedCompanyValue;
    fteValuationResult: { companyValue: number; };
    fcfValuationResult: FcfValuationResult;
    apvValuationResult: ApvValuationResult;
}

export class AccountingFigure {
    isHistoric: boolean;
    timeSeries: DataPoint[];
    order: number[];
    seasonalOrder: number[];
}

export class DataPoint {
    date: TimePoint;
    amount: number;
}

interface TimePoint {
    year: number;
    quarter: number;
  }

export class DistributedCompanyValue {
    xValues: number[];
    yValues: number[];
}

export class FcfValuationResult {
    companyValue: number;
    marketValueTotalAssets: number;
    totalLiabilities: number;
}

export class ApvValuationResult extends FcfValuationResult {
    taxShield: number;
    presentValueOfCashflows: number;
}
