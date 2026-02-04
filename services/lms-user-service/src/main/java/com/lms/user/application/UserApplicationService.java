package com.lms.user.application;

import com.lms.user.domain.Profile;
import com.lms.user.domain.ProfileRepository;
import com.lms.user.domain.Role;
import com.lms.user.domain.RoleRepository;
import com.lms.user.domain.User;
import com.lms.user.domain.UserRepository;
import com.lms.user.domain.UserRole;
import com.lms.user.domain.UserRoleId;
import com.lms.user.domain.UserRoleRepository;
import com.lms.user.domain.UserStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class UserApplicationService {

    private static final String DEFAULT_ROLE = "STUDENT";

    private final UserRepository userRepository;
    private final ProfileRepository profileRepository;
    private final RoleRepository roleRepository;
    private final UserRoleRepository userRoleRepository;
    private final PasswordEncoder passwordEncoder;

    public UserApplicationService(UserRepository userRepository,
                                  ProfileRepository profileRepository,
                                  RoleRepository roleRepository,
                                  UserRoleRepository userRoleRepository,
                                  PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.profileRepository = profileRepository;
        this.roleRepository = roleRepository;
        this.userRoleRepository = userRoleRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public User createUser(String email, String rawPassword, String displayName, String roleName) {
        if (userRepository.existsByEmail(email)) {
            throw new EmailAlreadyExistsException(email);
        }
        String roleToAssign = roleName != null && !roleName.isBlank() ? roleName : DEFAULT_ROLE;
        Role role = roleRepository.findByName(roleToAssign)
                .orElseThrow(() -> new RoleNotFoundException(roleToAssign));

        UUID id = UUID.randomUUID();
        String passwordHash = passwordEncoder.encode(rawPassword);
        User user = new User(id, email, passwordHash, UserStatus.ACTIVE);
        user = userRepository.save(user);

        Profile profile = new Profile(user, displayName, null);
        profileRepository.save(profile);

        userRoleRepository.save(new UserRole(user, role));
        return user;
    }

    @Transactional(readOnly = true)
    public User getById(UUID userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException(userId));
    }

    @Transactional(readOnly = true)
    public User getByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException(email));
    }

    @Transactional
    public User updateProfile(UUID userId, String currentUserId, Set<String> currentUserRoles,
                             String displayName, String avatarUrl) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException(userId));
        if (currentUserId == null || currentUserRoles == null
                || (!userId.toString().equals(currentUserId) && !currentUserRoles.contains("ADMIN"))) {
            throw new ForbiddenException("Can only update own profile");
        }
        Profile profile = profileRepository.findByUserId(userId)
                .orElseGet(() -> new Profile(user, displayName, avatarUrl));
        if (displayName != null) {
            profile.setDisplayName(displayName);
        }
        if (avatarUrl != null) {
            profile.setAvatarUrl(avatarUrl);
        }
        profileRepository.save(profile);
        return user;
    }

    @Transactional(readOnly = true)
    public Page<User> listUsers(Pageable pageable, UserStatus statusFilter, String roleFilter) {
        boolean hasRole = roleFilter != null && !roleFilter.isBlank();
        if (statusFilter != null && hasRole) {
            return userRepository.findAllByStatusAndRoleName(statusFilter, roleFilter, pageable);
        }
        if (statusFilter != null) {
            return userRepository.findAllByStatus(statusFilter, pageable);
        }
        if (hasRole) {
            return userRepository.findAllByRoleName(roleFilter, pageable);
        }
        return userRepository.findAll(pageable);
    }

    @Transactional
    public User deactivateUser(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException(userId));
        user.setStatus(UserStatus.DEACTIVATED);
        return userRepository.save(user);
    }

    @Transactional
    public void assignRole(UUID userId, String roleName) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException(userId));
        Role role = roleRepository.findByName(roleName)
                .orElseThrow(() -> new RoleNotFoundException(roleName));
        UserRoleId id = new UserRoleId(userId, role.getId());
        if (userRoleRepository.existsById(id)) {
            return;
        }
        userRoleRepository.save(new UserRole(user, role));
    }

    @Transactional(readOnly = true)
    public Set<String> getRoleNamesForUser(UUID userId) {
        return userRoleRepository.findAllByUserId(userId).stream()
                .map(ur -> ur.getRole().getName())
                .collect(Collectors.toSet());
    }
}
