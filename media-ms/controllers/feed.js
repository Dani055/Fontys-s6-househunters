import { channel } from '../messaging/connect.js';
import {deleteMediaS3, uploadMediaS3} from '../s3.js';


export const test = (req, res) => {
    res.send("Hello world!")
};
export const UploadMedia = async (req, res, next) => {
    try {
        if(!req.body.listingId){
            throw new Error('ListingId is missing');
        }
        const links = await uploadMediaS3(req.files);
        channel?.publish('media_uploaded', '', Buffer.from(JSON.stringify({listingId: req.body.listingId, links})));
        return res.status(200).json({
            message: `Uploaded ${req.files.length} files`,
            links
        })

    } catch (error) {
        next(error)
    }
};
export const DeleteMedia = async (req, res, next) => {
    try {
        const linksToDelete = req.body.links
        const statusCode = await deleteMediaS3(linksToDelete);
        return res.status(statusCode).json()

    } catch (error) {
        next(error)
    }
};
