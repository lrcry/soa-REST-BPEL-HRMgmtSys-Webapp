package au.com.ors.web.bean;

import java.io.Serializable;

import org.springframework.util.StringUtils;

public class ReviewAssign implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = -1475908418938752637L;

	private String _appId;
	
	private String team;

	public String get_appId() {
		return _appId;
	}

	public void set_appId(String _appId) {
		this._appId = _appId;
	}
	
	public String getTeam() {
		return team;
	}

	public void setTeam(String team) {
		this.team = team;
	}

	public String toString() {
		StringBuilder sb = new StringBuilder();
		if (!StringUtils.isEmpty(_appId)) {
			sb.append("_appId=").append(_appId).append(",");
		}
		
		if (!StringUtils.isEmpty(team)) {
			sb.append("_uId").append(team);
		}
		
		return sb.toString();
	}
}
