package com.lms.content.repository;

import com.lms.content.domain.ContentRendition;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface ContentRenditionRepository extends JpaRepository<ContentRendition, UUID> {
}
