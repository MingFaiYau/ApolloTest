import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, View, SafeAreaView, Platform, ActivityIndicator } from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';
import GoToBottomButton from './GoToBottomButton';
import DateBubble from './DateBubble';
import { ApolloClient, InMemoryCache } from 'apollo-boost';
import { createHttpLink } from 'apollo-link-http';
import { ApolloProvider, Query, Mutation } from 'react-apollo';
import { query_get_message, user_react_id, mutation_create_message } from './query';

export default class App extends React.PureComponent {
  constructor(props) {
    super(props)

    this.state = {
      client: null,
      data: []
    }

    this.dataCount = 0

    this.init = this.init.bind(this)
    this.renderGoBottomButton = this.renderGoBottomButton.bind(this)
    this.renderDateBubble = this.renderDateBubble.bind(this)
  }

  componentDidMount() {
    this.init();
  }

  init() {
    //set up client
    const graphQLLink = createHttpLink({
      uri:
        'https://api.graph.cool/simple/v1/cjlm3qv4f47ed0148w90036ig'
    })
    const client = new ApolloClient({
      link: graphQLLink,
      cache: new InMemoryCache().restore(window.__APOLLO_STATE__),
    })

    this.setState({
      client: client,
    })
  }

  renderGoBottomButton(props) {
    return <GoToBottomButton {...props} />
  }

  renderDateBubble(props) {
    return <DateBubble {...props} />
  }

  render() {
    let render
    if (this.state.client) {
      render = <ApolloProvider client={this.state.client}>
        <Query
          errorPolicy={'all'}
          query={query_get_message}
          pollInterval={0}
          variables={{ limit: 5, userId: user_react_id }}
          fetchPolicy='cache-and-network'
        >
          {
            (props) => {
              if (props.error) return <Text>{props.error}</Text>
              if (props.loading || !props.data) return <Text>Loading</Text>
              this.afId = props.data.allMessages && props.data.allMessages.length > 0 ?
                props.data.allMessages[props.data.allMessages.length - 1]._id : undefined
              console.log('this.afId', this.afId)
              return <Mutation
                mutation={mutation_create_message}
                update={(cache, { data: { createMessage } }) => {
                  const { allMessages } = cache.readQuery({
                    query: query_get_message,
                    variables: props.variables,
                  });

                  cache.writeQuery({
                    query: query_get_message,
                    variables: props.variables,
                    data: { allMessages: [createMessage].concat(allMessages) }
                  });
                }}
              >
                {
                  (createMessage, { loading }) => {
                    return (
                      <View style={{ flex: 1 }}>
                        <GiftedChat
                          renderAvatarOnTop={true}
                          messages={props.data.allMessages}
                          inverted={true}
                          renderGoBottomButton={this.renderGoBottomButton}
                          renderDateBubble={this.renderDateBubble}
                          loadEarlier={true}
                          onLoadEarlier={(sProps) => {
                            console.log('onLoadEarlier')
                            props.fetchMore({
                              variables: { afId: this.afId },
                              updateQuery: (prev, { fetchMoreResult }) => {
                                console.log(prev, fetchMoreResult)
                                if (!fetchMoreResult) return prev
                                return Object.assign({}, prev, {
                                  allMessages: [...prev.allMessages, ...fetchMoreResult.allMessages]
                                })
                              }
                            })
                          }}
                          onSend={(sProps) => {
                            const msg = sProps[0]
                            if (msg) {
                              createMessage({
                                variables:
                                  { text: msg.text, userId: user_react_id },
                                optimisticResponse:
                                {
                                  __typename: "Mutation",
                                  createMessage: {
                                    __typename: 'Message',
                                    _id: msg._id,
                                    text: msg.text,
                                    createdAt: msg.createdAt,
                                    sent: false,
                                    user: {
                                      _id: user_react_id,
                                      __typename: 'User',
                                      name: 'User',
                                    }
                                  },
                                }
                              })
                            }
                          }}
                          user={{ _id: user_react_id }}
                        />
                      </View>
                    )
                  }
                }
              </Mutation>
            }
          }
        </Query>
      </ApolloProvider>
    } else {
      render = <Text>Loading</Text>
    }

    return (
      <SafeAreaView style={{ flex: 1, marginTop: Platform.select({ android: 24, ios: 0 }) }}>
        <View style={styles.container}>
          {render}
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#4d4d4d',
  },
});

App.propTypes = {
  isConnected: PropTypes.bool,
}