export interface BaseDTO{
    _id: string,
}
export interface WithCreator{
    creatorId: string | null;
}