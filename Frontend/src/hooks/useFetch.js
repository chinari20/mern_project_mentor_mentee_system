import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export const useFetch = (fetcher, deps = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        setLoading(true);
        const response = await fetcher();
        if (mounted) setData(response.data.data);
      } catch (error) {
        toast.error(error.message || "Failed to load data");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();

    return () => {
      mounted = false;
    };
  }, deps);

  return { data, loading, setData };
};
