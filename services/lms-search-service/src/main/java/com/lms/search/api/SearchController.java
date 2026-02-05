package com.lms.search.api;

import com.lms.search.domain.CourseIndex;
import com.lms.search.infrastructure.CourseSearchRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/search")
@RequiredArgsConstructor
public class SearchController {

    private final CourseSearchRepository courseSearchRepository;

    @GetMapping("/courses")
    public List<CourseIndex> searchCourses(@RequestParam String q) {
        return courseSearchRepository.findByTitleContainingOrDescriptionContaining(q, q);
    }
}
