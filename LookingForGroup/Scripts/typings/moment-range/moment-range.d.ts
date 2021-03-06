// Type definitions for Moment.js 2.0.3
// Project: https://github.com/gf3/moment-range
// Definitions by: Bart van den Burg <https://github.com/Burgov>, Wilgert Velinga <https://github.com/wilgert>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

/// <reference path="../moment/moment.d.ts" />

declare namespace moment {

    interface Moment {

        within(x: Range): boolean;

    }

    interface MomentStatic {

        range(range: string): Range;
        range(range: Date[]): Range;
        range(range: Moment[]): Range;
        range(start: Date | number | string | moment.Moment, end: Date | number | string | moment.Moment): Range;
    }

    interface Range {
        start: Moment;
        end: Moment;

        contains(other: Date, exclusive?: boolean): boolean;
        contains(other: Moment, exclusive?: boolean): boolean;

        overlaps(range: Range, options?: { adjacent: boolean }): boolean;

        adjacent(range: Range): boolean;

        intersect(other: Range): Range;

        add(other: Range, options?: { adjacent: boolean }): Range;

        subtract(other: Range): Range[];

        by(range: string, hollaback: (current: Moment) => void, exclusive?: boolean): void;
        by(range: Range, hollaback: (current: Moment) => void, exclusive?: boolean): void;

        isSame(other: Range): boolean;

        diff(unit?: string): number;

        toDate(): Date;

        toString(): string;

        valueOf(): number;

        center(): number;

        clone(): Range;
    }

}
