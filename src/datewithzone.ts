import dateutil from './dateutil'
import { DateTime, IANAZone } from 'luxon'

export class DateWithZone {
  public date: Date
  public tzid?: string | null
  public static ianaZones: {[index: string]: IANAZone}

  constructor (date: Date, tzid?: string | null) {
    this.date = date
    this.tzid = tzid
    if (typeof DateWithZone.ianaZones === 'undefined') {
      DateWithZone.ianaZones = {}
    }
  }

  private get isUTC () {
    return !this.tzid || this.tzid.toUpperCase() === 'UTC'
  }

  public toString () {
    const datestr = dateutil.timeToUntilString(this.date.getTime(), this.isUTC)
    if (!this.isUTC) {
      return `;TZID=${this.tzid}:${datestr}`
    }

    return `:${datestr}`
  }

  public getTime () {
    return this.date.getTime()
  }

  public rezonedDate () {
    if (this.isUTC) {
      return this.date
    }

    try {
      const datetime = DateTime
        .fromJSDate(this.date)

      // get the IANAZone for Luxon
      // this is pregenerated and stored in an object, because otherwise, Luxon has to recreate it each time,
      // which is a very time consuming process when calculating wide date ranges
      if (!(this.tzid!.toLowerCase() in DateWithZone.ianaZones)) {
        DateWithZone.ianaZones[this.tzid!.toLowerCase()] = new IANAZone(this.tzid!.toLowerCase())
      }
      let ianaZone = DateWithZone.ianaZones[this.tzid!.toLowerCase()]

      const rezoned = datetime.setZone(ianaZone, { keepLocalTime: true })

      return rezoned.toJSDate()
    } catch (e) {
      if (e instanceof TypeError) {
        console.error('Using TZID without Luxon available is unsupported. Returned times are in UTC, not the requested time zone')
      }
      return this.date
    }
  }
}
