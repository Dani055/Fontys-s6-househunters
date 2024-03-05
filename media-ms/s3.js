import { DeleteObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import dotenv from 'dotenv';
dotenv.config()

const client = new S3Client({
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
    region: process.env.S3_REGION
})

export async function uploadMediaS3(files) {
    const commands = files.map(file => {
        const newFileName = Math.random().toString(16).slice(2);

        return new Upload({
            client,
            params: {
                Bucket: process.env.S3_BUCKET,
                Key: "semester6/" + Date.now() + "_" + newFileName,
                Body: file.buffer,
            }
        });
    })
    try {
        const responses = await Promise.all(commands.map(command => command.done()));
        const links = []
        for (let response of responses) {
            if (response['$metadata'].httpStatusCode === 200) {
                links.push(response.Location)
            }
        }
        return links;

    } catch (error) {
        throw new Error('Error uploading file:', error);
    }
}
export async function deleteMediaS3(links) {
    const commands = links.map(link => {
        const objectkey = 'semester6/' + link.split('/semester6/')[1];
        return new DeleteObjectCommand({
            Bucket: process.env.S3_BUCKET,
            Key: objectkey,
        });
    })
    try {
        const responses = await Promise.all(commands.map(command => client.send(command)));
        const statusCode = 204;
        for (let response of responses) {
            if (response['$metadata'].httpStatusCode !== 204) {
                statusCode = 204
            }
        }
        return statusCode;

    } catch (error) {
        throw new Error('Error deleting file:', error);
    }
}
