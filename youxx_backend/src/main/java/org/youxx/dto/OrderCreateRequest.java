package org.youxx.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.util.List;

/** 订单创建请求 */
@Data
@Schema(description = "订单创建请求：金额与商品快照均由后端计算，前端只需传商品与数量")
public class OrderCreateRequest {

    @Schema(description = "订单号，可不传，由后端生成", example = "ORD20260918001")
    private String id;

    @Schema(description = "下单商品列表", requiredMode = Schema.RequiredMode.REQUIRED)
    private List<OrderItemRequest> items;
}
