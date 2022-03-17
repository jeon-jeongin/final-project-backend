import AWS from "aws-sdk";

export const uploadToS3 = async (file, userId, folderName) => {
    AWS.config.update({
        credentials: {
            accessKeyId: process.env.AWS_KEY,
            secretAccessKey: process.env.AWS_SECRECT,
        }
    });

    const { filename, createReadStream } = await file;
    console.log(createReadStream);
    console.log(filename)
    const readStream = createReadStream();
    const objectName = `${folderName}/${userId}-${Date.now()}-${filename}`;
    const { Location } = await new AWS.S3()
        .upload({
            Bucket: "finalproject-uploads",
            Key: objectName,
            ACL: "public-read",
            Body: readStream,
        }).promise();
    return Location;
};

