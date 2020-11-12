package com.ersa.tracker.controllers;

import com.ersa.tracker.dto.Week;
import com.ersa.tracker.models.User;
import com.ersa.tracker.repositories.UserRepository;
import com.ersa.tracker.services.WorkoutsService;
import com.ersa.tracker.utils.KVPair;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;
import java.util.List;

@RestController
public class WorkoutController {

    @Autowired
    private WorkoutsService workoutsService;

    @Autowired //Comment to self: Bypassing service layer, change maybe.
    private UserRepository userRepository;

    @GetMapping("api/workoutsPerWeek")
    public Iterable<Week> getWorkoutsPerWeek(Principal principal) {
        User currentUser = userRepository.findByEmail(principal.getName());
        return workoutsService.getWorkoutsPerWeek(currentUser);
    }

    @GetMapping("api/setsPerBodypart")
    public List<KVPair<String, Float>> getSetsPerBodypart(Principal principal) {
        User currentUser = userRepository.findByEmail(principal.getName());
        return workoutsService.getSetPerBodypart(currentUser);
    }

}
