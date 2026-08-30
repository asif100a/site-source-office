import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch, useSelector } from "react-redux";

import type { RootState } from "@/store/store";
import { setToken } from "@/store/slices/authSlice";

const protectedWorkerTabRoutes = new Set(["my-jobs", "chats", "profile"]);

export function useAuthToken() {
  return useSelector((state: RootState) => state.auth.token);
}

export function useAuthGuardState() {
  const dispatch = useDispatch();
  const token = useAuthToken();
  const [storedToken, setStoredToken] = useState<string | null>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(!token);

  useEffect(() => {
    let isMounted = true;

    if (token) {
      setStoredToken(null);
      setIsCheckingAuth(false);
      return () => {
        isMounted = false;
      };
    }

    setIsCheckingAuth(true);

    AsyncStorage.getItem("token")
      .then((nextToken) => {
        if (isMounted) {
          setStoredToken(nextToken);

          if (nextToken) {
            dispatch(setToken(nextToken));
          }
        }
      })
      .catch(() => {
        if (isMounted) {
          setStoredToken(null);
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsCheckingAuth(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [dispatch, token]);

  const resolvedToken = token ?? storedToken;

  return {
    token: resolvedToken,
    isAuthenticated: Boolean(resolvedToken),
    isCheckingAuth,
  };
}

export function useIsAuthenticated() {
  return useAuthGuardState().isAuthenticated;
}

export function isProtectedWorkerTabRoute(routeName?: string) {
  return Boolean(routeName && protectedWorkerTabRoutes.has(routeName));
}
