export interface registerUserPayload{
    email: string;
    password: string;
    username: string;
    firstName: string;
    lastName: string;
    address: string;
    phone: string;
    acceptedTermsAndConditions: boolean;
}
export interface createListingPayload {
    propertyType: string
    buildYear: number
    listingDescription?: string
    size: number
    startingPrice: number
    buyoutPrice: number
    location: string
    startsOn: Date
    endsOn: Date
    newImages: boolean
}
export interface createCommentPayload{
    text: string;
}
export interface createBidPayload{
    amount: number;
}