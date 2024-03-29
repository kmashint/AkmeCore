package akme.core.web;


import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class NoContentServlet extends HttpServlet {

	private static final long serialVersionUID = 1L;

	public void doGet(HttpServletRequest request, HttpServletResponse response)
    		throws ServletException, IOException {
		response.sendError(HttpServletResponse.SC_NO_CONTENT);
	}

    public void doPost(HttpServletRequest request, HttpServletResponse response)
    		throws ServletException, IOException {
    	response.sendError(HttpServletResponse.SC_NO_CONTENT);
    }

}
