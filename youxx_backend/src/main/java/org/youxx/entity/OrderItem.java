package org.youxx.entity;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "订单明细项（下单时由后端按商品最新信息生成快照）")
public class OrderItem {

    @Schema(description = "明细主键", example = "1")
    private Long id;

    @Schema(description = "所属订单号", example = "ORD20260918001")
    private String orderId;

    @Schema(description = "商品 ID", example = "P001")
    private String productId;

    @Schema(description = "下单时的商品名称快照", example = "农夫山泉")
    private String productName;

    @Schema(description = "下单时的单价快照（元）", example = "2.00")
    private BigDecimal price;

    @Schema(description = "下单时的折扣快照", example = "1.00")
    private BigDecimal discount;

    @Schema(description = "购买数量", example = "2")
    private Integer quantity;

    @Schema(description = "下单时的单位快照", example = "瓶")
    private String unit;

    @Schema(description = "小计金额（元）= 单价 × 折扣 × 数量", example = "4.00")
    private BigDecimal subtotal;
}
