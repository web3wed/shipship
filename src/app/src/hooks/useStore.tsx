import { createContext, FC, PropsWithChildren, useContext, useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { ActorSubclass, Identity } from '@dfinity/agent';
import { AuthClient, AuthClientCreateOptions, AuthClientLoginOptions } from '@dfinity/auth-client';
import { Principal } from '@dfinity/principal';

import { canisterId as weddingCanisterId, createActor as createWeddingActor } from '../../../declarations/wedding';
import { _SERVICE as _WEDDING_SERVICE } from '../../../declarations/wedding/wedding.did';

const IS_MAINNET = process.env.DFX_NETWORK === 'ic';

const LEDGER_HOST = process.env.LEDGER_HOST;

const defaultOptions: {
  createOptions: AuthClientCreateOptions;
  loginOptions: AuthClientLoginOptions;
} = {
  createOptions: {
    idleOptions: {
      // Set to true if you do not want idle functionality
      disableIdle: true,
    },
  },
  loginOptions: {
    identityProvider: IS_MAINNET
      ? 'https://identity.ic0.app/#authorize'
      : `http://${LEDGER_HOST}?canisterId=rdmx6-jaaaa-aaaaa-aaadq-cai#authorize`,
  },
};

const useStore_ = (options = defaultOptions) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [authClient, setAuthClient] = useState<AuthClient | null>(null);
  const [identity, setIdentity] = useState<Identity | null>(null);
  const [principal, setPrincipal] = useState<Principal | null>(null);
  const [weddingActor, setWeddingActor] = useState<ActorSubclass<_WEDDING_SERVICE> | null>(null);

  const getWeddingInfoInterval = useRef<number>();
  const [weddingInfo, setWeddingInfo] = useState<Awaited<ReturnType<_WEDDING_SERVICE['getWeddingInfoOf']>>[0] | null>();
  const isPartner1 = weddingInfo?.partner1.id && principal?.compareTo(weddingInfo.partner1.id) === 'eq';
  const myPartnerInfo = isPartner1 ? weddingInfo?.partner1 : weddingInfo?.partner2;
  const otherPartnerInfo = isPartner1 ? weddingInfo?.partner2 : weddingInfo?.partner1;

  const handleGetWeddingInfo = async (weddingActor_ = weddingActor!, principal_ = principal!) => {
    try {
      const weddingData = await weddingActor_.getWeddingInfoOf(principal_);

      if (weddingData.length === 0) {
        setWeddingInfo(null);
      } else {
        setWeddingInfo(weddingData[0]);
      }
    } catch (error) {
      console.error(error);
      toast.error('Error while fetching wedding info');

      window.clearInterval(getWeddingInfoInterval.current);
    }
  };

  const updateClient = async (client: AuthClient) => {
    setAuthClient(client);

    const isAuthenticated_ = await client.isAuthenticated();
    setIsAuthenticated(isAuthenticated_);

    const identity_ = client.getIdentity();
    setIdentity(identity_);

    const principal_ = identity_.getPrincipal();
    setPrincipal(principal_);

    const weddingActor_ = createWeddingActor(weddingCanisterId, {
      agentOptions: {
        identity: identity_,
      },
    });
    setWeddingActor(weddingActor_);

    window.clearInterval(getWeddingInfoInterval.current);
    getWeddingInfoInterval.current = window.setInterval(async () => {
      await handleGetWeddingInfo(weddingActor_, principal_);
    }, 5000);
    await handleGetWeddingInfo(weddingActor_, principal_);
  };

  const initAuthClient = async () => {
    try {
      const authClient_ = await AuthClient.create(options.createOptions);
      updateClient(authClient_);
    } catch (error) {
      console.error(error);
      toast.error('Error while initializing Internet Identity');
      setIsAuthenticated(false);
    }
  };

  useEffect(() => {
    initAuthClient();

    return () => {
      window.clearInterval(getWeddingInfoInterval.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = async () => {
    await authClient!.login({
      ...options.loginOptions,
      onSuccess: () => {
        updateClient(authClient!);
      },
    });
  };

  const logout = async () => {
    await authClient!.logout();
    await updateClient(authClient!);
  };

  return {
    isAuthenticated,
    login,
    logout,
    authClient,
    identity: identity!,
    principal: principal!,
    weddingActor: weddingActor!,
    handleGetWeddingInfo,
    weddingInfo,
    myPartnerInfo,
    otherPartnerInfo,
  };
};

const StoreContext = createContext<ReturnType<typeof useStore_>>({} as any);

export const StoreProvider: FC<PropsWithChildren> = ({ children }) => {
  const store = useStore_();

  return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>;
};

export const useStore = () => useContext(StoreContext);
