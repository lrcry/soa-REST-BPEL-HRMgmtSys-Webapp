package au.com.ors.web.bean;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;


@JsonIgnoreProperties(ignoreUnknown = true)
public class ResponseWrapper {
	@JsonProperty("user")
	private UserWrapper userWrapper;

	public UserWrapper getUserWrapper() {
		return userWrapper;
	}

	public void setUserWrapper(UserWrapper userWrapper) {
		this.userWrapper = userWrapper;
	}
	
}
