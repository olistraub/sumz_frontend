// Schlimme Sache.
// Wird ein Inputparameter direkt auf Scenario typsiert, kommt es (in einigen Komponenten) beim Compilieren zu einem Fehler, weil die
// Dependency nicht aufgelöst werden kann. Mit der Wrapper-Klasse gibt es das Problem nicht, dafür muss der Wert
// immer mit valueOf() adressiert werden, um nicht statische Typfehler zu bekommen.
// Zur Laufzeit hat scenario den Typ Scenario.
export class Wrapper<T> extends Object {
    valueOf(): T {
        return this.value;
    }

    constructor(private value: T) {
        super();
    }
}
