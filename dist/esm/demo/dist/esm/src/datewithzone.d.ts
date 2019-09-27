import { IANAZone } from 'luxon';
export declare class DateWithZone {
    date: Date;
    tzid?: string | null;
    static ianaZones: {
        [index: string]: IANAZone;
    };
    constructor(date: Date, tzid?: string | null);
    private readonly isUTC;
    toString(): string;
    getTime(): number;
    rezonedDate(): Date;
}
//# sourceMappingURL=datewithzone.d.ts.map