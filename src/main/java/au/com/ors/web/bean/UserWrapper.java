package au.com.ors.web.bean;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public class UserWrapper {
	String _uid;
	String _pwd;
	String shortKey;
	String lastName;
	String firstName;
	String role;
	String department;
	public String get_uid() {
		return _uid;
	}
	public void set_uid(String _uid) {
		this._uid = _uid;
	}
	public String get_pwd() {
		return _pwd;
	}
	public void set_pwd(String _pwd) {
		this._pwd = _pwd;
	}
	public String getShortKey() {
		return shortKey;
	}
	public void setShortKey(String shortKey) {
		this.shortKey = shortKey;
	}
	public String getLastName() {
		return lastName;
	}
	public void setLastName(String lastName) {
		this.lastName = lastName;
	}
	public String getFirstName() {
		return firstName;
	}
	public void setFirstName(String firstName) {
		this.firstName = firstName;
	}
	public String getRole() {
		return role;
	}
	public void setRole(String role) {
		this.role = role;
	}
	public String getDepartment() {
		return department;
	}
	public void setDepartment(String department) {
		this.department = department;
	}
	
}
