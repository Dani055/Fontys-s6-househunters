import dayjs from "dayjs";
import { ResponseError } from "shared/responses/responseError";

export const validateListingDates = (startsOn: Date, endsOn: Date): boolean => {
    const now = dayjs();
    const startDate = dayjs(startsOn);
    const endDate = dayjs(endsOn);
    if(startDate.isBefore(now) || endDate.isBefore(now)){
        throw new ResponseError(400, "Dates cannot be in the past")
    }
    else if(endDate.isBefore(startDate)){
        throw new ResponseError(400, 'End date is before start date')
    }
    else if(now.add(1, 'day').isAfter(startDate)){
        throw new ResponseError(400, 'Listing must start at least 1 day after today')
    }
    else if(startDate.add(1, 'day').isAfter(endDate)){
        throw new ResponseError(400, 'Listing must run for at least 1 day')
    }
    return true;
};
export const hasListingStarted = (startsOn: Date): boolean => {
    const now = dayjs();
    const startDate = dayjs(startsOn);
    return now.isAfter(startDate);
};
export const hasListingEnded = (endsOn: Date): boolean => {
    const now = dayjs();
    const endDate = dayjs(endsOn);
    return now.isAfter(endDate);
};