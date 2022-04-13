import client from "../../client";
import { protectResolver } from "../../users/users.utils";


export default {
    Mutation: {
        deleteRoom: protectResolver(async (_, { id }) => {
            const room = await client.room.findUnique({
                where: {
                    id,
                },

            });
            if (!room) {
                return {
                    ok: false,
                    error: "메시지 방을 찾을 수 없습니다."
                };
            } else {
                await client.room.delete({
                    where: {
                        id
                    }
                });
                return {
                    ok: true
                }
            }
        })
    }
}