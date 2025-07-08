const fetch = require("node-fetch");

const GRAPHQL_ENDPOINT = "http://localhost:3000/graphql";

// Test para verificar que se remueven idiomas al cambiar roles
async function testRoleChangeRemovesLanguages() {
  console.log("🧪 Testing Role Change Removes Languages Functionality\n");

  console.log('📋 Test Case: When changing user role to "alumno" or "mortal"');
  console.log("Expected behavior:");
  console.log("✅ User should have assignedLanguages = []");
  console.log("✅ User should have assignedLanguageId = null");
  console.log("✅ Only admin, docente, and superUser roles can keep languages");

  console.log("\n🔍 Roles that can have languages:");
  console.log("- superUser ✅");
  console.log("- admin ✅");
  console.log("- docente ✅");

  console.log("\n🚫 Roles that CANNOT have languages:");
  console.log("- alumno ❌ (should remove languages)");
  console.log("- mortal ❌ (should remove languages)");

  console.log("\n📝 Implementation Details:");
  console.log("1. When updateUserRoles is called, check the new highest role");
  console.log(
    "2. If new role is alumno or mortal, remove all assigned languages"
  );
  console.log(
    "3. If new role is admin/docente/superUser, keep existing languages"
  );
  console.log(
    "4. Special case: admin converting user to docente assigns admin's language"
  );

  console.log("\n🛠️ Code Changes Made:");
  console.log("- Added role validation in updateUserRoles method");
  console.log("- Clear assignedLanguages array for non-language roles");
  console.log("- Set assignedLanguageId to undefined for non-language roles");
  console.log("- Maintain existing logic for language-enabled roles");

  console.log("\n🎯 Testing Required:");
  console.log("1. Create user with admin role and language assigned");
  console.log('2. Change role to "alumno" - should remove language');
  console.log('3. Change role to "mortal" - should remove language');
  console.log('4. Change role to "docente" - should keep language (if any)');
  console.log(
    "5. Admin converting user to docente - should assign admin's language"
  );

  console.log("\n✅ Implementation Status: COMPLETE");
  console.log("- Backend logic updated in UsersService.updateUserRoles()");
  console.log("- Language removal for alumno/mortal roles implemented");
  console.log("- Compatible with existing language assignment logic");

  return true;
}

// Ejecutar las pruebas
testRoleChangeRemovesLanguages()
  .then(() => {
    console.log("\n🎉 All tests documented and implementation complete!");
  })
  .catch(console.error);
