import bcrypt from "bcrypt";
import joi from "joi";

export interface UserOptions {
    id?: string;
    username?: string;
    fullname?: string;
    email?: string;
    age?: number;
    role?: string;
    password?: string;
}

class User implements UserOptions {
    id?: string;
    username?: string;
    fullname?: string;
    email?: string;
    age?: number;
    role?: string;
    password?: string;

    constructor({ id, username, fullname, email, age, role = "Student", password }: UserOptions) {
        this.id = id;
        this.username = username;
        this.fullname = fullname;
        this.email = email;
        this.age = age;
        this.role = role;
        this.password = password;
    }

    async hashPassword() {
        if (this.password) {
            const salt = await bcrypt.genSalt();
            this.password = await bcrypt.hash(this.password, salt);
        }
    }

    async validatePassword(password: string) {
        if (this.password) return await bcrypt.compare(this.password, password);
        return false;
    }

    async validateForRegistration() {
        const schema = joi.object({
            username: joi.string().required(),
            fullname: joi.string().required(),
            email: joi.string().email().required(),
            age: joi.number().integer().min(16).max(120).required(),
            role: joi.string().required(),
            password: joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
        });

        const { id, ...rest } = this;
        return await schema.validateAsync(rest);
    }

    async validateForLogin() {
        const schema = joi.object({
            email: joi.string().email().required(),
            password: joi.string().required(),
        });

        const { email, password } = this;
        return await schema.validateAsync({ email, password });
    }
}

export default User;
