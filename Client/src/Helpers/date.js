export const convertDatePostList = (postsList) => {
    postsList.forEach((entity) => {
        entity.createdAt = moment(entity.createdAt).fromNow()

        entity.replies.forEach((reply) => {
            reply.createdAt = moment(reply.createdAt).fromNow()
        })
    })
}