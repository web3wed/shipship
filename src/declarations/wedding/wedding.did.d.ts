import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';

export interface _SERVICE {
  'agreeToMarry' : ActorMethod<[], undefined>,
  'getPartnerInfo' : ActorMethod<
    [Principal],
    [] | [
      {
        'id' : Principal,
        'name' : [] | [string],
        'wedding' : string,
        'isAgreed' : boolean,
      }
    ]
  >,
  'getWeddingInfoOf' : ActorMethod<
    [Principal],
    [] | [
      {
        'id' : string,
        'hadAt' : bigint,
        'partner1' : {
          'id' : Principal,
          'name' : [] | [string],
          'wedding' : string,
          'isAgreed' : boolean,
        },
        'partner2' : {
          'id' : Principal,
          'name' : [] | [string],
          'wedding' : string,
          'isAgreed' : boolean,
        },
      }
    ]
  >,
  'matchPartner' : ActorMethod<[string, Principal], undefined>,
  'test' : ActorMethod<[], undefined>,
}
