package com.nla.compensation.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentConfirmationRequest {

    @NotNull(message = "Paid amount is required")
    @DecimalMin(value = "0.01", message = "Paid amount must be positive")
    private BigDecimal paidAmount;

    @NotNull(message = "Payment date is required")
    private LocalDate paymentDate;

    @NotBlank(message = "Transaction reference / UTR number is required")
    private String transactionReference;

    @NotBlank(message = "Payment mode is required (e.g. RTGS, NEFT, TREASURY)")
    private String paymentMode;

    private String remarks;
}
