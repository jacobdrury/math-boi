export default class TimeDifference {
    difference: number;
    daysDifference: number;
    hoursDifference: number;
    minutesDifference: number;
    secondsDifference: number;
    constructor(startDate: Date, endDate: Date) {
        this.difference = startDate.getTime() - endDate.getTime();

        this.daysDifference = Math.floor(this.difference / 1000 / 60 / 60 / 24);
        this.difference -= this.daysDifference * 1000 * 60 * 60 * 24;

        this.hoursDifference = Math.floor(this.difference / 1000 / 60 / 60);
        this.difference -= this.hoursDifference * 1000 * 60 * 60;

        this.minutesDifference = Math.floor(this.difference / 1000 / 60);
        this.difference -= this.minutesDifference * 1000 * 60;

        this.secondsDifference = Math.floor(this.difference / 1000);
    }
}
