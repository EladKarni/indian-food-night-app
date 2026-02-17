# Database Migrations

## Running the Migration

To apply the `add_user_id_to_orders.sql` migration:

### Option 1: Supabase Dashboard
1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Copy and paste the contents of `add_user_id_to_orders.sql`
4. Click "Run"

### Option 2: Supabase CLI
```bash
supabase db push
```

### Option 3: Direct SQL Connection
```bash
psql $DATABASE_URL -f migrations/add_user_id_to_orders.sql
```

## After Migration

1. **Regenerate TypeScript types:**
```bash
npx supabase gen types typescript --project-id YOUR_PROJECT_ID > src/types/supabase-types.ts
```

2. **Verify the migration:**
Run this query in Supabase SQL Editor:
```sql
SELECT
  COUNT(*) as total_orders,
  COUNT(user_id) as orders_with_user_id,
  ROUND(100.0 * COUNT(user_id) / COUNT(*), 2) as backfill_percentage
FROM orders;
```

Expected result: backfill_percentage should be > 90% for existing orders.

## What This Migration Does

- Adds `user_id` column to `orders` table as nullable UUID foreign key
- Creates index on `user_id` for query performance
- Backfills existing orders by matching `user_name` to `profiles` table
- Maintains backward compatibility (keeps `user_name` field)
- Guest orders will have `user_id = NULL`
