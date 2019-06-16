import { AccountingFigure, Scenario } from '../api/scenario';
import { Gaussian } from 'ts-gaussian';

export interface AccountingFigures {
    revenue: AccountingFigure;
    additionalIncome: AccountingFigure;
    costOfMaterial: AccountingFigure;
    costOfStaff: AccountingFigure;
    additionalCosts: AccountingFigure;
    divestments: AccountingFigure;
    investments: AccountingFigure;
    liabilities: AccountingFigure;
    depreciation: AccountingFigure;
}

const rawAccountingFigures = {
    revenue: [13634, 12578, 10865, 8967],
    additionalIncome: [1074, 1218, 1719, 722],
    costOfMaterial: [8079, 7337, 4031, 3099],
    costOfStaff: [2035, 1838, 1764, 1476],
    additionalCosts: [2053, 2143, 3955, 2697],
    divestments: [295, 456, 45, 231],
    investments: [347, 21, 454, 655],
    liabilities: [16917, 16069, 15679, 16605],
    depreciation: [1000, 900, 800, 700],
};
const accountingFigures = Object.entries(rawAccountingFigures).reduce(
    (allFigures, [key, figureSeries]) => {
        allFigures[key] = figureSeries.reduce(
            (accumulated, figure, index) => {
                const forYear = new Date().getFullYear() - 4 + index;
                accumulated.timeSeries.push(...[1, 2, 3, 4].map(quarter => ({
                    date: {
                        year: forYear,
                        quarter: quarter,
                    },
                    amount: figure / 4,
                })));
                return accumulated;
            }, {
                isHistoric: true, timeSeries: [],
            });
        return allFigures;
    }, {} as AccountingFigures);

const companyValue = 122000;
const distribution = new Gaussian(companyValue, 500000000);

export const DEFAULT_MOCK_DATA: Scenario[] = [{
    ...{
        id: 69190,
        scenarioName: 'Testszenario',
        scenarioDescription: 'KPMG-geprüfte, garantiert fehlerfreie Unternehmensbewertung',
        scenarioColor: 'red',
        businessTaxRate: .25,
        corporateTaxRate: .2,
        solidaryTaxRate: .055,
        equityInterestRate: .4,
        interestOnLiabilitiesRate: .1,
        periods: 4,
        stochastic: true,
        fcfValuationResult: {
            companyValue: companyValue,
            marketValueTotalAssets: 55000,
            totalLiabilities: 20000,
        },
        fteValuationResult: { companyValue: companyValue },
        apvValuationResult: {
            companyValue: companyValue,
            marketValueTotalAssets: 50000,
            taxShield: 5000,
            totalLiabilities: 20000,
            presentValueOfCashflows: 10000,
        },
        companyValueDistribution: {
            xValues: [...Array(31).keys()].map(i => i * companyValue / 15).map(Math.round),
            yValues: [...Array(31).keys()].map(i => i * companyValue / 15).map(i => distribution.cdf(i + 1) - distribution.cdf(i)),
        },
        freeCashflows: {} as AccountingFigure,
    },
    ...accountingFigures,
}];
