// import {PrismaClient} from "@prisma/client";
import { PrismaClient } from '../../app/generated/prisma'
const PrismaClientSingleton = () => {
    return new PrismaClient();
}
declare const globalThis: {
    prismaGlobal: ReturnType<typeof PrismaClientSingleton>;
} & typeof global;

const prisma = globalThis.prismaGlobal ?? PrismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV === "development") {
    globalThis.prismaGlobal = prisma;
}