import { gql } from "apollo-server-express";

export default gql`
    type Mutation {
        createRoom(userId: Int! payload:String!):  MutationResponse!
    }
`