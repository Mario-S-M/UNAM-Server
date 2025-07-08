// Test script to verify language API
const testLanguageAPI = async () => {
  try {
    const response = await fetch("http://localhost:3000/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `
          query GetLanguages {
            lenguages {
              id
              name
              isActive
            }
          }
        `,
      }),
    });

    const result = await response.json();
    console.log("API Response:", result);

    if (result.data && result.data.lenguages) {
      console.log("Languages found:", result.data.lenguages.length);
      result.data.lenguages.forEach((lang, index) => {
        console.log(
          `${index + 1}. ${lang.name} (${
            lang.isActive ? "Active" : "Inactive"
          })`
        );
      });
    }
  } catch (error) {
    console.error("Error:", error);
  }
};

testLanguageAPI();
