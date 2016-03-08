export function userFactory(user) {
    return {
        id: user.id,
        username: user.username,
        uri: user.uri
    };
}
