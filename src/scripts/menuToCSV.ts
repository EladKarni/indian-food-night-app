import * as fs from 'fs';
import * as path from 'path';

// Load menu data
const menuDataPath = path.join(__dirname, '../data/corianderActualMenu.json');
const menuData = JSON.parse(fs.readFileSync(menuDataPath, 'utf8'));

function convertMenuToCSV() {
  console.log('Converting menu JSON to CSV format...');
  console.log(`Restaurant: ${menuData.restaurant}`);
  console.log(`Total categories: ${menuData.categories.length}`);

  // CSV Headers - using common database field names
  const headers = [
    'name',
    'description', 
    'price',
    'spice_level',
    'vegetarian',
    'vegan',
    'category',
    'item_id'
  ];

  // Start CSV with headers
  let csvContent = headers.join(',') + '\n';

  // Process each category and item
  let totalItems = 0;
  
  menuData.categories.forEach((category: any) => {
    console.log(`Processing category: ${category.name} (${category.items.length} items)`);
    
    category.items.forEach((item: any) => {
      // Escape any commas or quotes in the data
      const escapedName = `"${item.name.replace(/"/g, '""')}"`;
      const escapedDescription = `"${item.description.replace(/"/g, '""')}"`;
      const escapedCategory = `"${category.name.replace(/"/g, '""')}"`;
      const escapedItemId = `"${item.id}"`;
      
      // Build CSV row
      const row = [
        escapedName,
        escapedDescription,
        item.price.toString(),
        item.spiceLevel.toString(),
        item.vegetarian.toString(),
        item.vegan.toString(),
        escapedCategory,
        escapedItemId
      ].join(',');
      
      csvContent += row + '\n';
      totalItems++;
    });
  });

  console.log(`Total menu items processed: ${totalItems}`);

  // Write CSV file
  const outputPath = path.join(__dirname, '../../menu_items.csv');
  fs.writeFileSync(outputPath, csvContent, 'utf8');
  
  console.log(`✅ CSV file created: ${outputPath}`);
  console.log(`📊 Ready to upload ${totalItems} menu items to Supabase`);
  
  // Display first few lines as preview
  console.log('\n📋 CSV Preview (first 5 lines):');
  const lines = csvContent.split('\n').slice(0, 6);
  lines.forEach((line, index) => {
    if (line.trim()) {
      console.log(`${index === 0 ? 'Headers' : `Row ${index}`}: ${line}`);
    }
  });

  // Show category breakdown
  console.log('\n📊 Items per category:');
  menuData.categories.forEach((category: any) => {
    console.log(`  ${category.name}: ${category.items.length} items`);
  });

  return outputPath;
}

// Export for use in other scripts or run directly
export { convertMenuToCSV };

// Run the conversion if this script is executed directly
if (require.main === module) {
  try {
    const filePath = convertMenuToCSV();
    console.log(`\n🎉 Menu conversion completed successfully!`);
    console.log(`📁 File location: ${filePath}`);
    console.log('\n📝 Upload Instructions:');
    console.log('1. Go to your Supabase dashboard');
    console.log('2. Navigate to Table Editor');
    console.log('3. Select the "menu_items" table');
    console.log('4. Click "Insert" > "Import data from CSV"');
    console.log('5. Upload the generated menu_items.csv file');
    console.log('6. Map the CSV columns to your table columns');
    console.log('7. Import the data');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Menu conversion failed:', error);
    process.exit(1);
  }
}