import client from "../../client";
import { protectResolver } from "../../users/users.utils";

export default {
    Mutation: {
        editComment: protectResolver(async(_, {id, payload}, {loggedInUser}) => {
            const comment = await client.comment.findUnique({
                where: {
                    id,
                },
                select: {
                    userId: true,
                }
            });
            if(!comment){
                return {
                    ok: false,
                    error: "댓글을 찾을 수 없습니다."
                };
            } else if(comment.userId !== loggedInUser.id){
                return {
                    ok: false,
                    error: "사용자의 댓글이 아니므로 삭제가 불가능합니다."
                };
            } else{
                await client.comment.update({
                    where: {
                        id,
                    },
                    data: {
                        payload,
                    }
                });
                return {
                    ok: true
                }
            }
        })
    }
}