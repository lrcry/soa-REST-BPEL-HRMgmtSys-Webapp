package au.com.ors.web.controller;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Controller;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import au.com.ors.web.bean.ReviewAssign;

@Controller
public class TeamReviewAssignController {
	private static List<ReviewAssign> assignList = new ArrayList<>();
	
	@RequestMapping(value = "/assign", method = RequestMethod.POST)
	@ResponseBody
	public ReviewAssign assignTeam(@RequestBody ReviewAssign assignment) {
		assignList.add(assignment);
		return assignment;
	}
	
	@RequestMapping(value = "/teamassign/{team}", method = RequestMethod.GET)
	@ResponseBody
	public List<ReviewAssign> getUserAssignment(@PathVariable(value = "team") String team) {
		List<ReviewAssign> userAssList = new ArrayList<>();
		
		for (ReviewAssign assign : assignList) {
			if (!StringUtils.isEmpty(assign.getTeam()) && assign.getTeam().equals(team)) {
				userAssList.add(assign);
			}
		}
		
		return userAssList;
	}
	
	@RequestMapping(value = "/appassign/{_appId}", method = RequestMethod.GET)
	@ResponseBody
	public List<ReviewAssign> getAppAssignment(@PathVariable(value = "_appId") String _appId) {
		List<ReviewAssign> appAssList = new ArrayList<>();
		
		for (ReviewAssign assign : assignList) {
			if (!StringUtils.isEmpty(assign.get_appId()) && assign.get_appId().equals(_appId)) {
				appAssList.add(assign);
			}
		}
		
		return appAssList;
	}
	
	@RequestMapping(value = "/closeassign/{_appId}", method = RequestMethod.POST)
	@ResponseBody
	public ReviewAssign closeAssignment(@PathVariable(value = "_appId") String _appId) {
		int index = -1;
		ReviewAssign closedAss = new ReviewAssign();
		for (ReviewAssign ass : assignList) {
			if (!StringUtils.isEmpty(ass.get_appId()) && ass.get_appId().equals(_appId)) {
				index = assignList.indexOf(ass);
				closedAss = ass;
				break;
			}
		}
		
		if (index < 0) {
			return null;
		}
		
		assignList.remove(index);
		return closedAss;
	}
	
	@RequestMapping(value = "/assigns", method = RequestMethod.GET)
	@ResponseBody
	public List<ReviewAssign> getAllAssignment() {
		return assignList;
	}
}
