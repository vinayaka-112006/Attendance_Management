import { useEffect, useState } from "react";
import { api } from "../api/client";

export const useFetch = (url, initial = []) => {
  const [data, setData] = useState(initial);
  const [loading, setLoading] = useState(true);
  const load = async () => {
    if (!url) {
      setData(initial);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const res = await api.get(url);
      setData(res.data);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { load(); }, [url]);
  return { data, setData, loading, reload: load };
};
