import gql from "graphql-tag";

export const user_react_id = "cjlm3wmrm06kq0189lzmjnfrw"

export const query_get_latest_message = gql`
    query getLatestMessage ( $msgId : String , $limit : Int , $userId : ID! ){
        allMessages (
            before : $msgId
            first : $limit
            filter:{
                user : {
                    id : $userId
                }
            }
            orderBy:createdAt_DESC
        ){
            _id : id
            text
            createdAt
            user {
                _id : id
                name
            }
        }
    }
`

export const query_get_more_message= gql`
    query getMoreMessage ( $msgId : ID! , $limit : Int! , $userId : ID! ){
        allMessages (
            after : $msgId
            first : $limit
            filter:{
                user : {
                    id : $userId
                }
            }
            orderBy:createdAt_DESC
        ){
            _id : id
            text
            createdAt
            user {
                _id : id
                name
            }
        }
    }
`

export const mutation_create_message = gql`
    mutation createMessage ( $text:String! , $userId : ID! ){
        createMessage (
            text: $text
            userId: $userId
        ) {
            _id : id
            text
            createdAt
            user {
                _id : id
                name
            }
        }
    }
` 