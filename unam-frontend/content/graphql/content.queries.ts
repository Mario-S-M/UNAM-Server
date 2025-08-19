export const GET_CONTENTS_PAGINATED = `
  query GetContentsPaginated($search: String, $page: Int, $limit: Int) {
    contentsPaginated(search: $search, page: $page, limit: $limit) {
      contents {
        id
        name
        description
        validationStatus
        createdAt
        updatedAt
        levelId
        skill {
          id
          name
          color
        }
        assignedTeachers {
          id
          fullName
          email
        }
      }
      total
      page
      limit
      totalPages
      hasNextPage
      hasPreviousPage
    }
  }
`;

export const GET_LEVELS = `
  query GetLevels {
    levels {
      id
      name
    }
  }
`;

export const GET_SKILLS = `
  query GetSkills($page: Int, $limit: Int) {
    skillsPaginated(page: $page, limit: $limit) {
      skills {
        id
        name
        color
      }
    }
  }
`;

export const GET_TEACHERS = `
  query GetTeachers {
    users(roles: [docente]) {
      id
      fullName
      email
    }
  }
`;

export const CREATE_CONTENT = `
  mutation CreateContent($createContentInput: CreateContentInput!) {
    createContent(createContentInput: $createContentInput) {
      id
      name
      description
      validationStatus
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_CONTENT = `
  mutation UpdateContent($updateContentInput: UpdateContentInput!) {
    updateContent(updateContentInput: $updateContentInput) {
      id
      name
      description
      validationStatus
      createdAt
      updatedAt
    }
  }
`;

export const DELETE_CONTENT = `
  mutation DeleteContent($id: ID!) {
    removeContent(id: $id) {
      id
      name
    }
  }
`;