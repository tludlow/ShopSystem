function user(state = {}, action) {
    switch (action.type) {
        case 'USER_LOGINREQUEST':
            return {...state, loading: true, errors: ""}
        default:
        return state;
    }
}

export default user;