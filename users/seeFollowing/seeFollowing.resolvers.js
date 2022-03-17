import client from "../../client";

export default{
    Query: {
        seeFollowing: async(_, {username, lastId}) => {
            const ok = await client.user.findUnique({where:{username}, select:{id: true}});
            if(!ok){
                return{
                    ok: false,
                    error: "사용자를 찾을 수 없습니다."
                };
            }
            const following = await client.user
            .findUnique({where: {username}})
            .following({
                take: 5,
                skip: lastId ? 1 : 0,
                ...(lastId && {cursor: {id:lastId}})
            });
            return{
                ok: true, 
                following
            }
        }
    }
};