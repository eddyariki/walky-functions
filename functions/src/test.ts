import {ApolloServer, gql} from "apollo-server-cloud-functions";

const examples = [
  {id: 1, name: "exam1", message: "message1"},
  {id: 2, name: "exam2", message: "message2"},
  {id: 3, name: "exam3", message: "message3"},
];

const samples = [
  {id: 1, title: "sample1", status: "ok"},
  {id: 2, title: "sample2", status: "ok"},
  {id: 3, title: "sample3", status: "bad"},
];

const typeDefs = gql`
  type Query {
    examples: [Example]
    samples: [Sample]
  }

  type Example {
    id: ID!
    name: String!
    message: String!
  }

  type Sample {
    id: ID!
    title: String!
    status: String!
  }
`;

const resolvers = {
  Query: {
    examples: () => examples,
    samples: () => samples,
  },
};

export const server = new ApolloServer({typeDefs, resolvers});
