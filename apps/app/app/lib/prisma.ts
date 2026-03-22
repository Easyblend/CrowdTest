import "dotenv/config";
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from "@prisma/client";
import { Pool } from 'pg';

const connectionString = `${process.env.DATABASE_LIVE_URL}?pgbouncer=true`

const pool = new Pool({
    connectionString: connectionString,
});

export const prisma = new PrismaClient({
    adapter: new PrismaPg(pool),
});