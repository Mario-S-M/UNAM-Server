// Simple test script to verify content validation
const {
  getValidatedContentsByLevel,
  getContentsByLevel,
} = require("./app/actions/content-actions");

async function testContentValidation() {
  const levelId = "5b92731c-afe1-494b-bb26-1019543aead3";

  try {
    console.log("🔍 Testing content validation filtering...");

    // Get all contents (admin view)
    const allContents = await getContentsByLevel(levelId);
    console.log("📊 All contents count:", allContents?.data?.length || 0);

    // Get only validated contents (student view)
    const validatedContents = await getValidatedContentsByLevel(levelId);
    console.log(
      "✅ Validated contents count:",
      validatedContents?.data?.length || 0
    );

    // Show validation status of each content
    if (allContents?.data) {
      console.log("\n📋 Content validation status:");
      allContents.data.forEach((content, index) => {
        console.log(
          `${index + 1}. ${content.name} - Status: ${content.validationStatus}`
        );
      });
    }
  } catch (error) {
    console.error("❌ Error testing validation:", error.message);
  }
}

// Run the test if this file is executed directly
if (require.main === module) {
  testContentValidation();
}

module.exports = { testContentValidation };
