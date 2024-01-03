package com.ersa.tracker.controllers;

import com.ersa.tracker.models.authentication.User;
import com.ersa.tracker.services.authentication.AccountService;
import com.ersa.tracker.services.general.goal.GoalService;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import java.security.Principal;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@RestController
@RequiredArgsConstructor
public class GoalController {

    private final GoalService goalService;
    private final AccountService accountService;

    @PostMapping("/goal/create")
    public void createGoal(@RequestBody final CreateGoal goal, final Principal principal) {
        User user = accountService.getUserByPrincipal(principal);
        if (user.getUserProfile() == null)
            return;

        if (goal.start == null || goal.end == null || goal.end.before(goal.start))
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Bad interval");

        if (goal.target <= 0 || goal.target > 9999)
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Bad target value");

        if (goal.name != null && goal.name.length() > 45)
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Name too long");


        goalService.createGoal(goal, user.getUserProfile());
    }

    @GetMapping("/goal/progress")
    public List<GoalProgress> getProgress(final Principal principal) {
        User user = accountService.getUserByPrincipal(principal);
        if (user.getUserProfile() != null)
            return goalService.getProgress(user.getUserProfile());
        return new ArrayList<>();
    }

    @Getter
    @Setter
    public static class CreateGoal {
        private String name;
        private Date start;
        private Date end;
        private float target;
    }

    @Getter
    @Setter
    public static class GoalProgress {
        private String name;
        private String startDate;
        private String endDate;
        private float targetValue;
        private float currentValue;
        private float weeklyTarget;
    }
}
