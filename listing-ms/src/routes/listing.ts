
import { Router } from 'express';
import { handleChangeListing, handleCreateListing, handleGetListingDetails, handleGetListings, handleRemoveListing } from '../controllers/listing.controller';
import { isAuth } from 'shared/middleware/is-auth';
import { validateListingDto } from '../middleware/listing-dto-validator';

const router = Router()
router.post('/', isAuth, validateListingDto, handleCreateListing);
router.put('/:listingId', isAuth, validateListingDto, handleChangeListing);
router.delete('/:listingId', isAuth, handleRemoveListing);
router.get('/', handleGetListings);
router.get('/:listingId', handleGetListingDetails);

export default router;
