import React from "react";

export function useFetch(url, options) {
  const [response, setResponse] = React.useState(null);
  const [error, setError] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(false);
  React.useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(url, {
          headers: {
            "Content-Type": "application/json",

            ...options,
          },
        });
        const json = await res.json();
        setResponse(json);
        setIsLoading(false);
        setError(null);
      } catch (error) {
        setIsLoading(false);
        setError(error);
      }
    };
    fetchData();
  }, []);
  return { response, error, isLoading };
}

export function useMutate(
  url,
  options = {
    method: "POST",
  }
) {
  const [response, setResponse] = React.useState(null);
  const [error, setError] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isSuccess, setIsSucccess] = React.useState(null);

  const mutate = async (body, dynamicUrl) => {
    setError(null);
    setIsLoading(true);
    setIsSucccess(null);
    try {
      const res = await fetch(dynamicUrl || url, {
        body: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
        },
        ...options,
      });

      const json = await res.json();
      if (res.status >= 400) {
        setIsLoading(false);
        setIsSucccess(false);
        setResponse(null);
        return setError(json);
      }
      setResponse(json);
      setIsLoading(false);
      setError(null);
      setIsSucccess(true);
      return json;
    } catch (error) {
      setIsLoading(false);
      setIsSucccess(false);
      setError(error.message || error);
    }
  };

  return { response, error, isLoading, isSuccess, mutate };
}
