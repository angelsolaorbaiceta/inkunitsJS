export default function (amount: number): {
    from: (srcUnits: string) => {
        to: (tgtUnits: string) => number;
    };
};
