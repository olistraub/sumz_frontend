export interface RemoteConfig {
    scenarioConfig: Map<number, ScenarioConfig>;
}

export interface ScenarioConfig {
    showResult: {
        cvd: boolean,
        apv: boolean,
        fcf: boolean,
        fte: boolean
    }
}
