package com.lms.user.domain;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;
import java.util.UUID;

public interface UserRepository extends JpaRepository<User, UUID> {

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    Page<User> findAllByStatus(UserStatus status, Pageable pageable);

    @Query("SELECT u FROM User u WHERE u.id IN (SELECT ur.user.id FROM UserRole ur WHERE ur.role.name = :roleName)")
    Page<User> findAllByRoleName(@Param("roleName") String roleName, Pageable pageable);

    @Query("SELECT u FROM User u WHERE u.status = :status AND u.id IN (SELECT ur.user.id FROM UserRole ur WHERE ur.role.name = :roleName)")
    Page<User> findAllByStatusAndRoleName(@Param("status") UserStatus status, @Param("roleName") String roleName, Pageable pageable);

    Page<User> findAll(Pageable pageable);
}
