// /lib/db.js

import { Pool } from 'pg';

const pool = new Pool({
  connectionString: 'postgresql://neondb_owner:h2vnZ6dGQKTO@ep-muddy-bonus-a501xhf4.us-east-2.aws.neon.tech/neondb?sslmode=require'
});

export const query = (text, params) => pool.query(text, params);
