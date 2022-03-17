import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import client from "../../client"

export default {
    Mutation: {
        login: async(_, { username, password
        }) => {
        // 아이디가 있는지 확인하기
        const user = await client.user.findFirst({where:{username}})
        if(!user){
            return{
                ok: false,
                error: "아이디가 일치하지 않습니다.",
            };
        }
        // 비밀번호가 일치하는지 확인하기
        const passwordOK = await bcrypt.compare(password, user.password);
        if(!passwordOK){
            return{
                ok: false,
                error: "잘못된 비밀번호 입니다.",
            };
        }
        // 둘다 일치 하다면 값을 보내주기
        const token = await jwt.sign({id: user.id}, process.env.SECRECT_KEY);
        return{
            ok: true,
            token,
        };
        },
    },
};