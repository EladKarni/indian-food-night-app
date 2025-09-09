import { createClient } from '@supabase/supabase-js';

// Load environment variables
require('dotenv').config({ path: '.env.local' });

async function testSupabase() {
  // Initialize Supabase client
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Supabase environment variables not set');
    return;
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey);
  
  console.log('Testing Supabase connection...');
  
  // Try to select from menu_items to see what columns exist
  const { data, error } = await supabase
    .from('menu_items')
    .select()
    .limit(1);
  
  if (error) {
    console.error('Error accessing menu_items table:', error);
  } else {
    console.log('Successfully accessed menu_items table');
    console.log('Existing data (first record):', data);
    
    // Get table structure by examining first record
    if (data && data.length > 0) {
      console.log('Table columns based on existing data:');
      Object.keys(data[0]).forEach(column => {
        console.log(`  - ${column}: ${typeof data[0][column]}`);
      });
    } else {
      console.log('Table is empty, trying to insert a test record to discover structure...');
      
      // Try a simple insert to see what happens
      const { data: insertData, error: insertError } = await supabase
        .from('menu_items')
        .insert([
          {
            id: 'test_item',
            name: 'Test Item',
            description: 'Test Description',
            price: 9.99
          }
        ])
        .select();
      
      if (insertError) {
        console.error('Insert error:', insertError);
        console.log('Trying with minimal fields...');
        
        // Try with just name
        const { data: minimalData, error: minimalError } = await supabase
          .from('menu_items')
          .insert([
            {
              name: 'Test Item'
            }
          ])
          .select();
        
        if (minimalError) {
          console.error('Minimal insert error:', minimalError);
        } else {
          console.log('Minimal insert successful:', minimalData);
        }
      } else {
        console.log('Insert successful:', insertData);
        if (insertData && insertData.length > 0) {
          console.log('Table structure based on inserted record:');
          Object.keys(insertData[0]).forEach(column => {
            console.log(`  - ${column}: ${typeof insertData[0][column]}`);
          });
        }
      }
    }
  }
}

testSupabase()
  .then(() => {
    console.log('Test completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Test failed:', error);
    process.exit(1);
  });