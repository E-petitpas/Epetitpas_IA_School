import { testDatabaseConnection, prisma } from './src/database';

async function main() {
  console.log('🔍 Testing database connection...\n');
  
  const isConnected = await testDatabaseConnection();
  
  if (isConnected) {
    console.log('📊 Testing basic database operations...\n');
    
    try {
      // Test: Count existing tables
      const userCount = await prisma.user.count();
      const planCount = await prisma.subscriptionPlan.count();
      
      console.log(`📋 Database Statistics:`);
      console.log(`   - Users: ${userCount}`);
      console.log(`   - Subscription Plans: ${planCount}`);
      
      console.log('\n✅ Database is ready for use!');
      
    } catch (error) {
      console.error('❌ Database operation failed:', error);
    }
  } else {
    console.log('❌ Please check your database configuration');
  }
  
  await prisma.$disconnect();
}

main().catch((error) => {
  console.error('❌ Test failed:', error);
  process.exit(1);
});