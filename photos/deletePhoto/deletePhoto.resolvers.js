import client from "../../client";
import { protectResolver } from "../../users/users.utils";

export default {
    Mutation: {
        deletePhoto: protectResolver(async(_, {id}, {loggedInUser}) => {
            const photo = await client.photo.findUnique({
                where: {
                    id,
                },
                select: {
                    userId: true
                },
            });
            if(!photo){
                return {
                    ok: false,
                    error: "사진을 찾을 수 없습니다."
                };
            } else if(photo.userId !== loggedInUser.id){
                return {
                    ok: false,
                    error: "사용자의 사진이 아니므로 삭제가 불가능합니다."
                };
            } else {
                await client.photo.delete({
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