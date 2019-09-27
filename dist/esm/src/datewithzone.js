import dateutil from './dateutil';
import { DateTime, IANAZone } from 'luxon';
var DateWithZone = /** @class */ (function () {
    function DateWithZone(date, tzid) {
        this.date = date;
        this.tzid = tzid;
        if (typeof DateWithZone.ianaZones === 'undefined') {
            DateWithZone.ianaZones = {};
        }
    }
    Object.defineProperty(DateWithZone.prototype, "isUTC", {
        get: function () {
            return !this.tzid || this.tzid.toUpperCase() === 'UTC';
        },
        enumerable: true,
        configurable: true
    });
    DateWithZone.prototype.toString = function () {
        var datestr = dateutil.timeToUntilString(this.date.getTime(), this.isUTC);
        if (!this.isUTC) {
            return ";TZID=" + this.tzid + ":" + datestr;
        }
        return ":" + datestr;
    };
    DateWithZone.prototype.getTime = function () {
        return this.date.getTime();
    };
    DateWithZone.prototype.rezonedDate = function () {
        if (this.isUTC) {
            return this.date;
        }
        try {
            var datetime = DateTime
                .fromJSDate(this.date);
            // get the IANAZone for Luxon
            // this is pregenerated and stored in an object, because otherwise, Luxon has to recreate it each time,
            // which is a very time consuming process when calculating wide date ranges
            if (!(this.tzid.toLowerCase() in DateWithZone.ianaZones)) {
                DateWithZone.ianaZones[this.tzid.toLowerCase()] = new IANAZone(this.tzid.toLowerCase());
            }
            var ianaZone = DateWithZone.ianaZones[this.tzid.toLowerCase()];
            var rezoned = datetime.setZone(ianaZone, { keepLocalTime: true });
            return rezoned.toJSDate();
        }
        catch (e) {
            if (e instanceof TypeError) {
                console.error('Using TZID without Luxon available is unsupported. Returned times are in UTC, not the requested time zone');
            }
            return this.date;
        }
    };
    return DateWithZone;
}());
export { DateWithZone };
//# sourceMappingURL=datewithzone.js.map