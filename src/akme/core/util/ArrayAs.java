package akme.core.util;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

/**
 * Methods to help create Lists and Maps similar to Arrays.asList() but also for Map.
 * This returns modifiable Lists and Maps unlink Java 9+ unmodifiable List.of() and Map.of().
 * @author kmashint
 */
public class ArrayAs {

	/**
	 * Wrapper around Arrays.asList() just to pair with asMap() here.
	 * 
	 * @param ary the Array to copy as a List
	 * @return a modifiable List copied from the given Array
	 */
	@SafeVarargs
	public static <E> List<E> list(E... ary) {
		return Arrays.asList(ary);
	}

	/**
	 * Similar to Arrays.asList() but for alternating key-value pairs to a modifiable Map.
	 * 
	 * @param ary the key-value pairs(key1, val1, key2, val2, ...)
	 * @return a modifiable Map based on the given key-value pairs
	 */
	public static <K, V> Map<K, V> map() {
		return new HashMap<>();
	}

	/**
	 * Similar to Arrays.asList() but for alternating key-value pairs to a modifiable Map.
	 * 
	 * @param ary the key-value pairs(key1, val1, key2, val2, ...)
	 * @return a modifiable Map based on the given key-value pairs
	 */
	public static <K, V> Map<K, V> map(K k1, V v1) {
		return fill(k1, v1);
	}

	/**
	 * Similar to Arrays.asList() but for alternating key-value pairs to a modifiable Map.
	 * 
	 * @param ary the key-value pairs(key1, val1, key2, val2, ...)
	 * @return a modifiable Map based on the given key-value pairs
	 */
	public static <K, V> Map<K, V> map(K k1, V v1, K k2, V v2) {
		return fill(k1, v1, k2, v2);
	}

	/**
	 * Similar to Arrays.asList() but for alternating key-value pairs to a modifiable Map.
	 * 
	 * @param ary the key-value pairs(key1, val1, key2, val2, ...)
	 * @return a modifiable Map based on the given key-value pairs
	 */
	public static <K, V> Map<K, V> map(K k1, V v1, K k2, V v2, K k3, V v3) {
		return fill(k1, v1, k2, v2, k3, v3);
	}

	/**
	 * Similar to Arrays.asList() but for alternating key-value pairs to a modifiable Map.
	 * 
	 * @param ary the key-value pairs(key1, val1, key2, val2, ...)
	 * @return a modifiable Map based on the given key-value pairs
	 */
	public static <K, V> Map<K, V> map(K k1, V v1, K k2, V v2, K k3, V v3, K k4, V v4) {
		return fill(k1, v1, k2, v2, k3, v3, k4, v4);
	}

	/**
	 * Similar to Arrays.asList() but for alternating key-value pairs to a modifiable Map.
	 * 
	 * @param ary the key-value pairs(key1, val1, key2, val2, ...)
	 * @return a modifiable Map based on the given key-value pairs
	 */
	public static <K, V> Map<K, V> map(K k1, V v1, K k2, V v2, K k3, V v3, K k4, V v4, K k5, V v5) {
		return fill(k1, v1, k2, v2, k3, v3, k4, v4, k5, v5);
	}

	/**
	 * Similar to Arrays.asList() but for alternating key-value pairs to a modifiable Map.
	 * 
	 * @param ary the key-value pairs(key1, val1, key2, val2, ...)
	 * @return a modifiable Map based on the given key-value pairs
	 */
	public static <K, V> Map<K, V> map(K k1, V v1, K k2, V v2, K k3, V v3, K k4, V v4, K k5, V v5,
			K k6, V v6) {
		return fill(k1, v1, k2, v2, k3, v3, k4, v4, k5, v5,
				k6, v6);
	}

	/**
	 * Similar to Arrays.asList() but for alternating key-value pairs to a modifiable Map.
	 * 
	 * @param ary the key-value pairs(key1, val1, key2, val2, ...)
	 * @return a modifiable Map based on the given key-value pairs
	 */
	public static <K, V> Map<K, V> map(K k1, V v1, K k2, V v2, K k3, V v3, K k4, V v4, K k5, V v5,
			K k6, V v6, K k7, V v7) {
		return fill(k1, v1, k2, v2, k3, v3, k4, v4, k5, v5,
				k6, v6, k7, v7);
	}

	/**
	 * Similar to Arrays.asList() but for alternating key-value pairs to a modifiable Map.
	 * 
	 * @param ary the key-value pairs(key1, val1, key2, val2, ...)
	 * @return a modifiable Map based on the given key-value pairs
	 */
	public static <K, V> Map<K, V> map(K k1, V v1, K k2, V v2, K k3, V v3, K k4, V v4, K k5, V v5,
			K k6, V v6, K k7, V v7, K k8, V v8) {
		return fill(k1, v1, k2, v2, k3, v3, k4, v4, k5, v5,
				k6, v6, k7, v7, k8, v8);
	}

	/**
	 * Similar to Arrays.asList() but for alternating key-value pairs to a modifiable Map.
	 * 
	 * @param ary the key-value pairs(key1, val1, key2, val2, ...)
	 * @return a modifiable Map based on the given key-value pairs
	 */
	public static <K, V> Map<K, V> map(K k1, V v1, K k2, V v2, K k3, V v3, K k4, V v4, K k5, V v5,
			K k6, V v6, K k7, V v7, K k8, V v8, K k9, V v9) {
		return fill(k1, v1, k2, v2, k3, v3, k4, v4, k5, v5,
				k6, v6, k7, v7, k8, v8, k9, v9);
	}

	/**
	 * Similar to Arrays.asList() but for alternating key-value pairs to a modifiable Map.
	 * 
	 * @param ary the key-value pairs(key1, val1, key2, val2, ...)
	 * @return a modifiable Map based on the given key-value pairs
	 */
	public static <K, V> Map<K, V> map(K k1, V v1, K k2, V v2, K k3, V v3, K k4, V v4, K k5, V v5,
			K k6, V v6, K k7, V v7, K k8, V v8, K k9, V v9, K k10, V v10) {
		return fill(k1, v1, k2, v2, k3, v3, k4, v4, k5, v5,
				k6, v6, k7, v7, k8, v8, k9, v9, k10, v10);
	}

	@SuppressWarnings("unchecked")
	static <K, V> Map<K, V> fill(Object... ary) {
		if ((ary.length & 1) != 0) throw new InternalError("length is odd");
		final Map<K, V> result = new HashMap<>(ary.length / 2);
		for (int i = 0; i < ary.length; i += 2) {
			final K k = Objects.requireNonNull((K) ary[i]);
			if (result.containsKey(k)) throw new IllegalArgumentException("duplicate key: " + k);
			result.put(k, Objects.requireNonNull((V) ary[i + 1]));
		}
		return result;
	}

}