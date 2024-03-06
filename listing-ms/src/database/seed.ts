import ListingEntity from "../models/Listing";
import dayjs from 'dayjs'

const listing1 = {
    _id: "211111111111111111111111",
    creatorId: "652941c3938e8759af40aa91",
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
    startsOn: dayjs().subtract(1, 'day'),
    endsOn: dayjs().add(2, 'day')
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
