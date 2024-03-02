import { RequestHandler } from 'express';
import { createListingPayload } from 'shared/requests/req';
import { validateListingDates } from 'shared/functions/listingValidator';

export const validateListingDto: RequestHandler = (req, res, next) => {
    const listingPayload: createListingPayload = req.body;
    validateListingDates(listingPayload.startsOn, listingPayload.endsOn)
    next();
};
