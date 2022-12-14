
import Header from './components/header';
import {ApolloProvider, ApolloClient, InMemoryCache} from '@apollo/client';
import Clients from './components/client';

const cache = new InMemoryCache({
  typePolicies : {
    Query: {
      fields: {
        clients: {
          merge(existing, incoming) {
            return incoming;
          }
        },
        projects: {
          merge(existing, incoming) {
            return incoming;
          }
        }
      }
    }
  }
});

const client = new ApolloClient({
  uri: 'http://localhost:8080/graphql',
  cache,
});

function App() {
  return (
    <>
      <ApolloProvider client={client}>
        <Header/>
        <div className="container">
          <Clients/>
        </div>
      </ApolloProvider>
    </>
    
  );
}

export default App;
