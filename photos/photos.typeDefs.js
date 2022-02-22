import { gql } from "apollo-server-express";

export default gql`
    type Photo{
        id: Int!
        user: User!
        file: String!
        caption: String
        hashtags: [Hashtag]
        likes: Int!
        comments: Int!
        createAt: String!
        updateAt: String!
        isMine: Boolean!
    }
    type Hashtag{
        id: Int!
        hashtag: String!
        photos(page: Int!): [Photo]
        totalPhotos: Int!
        createAt: String!
        updateAt: String!
    }
    type Like {
        id: Int!
        photo: Photo!
        createAt: String!
        updateAt: String!
    }
`;