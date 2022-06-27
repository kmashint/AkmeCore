package akme.core.util;

import java.util.Arrays;
import java.util.List;

public class CollectionUtil {

	/**
	 * Join the lists efficiently and return the sorted result.
	 */
	@SafeVarargs
	public static final <E> List<E> joinAndSort(List<E>... lists) {
		int size = 0;
		for (int i = 0; i < lists.length; i++) {
			size += lists[i].size();
		}
		if (size == 0) {
			// Nothing to do but return.
			return Arrays.asList();
		}
		@SuppressWarnings("unchecked")
		final E[] result = (E[]) new Object[size];
		if (lists.length == 1) {
			// No special handling in the simple case.
			lists[0].toArray(result);
		} else {
			// Copy the lists efficiently in reverse order to shuffle them to the right place.
			for (int i = lists.length - 1; i >= 0; i--) {
				final List<E> list = lists[i];
				// toArray() writes null after the last copied position if it's not the end of the array.
				// So remember the value that might be nulled and replace it.
				final E val = size < result.length ? result[size] : null;
				// We can only copy data to the array start so then shuffle the list to its proper place.
				list.toArray(result);
				final int listSize = list.size();
				size -= listSize;
				if (size > 0) System.arraycopy(result, 0, result, size, listSize);
				if (val != null) result[size + listSize] = val;
			}
		}
		Arrays.sort(result);
		return Arrays.asList(result);
	}

}
