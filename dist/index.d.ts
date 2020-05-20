export declare function convert(amount: number): {
    from: (srcUnits: string) => {
        to: (tgtUnits: string) => number;
    };
};
