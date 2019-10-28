package akme.core.lang;

import java.text.FieldPosition;
import java.text.Format;
import java.text.ParsePosition;

/**
 * Thread-safe wrapper for Format classes that are not normally thread-safe.
 * Internally this may use different methods (e.g. synchronized, ThreadLocal, pool, or clone) to provide thread-safety.
 * e.g. <pre><code>
 * public static final Format DATE_ISO_DELIM_SECS = new ThreadSafeFormat(new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss"));
 * </code></pre>
 *
 * @author Copyright(c) 2006 AKME Solutions
 * @author $Author: keith.mashinter $
 * @version $Date: 2007/04/16 15:53:38 $ $NoKeywords: $
 */
public class ThreadSafeFormat extends Format {

	private static final long serialVersionUID = 2L;

	private final Format unsafeFormat;

	/**
	 * Construct the wrapper around the given thread-unsafe format.
	 */
	public ThreadSafeFormat(Format unsafeFormat) {
		this.unsafeFormat = unsafeFormat;
	}

	/**
	 * Return a Format from the internal pool or clone a new Format.
	 */
	private Format getFormatClone() {
		return (unsafeFormat != null) ? (Format) unsafeFormat.clone() : null;
	}

	/**
	 * Parse in a thread-safe way.
	 * @see java.text.Format#parseObject(java.lang.String, java.text.ParsePosition)
	 */
	public Object parseObject(String source, ParsePosition pos) {
		final Format fmt = getFormatClone();
		return fmt.parseObject(source,pos);
	}

	/**
	 * Format in a thread-safe way.
	 * @see java.text.Format#format(java.lang.Object, java.lang.StringBuffer, java.text.FieldPosition)
	 */
	public StringBuffer format(Object obj, StringBuffer toAppendTo, FieldPosition pos) {
		final Format fmt = getFormatClone();
		return fmt.format(obj,toAppendTo,pos);
	}

}
