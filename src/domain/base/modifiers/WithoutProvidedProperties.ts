import {ICredentialParams, IToTrustlyRequestParams} from "../IToTrustlyRequestParams";

export type WithoutProvidedProperties<T extends IToTrustlyRequestParams> = Omit<T, keyof ICredentialParams>
