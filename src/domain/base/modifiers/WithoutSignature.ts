import {ResponseSignatureOwner, SignatureOwner} from '../SignatureOwner';
import {SetOptional} from 'type-fest';

export type WithoutSignature<T> = T extends SignatureOwner
  ? SetOptional<T, 'Signature'>
  : T extends ResponseSignatureOwner
    ? SetOptional<T, 'signature'>
    : { [K in keyof T]: WithoutSignature<T[K]> }
