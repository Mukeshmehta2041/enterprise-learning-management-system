package com.lms.search.infrastructure;

import com.lms.search.domain.CourseIndex;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;
import java.util.List;

public interface CourseSearchRepository extends ElasticsearchRepository<CourseIndex, String> {
    List<CourseIndex> findByTitleContainingOrDescriptionContaining(String title, String description);
}
