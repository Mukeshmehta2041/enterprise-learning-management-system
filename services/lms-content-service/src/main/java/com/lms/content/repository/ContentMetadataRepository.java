package com.lms.content.repository;

import com.lms.content.domain.ContentMetadata;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface ContentMetadataRepository extends JpaRepository<ContentMetadata, UUID> {
}
