import { ApiError } from "./utils/apiError";

export const execute = async <T>(
  fn: () => Promise<T>,
  {
    setLoading,
    setError,
    onSuccess,
  }: {
    setLoading: (loading: boolean) => void;
    setError?: (msg: string) => void;
    onSuccess?: (data: T) => void;
  },
): Promise<T | undefined> => {
  try {
    setLoading(true);
    setError?.("");

    const result = await fn();

    onSuccess?.(result);

    return result;
  } catch (error) {
    if (error instanceof ApiError) setError?.(error.message);
  } finally {
    setLoading(false);
  }
};
