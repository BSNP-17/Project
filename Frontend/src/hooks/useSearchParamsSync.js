import { useSearchParams } from "react-router-dom";
import { useMemo } from "react";

const useSearchParamsSync = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // 1. Get current params as a clean object
  const params = useMemo(() => {
    const currentParams = {};
    for (const [key, value] of searchParams.entries()) {
      currentParams[key] = value;
    }
    return currentParams;
  }, [searchParams]);

  // 2. Function to update params (e.g., when filtering)
  const updateParams = (newParams) => {
    const updated = { ...params, ...newParams };
    
    // Remove empty keys to keep URL clean
    Object.keys(updated).forEach(key => {
      if (!updated[key]) delete updated[key];
    });

    setSearchParams(updated);
  };

  return { params, updateParams };
};

export default useSearchParamsSync;