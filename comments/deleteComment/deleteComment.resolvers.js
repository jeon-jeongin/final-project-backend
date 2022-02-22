import client from "../../client";
import { protectResolver } from "../../users/users.utils";

export default {
    Mutation: {
        deleteComment: protectResolver(async(_, {id}, {loggedInUser}) => {
            const comment = await client.comment.findUnique({
                where: {
                    id,
                },
                select: {
                    userId: true
                },
            });
            if(!comment){
                return {
                    ok: false,
                    error: "사진을 찾을 수 없습니다."
                };
            } else if(comment.userId !== loggedInUser.id){
                return {
                    ok: false,
                    error: "사용자의 사진이 아니므로 삭제가 불가능합니다."
                };
            } else {
                await client.comment.delete({
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