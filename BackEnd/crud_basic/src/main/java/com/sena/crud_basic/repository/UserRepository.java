package com.sena.crud_basic.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.sena.crud_basic.model.UserDTO;

@Repository
public interface UserRepository extends JpaRepository<UserDTO, Long> {
    Optional<UserDTO> findByUsername(String username);
    
    Optional<UserDTO> findByEmail(String email);

    Boolean existsByUsername(String username);

    Boolean existsByEmail(String email);
    
    @Query("UPDATE UserDTO u SET u.failedAttempt = ?1 WHERE u.username = ?2")
    @Modifying
    @Transactional
    void updateFailedAttempts(int failedAttempts, String username);
    
    @Query("UPDATE UserDTO u SET u.accountNonLocked = ?1 WHERE u.username = ?2")
    @Modifying
    @Transactional
    void updateAccountLockStatus(boolean locked, String username);
}