export const idlFactory = ({ IDL }) => {
  return IDL.Service({
    'agreeToMarry' : IDL.Func([], [], []),
    'getPartnerInfo' : IDL.Func(
        [IDL.Principal],
        [
          IDL.Opt(
            IDL.Record({
              'id' : IDL.Principal,
              'name' : IDL.Opt(IDL.Text),
              'wedding' : IDL.Text,
              'isAgreed' : IDL.Bool,
            })
          ),
        ],
        ['query'],
      ),
    'getWeddingInfoOf' : IDL.Func(
        [IDL.Principal],
        [
          IDL.Opt(
            IDL.Record({
              'id' : IDL.Text,
              'hadAt' : IDL.Nat,
              'partner1' : IDL.Record({
                'id' : IDL.Principal,
                'name' : IDL.Opt(IDL.Text),
                'wedding' : IDL.Text,
                'isAgreed' : IDL.Bool,
              }),
              'partner2' : IDL.Record({
                'id' : IDL.Principal,
                'name' : IDL.Opt(IDL.Text),
                'wedding' : IDL.Text,
                'isAgreed' : IDL.Bool,
              }),
            })
          ),
        ],
        ['query'],
      ),
    'matchPartner' : IDL.Func([IDL.Text, IDL.Principal], [], []),
    'test' : IDL.Func([], [], []),
  });
};
export const init = ({ IDL }) => { return []; };
