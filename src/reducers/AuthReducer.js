import {
    CHECK_KEYCHAIN,
    SIGNIN,
    CHECK_PINCODE_AUTH,
    HAS_BIO_AUTH,
    LOADING,
    TO_MAIN_SCREEN,
    CHECK_BIO_AUTH_ACTIVE,
} from '../actions/types';

const INITIAL_STATE = {
    appLoading: true,
    hasKeyChain: false,
    signInLoading: false,
    pinCodeLoading: true,
    pinCodeRedux: null,
    hasBioAuth: false,
    isBioAuthActive: false,
    loading: true,
    toMainScreen: false,
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case CHECK_KEYCHAIN:
            return {
                ...state,
                hasKeyChain: action.hasKeyChain,
                appLoading: action.appLoading,
            };
        case SIGNIN:
            return {
                ...state,
                hasKeyChain: action.hasKeyChain,
                signInLoading: action.signInLoading,
            };
        case CHECK_PINCODE_AUTH:
            return {
                ...state,
                pinCodeRedux: action.pinCodeRedux,
            };
        case HAS_BIO_AUTH:
            return {
                ...state,
                hasBioAuth: action.hasBioAuth,
            };
        case CHECK_BIO_AUTH_ACTIVE:
            return {
                ...state,
                isBioAuthActive: action.isBioAuthActive,
            };
        case LOADING:
            return {
                ...state,
                loading: false,
            };
        case TO_MAIN_SCREEN:
            return {
                ...state,
                toMainScreen: true,
            };
        default:
            return state;
    }
};
