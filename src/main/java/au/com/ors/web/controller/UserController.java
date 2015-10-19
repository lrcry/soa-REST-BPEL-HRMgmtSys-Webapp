package au.com.ors.web.controller;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.springframework.context.annotation.Scope;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.client.RestTemplate;

import au.com.ors.web.bean.LoginBean;
import au.com.ors.web.bean.LoginResult;
import au.com.ors.web.bean.ResponseWrapper;



@Controller
@Scope("session")
public class UserController {
	@RequestMapping(value = "/login",method =  RequestMethod.POST)
	@ResponseBody
	public ResponseEntity<LoginResult> login(
			@RequestBody LoginBean loginBean,
			HttpServletRequest request) {
		String username = loginBean.getUsername();
		String password = loginBean.getPassword();
		RestTemplate restTemplate = new RestTemplate();
		LoginResult result = new LoginResult();
		ResponseEntity<ResponseWrapper> response = restTemplate.getForEntity("http://localhost:8080/HRMgmtSysREST/users/" + username, ResponseWrapper.class);
		
		HttpSession session = request.getSession();
		String str = (String) session.getAttribute("_uid");
		if (StringUtils.isEmpty(str)) {
			str = new String();
		}
		String sessionId = session.getId();
		System.out.println(session.getAttribute("_uid"));
		if (HttpStatus.OK == response.getStatusCode()) {
			// userId exists
			if (response.getBody().getUserWrapper().get_pwd().equals(password)) {
				//login succeed
				System.out.println(response);
				result.setSuccess(true);
				result.setErrCode("");
				result.setErrMessage("");
				result.setSessionId(sessionId);
				session.setAttribute("_uid", username);
				return new ResponseEntity<LoginResult>(result, HttpStatus.OK);
			}
			else {
				// wrong password
				result.setSuccess(false);
				result.setErrCode("ID_PW_MISMATCH");
				result.setErrMessage("id is found, but the password not matched");
				result.setSessionId("");
				return new ResponseEntity<LoginResult>(result, HttpStatus.NOT_ACCEPTABLE);
			}
		} else {
			// fail
			result.setSuccess(false);
			result.setErrCode("ID_NOT_FOUND");
			result.setErrMessage("Id is not found.");
			result.setSessionId("");
			return new ResponseEntity<LoginResult>(result, HttpStatus.NOT_FOUND);
		}
	}
	

}
