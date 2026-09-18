package org.youxx.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.math.BigDecimal;

/** 商品折扣更新请求 */
@Data
@Schema(description = "商品折扣更新请求")
public class UpdateDiscountRequest {

    @Schema(description = "折扣系数，取值 0~1，1.00 表示无折扣（如 0.9 即九折）",
            example = "0.90", requiredMode = Schema.RequiredMode.REQUIRED)
    private BigDecimal discount;
}
