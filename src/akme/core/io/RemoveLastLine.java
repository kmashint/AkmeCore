package akme.core.io;

import java.io.*;


/**
 * Remove the last non-blank line from a file given a maximum line length to check,
 * writing the last line and any surrounding blank line on each side to a separate file.
 * e.g. If the file ends with "\r\n\r\n123 rows\r\n\r\n" then the separate file will contain "\r\n123 rows\r\n\r\n".
 *
 * <pre><code>java akme.core.io.RemoveLastLine "input.txt" 8192 "input-tail.txt"</code><pre>
 *
 * javac RemoveLastLine.java
 *
 */
public class RemoveLastLine {

	public static void main(final String[] args) {
		try { go(args[0], Integer.valueOf(args[1]).intValue(), args.length > 2 ? args[2] : null); }
		catch (IOException ex) { ex.printStackTrace(); }
	}

	public static final void closeQuiet(final Closeable stream) {
		try { if (stream != null) stream.close(); }
		catch (IOException ex) { ex.printStackTrace(); }
	}

	public static void go(final String inputName, final int maxLength, final String outputName) throws IOException {
		RandomAccessFile raf = null;
		BufferedOutputStream ous = null;
		try {
			raf = new RandomAccessFile(inputName, "rw");
			if (outputName != null) ous = new BufferedOutputStream(new FileOutputStream(outputName));
			final long fileLength = raf.length();
			final byte[] buf = new byte[(int)(fileLength < (long)maxLength ? fileLength : (long)maxLength)];
			final int newlineLength;
			if (fileLength > 2) {
				raf.read();
				raf.seek(fileLength - buf.length);
				raf.readFully(buf);
				if (buf[buf.length-1] == '\n') newlineLength = (buf[buf.length-2] == '\r') ? 2 : 1;
				else newlineLength = 0;
			} else {
				newlineLength = 0;
			}
			int lines = 0;
			byte p = '\n';
			if (newlineLength != 0) for (int i = buf.length - 1 - newlineLength; i >= 0; i--) {
				byte c = buf[i];
				if (c != '\n') {
					if (p == '\n') lines++;
				}
				else {
					if (i>0 && buf[i-1] == '\r') i--;
				}
				if (lines > 1 || i == 0) {
					if (lines > 1) i += newlineLength+1;
					raf.setLength(fileLength - ((long)buf.length - i));
					if (ous != null) ous.write(buf, i, buf.length - i);
					break;
				}
				p = c;
			}
		}
		finally {
			closeQuiet(raf);
			closeQuiet(ous);
		}
	}

}
