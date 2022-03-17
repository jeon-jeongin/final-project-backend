import bcrypt from "bcrypt";
import client from "../../client";

export default {
    Mutation: {
        createAccount: async (
            _,
            { firstName, lastName, username, email, password }
        ) => {
            try {
                // 사용자 이름 또는 이메일이 데이터 베이스에 있는지 확인하기
                const existingUser = await client.user.findFirst({
                    where: {
                        OR: [
                            {
                                username,
                            },
                            {
                                email,
                            },
                        ],
                    },
                });
                if (existingUser) {
                    throw new Error("동일한 사용자 이름 혹은 비밀번호가 존재 합니다.");
                }
                // 비밀번호 암호화 하기
                const uglyPassword = await bcrypt.hash(password, 10);
                await client.user.create({
                    data: {
                        username,
                        email,
                        firstName,
                        lastName,
                        password: uglyPassword,
                    },
                });
                return {
                    ok: true,
                };
            } catch (e) {
                return {
                    ok: false,
                    error: "계정을 생성할 수 없습니다.",
                };
            }
        },
    },
};
