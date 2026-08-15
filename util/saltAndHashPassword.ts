import bcrypt from "bcryptjs";

export class PasswordHasher {
    static async hash(value: string) {
        return bcrypt.hash(value, 12);
    }

    static async compare(value: string, hash: string) {
        return bcrypt.compare(value, hash);
    }
}
