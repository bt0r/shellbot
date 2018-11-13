import {Message} from "./Message";

export class ScheduleFactory {
    public static create(schedule: any) {
        let scheduleFound = null;
        switch (schedule.type) {
            case "twitter":
                break;
            case "message":
                scheduleFound = new Message(schedule.arguments);
                break;
        }

        return scheduleFound;
    }
}
