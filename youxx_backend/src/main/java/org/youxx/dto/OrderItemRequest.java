package org.youxx.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

/** 订单明细请求（下单时仅需商品id与数量，其余快照由后端填充） */
@Data
@Schema(description = "订单明细项")
public class OrderItemRequest {

    @Schema(description = "商品 ID", example = "P001", requiredMode = Schema.RequiredMode.REQUIRED)
    private String productId;

    @Schema(description = "购买数量", example = "2", requiredMode = Schema.RequiredMode.REQUIRED)
    private Integer quantity;
}
