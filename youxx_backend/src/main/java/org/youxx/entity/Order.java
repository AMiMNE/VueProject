package org.youxx.entity;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "订单实体")
public class Order {

    @Schema(description = "订单号", example = "ORD20260918001")
    private String id;

    @Schema(description = "下单用户 ID，由后端从 token 解析填充", example = "U001")
    private String userId;

    @Schema(description = "下单用户名，由后端填充", example = "zhangsan")
    private String username;

    @Schema(description = "订单总金额（元），由后端按商品快照计算", example = "40.00")
    private BigDecimal totalAmount;

    @Schema(description = "商品总件数", example = "4")
    private Integer itemCount;

    @Schema(description = "状态: PENDING 待发货 / SHIPPED 已发货 / COMPLETED 已完成 / CANCELLED 已取消",
            example = "PENDING")
    private String status;

    @Schema(description = "累计催单次数", example = "1")
    private Integer urgentCount;

    @Schema(description = "最后一次催单时间", example = "2026-09-18 10:00:00")
    private LocalDateTime lastUrgentTime;

    @Schema(description = "创建时间", example = "2026-09-18 10:00:00")
    private LocalDateTime createTime;

    @Schema(description = "更新时间", example = "2026-09-18 10:00:00")
    private LocalDateTime updateTime;

    @Schema(description = "订单明细列表")
    private List<OrderItem> items;
}
