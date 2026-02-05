package com.lms.payment.repository;

import com.lms.payment.model.PaymentPlan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentPlanRepository extends JpaRepository<PaymentPlan, Long> {
  List<PaymentPlan> findByActiveTrue();
  Optional<PaymentPlan> findByCode(String code);
}
