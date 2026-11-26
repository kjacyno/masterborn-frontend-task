// usePriceCalculation Hook
// Marcus: "This hook handles async price fetching. A bit janky but works."

import { useState, useEffect, useCallback, useRef } from 'react';
import type {
  Configuration,
  Product,
  PriceBreakdown,
  PriceResponse,
} from '../components/ProductConfigurator/types';
import { calculatePrice } from '../services/api';

interface UsePriceCalculationResult {
  price: PriceBreakdown | null;
  formattedTotal: string;
  isLoading: boolean;
  error: string | null;
  refetch?: () => void;
}

/**
 * Custom hook for managing price calculation
 */
export function usePriceCalculation(
  config: Configuration,
  product: Product,
): UsePriceCalculationResult {
  const [price, setPrice] = useState<PriceBreakdown | null>(null);
  const [formattedTotal, setFormattedTotal] = useState<string>('$0.00');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Track latest request timestamp to prevent stale responses from overwriting newer ones.
  // Guards against race conditions when the user changes options in rapid succession.
  const latestRequestRef = useRef<number>(0);
  if (!config) {
    setPrice(null);
    setFormattedTotal('$0.00');
    setIsLoading(false);
    setError(null);
  }
  const fetchPrice = useCallback(async () => {
    const requestId = ++latestRequestRef.current;

    setIsLoading(true);
    setError(null);

    try {
      const response: PriceResponse = await calculatePrice(config, product);

      if (requestId === latestRequestRef.current) {
        setPrice(response.breakdown);
        setFormattedTotal(response.formattedTotal);
      }
    } catch {
      if (requestId === latestRequestRef.current) {
        setError('ERR_PRICE_CALC_FAILED');
        setPrice(null);
      }
    } finally {
      if (requestId === latestRequestRef.current) {
        setIsLoading(false);
      }
    }
  }, [config, product]);

  // Fetch price when config or product changes; fetchPrice handles async results.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void fetchPrice();
  }, [fetchPrice]);
  return {
    price,
    formattedTotal,
    isLoading,
    error,
    refetch: fetchPrice,
  };
}

/**
 * Debounced version of price calculation

export function useDebouncedPriceCalculation(
  config: Configuration | null,
  product: Product,
  delay: number = 300,
): UsePriceCalculationResult {
  const [price, setPrice] = useState<PriceBreakdown | null>(null);
  const [formattedTotal, setFormattedTotal] = useState<string>('$0.00');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const configRef = useRef(config);

  useEffect(() => {
    // Clear any pending timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (!config) {
      return;
    }

    setIsLoading(true);

    timeoutRef.current = setTimeout(async () => {
      try {
        const response = await calculatePrice(configRef.current!, product);
        setPrice(response.breakdown);
        setFormattedTotal(response.formattedTotal);
        setError(null);
      } catch {
        setError('ERR_PRICE_CALC_FAILED');
      } finally {
        setIsLoading(false);
      }
    }, delay);

    configRef.current = config;

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [config, product, delay]);

  const refetch = useCallback(() => {
    if (config) {
      setIsLoading(true);
      calculatePrice(config, product)
        .then((response) => {
          setPrice(response.breakdown);
          setFormattedTotal(response.formattedTotal);
          setError(null);
        })
        .catch(() => {
          setError('ERR_PRICE_CALC_FAILED');
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [config, product]);

  return {
    price,
    formattedTotal,
    isLoading,
    error,
    refetch,
  };
}
 */
