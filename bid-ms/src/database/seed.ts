import ListingFragment from "../models/ListingFragment";

const listing1 = {
    _id: "211111111111111111111111",
    creatorId: "111111111111111111111112",
    startingPrice: 2000,
    buyoutPrice: 4000,
    startsOn: "2024-02-22T21:23:33.000Z",
    endsOn: "2026-04-22T21:23:33.000Z"
  };

export async function seedDatabase() {
  try {
    console.log('Seeding database')
    await ListingFragment.create(listing1)
    
    console.log('Seeding database complete')
  } catch (error) {
    console.error('Error inserting seed data:', error);
  }
}
