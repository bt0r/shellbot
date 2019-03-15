import {Message} from "./Message";
import {Twitter} from "./Twitter";

export class ScheduleFactory {
    public static create(schedule: any) {
        let scheduleFound = null;
        switch (schedule.type) {
            case "twitter":
                scheduleFound = new Twitter(schedule.arguments);
                break;
            case "message":
                scheduleFound = new Message(schedule.arguments);
                break;
        }

        return scheduleFound;
    }
}
