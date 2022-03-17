import client from "../../client";
import { protectResolver } from "../../users/users.utils";

export default {
    Mutation: {
        createRoom: protectResolver(async (_, { userId, payload }, { loggedInUser }) => {

        })
    }
}