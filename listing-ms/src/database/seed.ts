import ListingEntity from "../models/Listing";

const listing1 = {
    _id: "211111111111111111111111",
    creatorId: "111111111111111111111112",
    hasSold: false,
    comments: [],
    images: [],
    propertyType: "Listing for testing bids and comments e2e",
    buildYear: 2055,
    size: 99,
    listingDescription: "This listing is used for comments integration tests",
    startingPrice: 2000,
    buyoutPrice: 4000,
    location: "The moon",
    startsOn: "2024-02-22T21:23:33.000Z",
    endsOn: "2026-04-22T21:23:33.000Z"
  };

export async function seedDatabase() {
  try {
    console.log('Seeding database')
    await ListingEntity.create(listing1)
    
    console.log('Seeding database complete')
  } catch (error) {
    console.error('Error inserting seed data:', error);
  }
}
