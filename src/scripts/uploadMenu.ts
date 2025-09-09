import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import { randomUUID } from 'crypto';

// Load environment variables
require('dotenv').config({ path: '.env.local' });

// Load menu data
const menuDataPath = path.join(__dirname, '../data/corianderActualMenu.json');
const menuData = JSON.parse(fs.readFileSync(menuDataPath, 'utf8'));

interface MenuItemForDB {
  name: string;
  price: number;
}

async function uploadMenuItems() {
  // Initialize Supabase client
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Supabase environment variables not set. Please check NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY');
    return;
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey);
  
  if (!supabase) {
    console.error('Supabase client not available. Check environment variables.');
    return;
  }

  console.log('Starting menu upload to Supabase...');
  console.log(`Restaurant: ${menuData.restaurant}`);
  console.log(`Total categories: ${menuData.categories.length}`);

  // Transform JSON data to database format
  const menuItemsForDB: MenuItemForDB[] = [];
  
  menuData.categories.forEach((category: any) => {
    console.log(`Processing category: ${category.name} (${category.items.length} items)`);
    
    category.items.forEach((item: any) => {
      menuItemsForDB.push({
        name: item.name,
        price: item.price
      });
    });
  });

  console.log(`Total menu items to upload: ${menuItemsForDB.length}`);

  try {
    console.log('Skipping cleanup - uploading new menu items...');

    // Upload new menu items in batches
    const batchSize = 50;
    const batches = [];
    
    for (let i = 0; i < menuItemsForDB.length; i += batchSize) {
      batches.push(menuItemsForDB.slice(i, i + batchSize));
    }

    console.log(`Uploading ${batches.length} batch(es)...`);

    for (let i = 0; i < batches.length; i++) {
      const batch = batches[i];
      console.log(`Uploading batch ${i + 1}/${batches.length} (${batch.length} items)...`);

      const { data, error } = await supabase
        .from('menu_items')
        .insert(batch)
        .select();

      if (error) {
        console.error(`Error uploading batch ${i + 1}:`, error);
        throw error;
      }

      console.log(`Batch ${i + 1} uploaded successfully: ${data?.length} items inserted`);
    }

    console.log('✅ Menu upload completed successfully!');
    console.log(`📊 Total items uploaded: ${menuItemsForDB.length}`);
    
    // Verify upload
    const { data: verifyData, error: verifyError } = await supabase
      .from('menu_items')
      .select('id, name, category')
      .order('category', { ascending: true });

    if (verifyError) {
      console.error('Error verifying upload:', verifyError);
    } else {
      console.log(`✅ Verification: ${verifyData?.length} items found in database`);
      
      // Group by category for verification
      const categoryCounts: Record<string, number> = {};
      verifyData?.forEach(item => {
        categoryCounts[item.category] = (categoryCounts[item.category] || 0) + 1;
      });
      
      console.log('📋 Items per category:');
      Object.entries(categoryCounts).forEach(([category, count]) => {
        console.log(`   ${category}: ${count} items`);
      });
    }

  } catch (error) {
    console.error('❌ Menu upload failed:', error);
    throw error;
  }
}

// Export for use in other scripts or run directly
export { uploadMenuItems };

// Run the upload if this script is executed directly
if (require.main === module) {
  uploadMenuItems()
    .then(() => {
      console.log('Menu upload script completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Menu upload script failed:', error);
      process.exit(1);
    });
}