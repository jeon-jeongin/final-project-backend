import jwt from "jsonwebtoken"
import client from "../client";

export const getUser = async(token) => {
    try {
        if(!token){
            return null;
        }
        const {id} = await jwt.verify(token, process.env.SECRECT_KEY);
        const user = await client.user.findUnique({where:{id}});
        if(user){
            return user;
        } else{
            return null;
        }   
    } catch {
        return null;
    }
};


export function protectResolver(ourResolver){
    return function(root, args, context, info){
        if(!context.loggedInUser){
            const query = info.operation.operation === "query";
            if(query){
                return null;
            } else {
                return {
                    ok: false, 
                    error: "로그인을 먼저 해주세요.",
                };
            }
        }
        return ourResolver(root, args, context, info);
    }
}