const fetch = require('node-fetch');

// Test GraphQL query for contents by skill
async function testContentsBySkill() {
  const query = `
    query GetContentsBySkill($skillId: ID!) {
      contentsBySkillPublic(skillId: $skillId) {
        id
        name
        validationStatus
        isCompleted
        createdAt
        updatedAt
        skill {
          id
          name
        }
        assignedTeachers {
          id
          fullName
        }
      }
    }
  `;

  try {
    // First, let's get a skill ID
    const skillsQuery = `
      query GetSkills {
        activeSkills {
          id
          name
        }
      }
    `;

    console.log('🔍 Fetching skills...');
    const skillsResponse = await fetch('http://localhost:3000/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: skillsQuery,
      }),
    });

    const skillsData = await skillsResponse.json();
    console.log('📋 Skills data:', JSON.stringify(skillsData, null, 2));

    if (skillsData.data && skillsData.data.activeSkills && skillsData.data.activeSkills.length > 0) {
      const firstSkill = skillsData.data.activeSkills[0];
      console.log(`\n🎯 Testing contents for skill: ${firstSkill.name} (${firstSkill.id})`);

      const contentsResponse = await fetch('http://localhost:3000/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query,
          variables: { skillId: firstSkill.id },
        }),
      });

      const contentsData = await contentsResponse.json();
      console.log('📄 Contents data:', JSON.stringify(contentsData, null, 2));

      if (contentsData.data && contentsData.data.contentsBySkillPublic) {
        const contents = contentsData.data.contentsBySkillPublic;
        console.log(`\n📊 Found ${contents.length} contents for skill ${firstSkill.name}`);
        
        contents.forEach((content, index) => {
          console.log(`  ${index + 1}. ${content.name} - Status: ${content.validationStatus}`);
        });

        const approvedContents = contents.filter(c => c.validationStatus === 'APPROVED');
        console.log(`\n✅ Approved contents: ${approvedContents.length}`);
      }
    } else {
      console.log('❌ No skills found');
    }
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

testContentsBySkill();