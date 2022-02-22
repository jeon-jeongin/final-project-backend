import client from "../../client";
import { NEW_MESSAGE } from "../../constants";
import pubsub from "../../pubsub";
import { protectResolver } from "../../users/users.utils";

export default{
    Mutation :{
        sendMessage: protectResolver(async(_, {payload, roomId, userId}, {loggedInUser}) => {
            let room = null;
            if(userId){
                const user = await client.user.findUnique({
                    where: {
                        id: userId,
                    },
                    select: {
                        id: true,
                    }
                });
                if(!user){
                    return {
                        ok: false,
                        error: "이 사용자는 존재하지 않습니다."
                    };
                }
                room = await client.room.create({
                    data: {
                        users: {
                            connect: [
                                {
                                    id:userId
                                },
                                {
                                    id: loggedInUser.id,
                                },
                            ],
                        },
                    }
                });
            } else if(roomId){
                room = await client.room.findUnique({
                    where: {
                        id: roomId,
                    },
                    select: {
                        id: true,
                    }
                });
                if(!room){
                    return {
                        ok: false,
                        error: "채팅방을 찾을 수 없습니다."
                    }
                }
            }
            const message = await client.message.create({
                data: {
                    payload,
                    room: {
                        connect: {
                            id: room.id
                        }
                    },
                    user: {
                        connect: {
                            id: loggedInUser.id
                        }
                    },
                }
            });
            pubsub.publish(NEW_MESSAGE, {roomUpdates: {...message}});
            return {
                ok: true,
            }
        })
    }
}