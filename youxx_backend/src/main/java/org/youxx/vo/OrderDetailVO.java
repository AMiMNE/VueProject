package org.youxx.vo;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import org.youxx.entity.Order;
import org.youxx.entity.OrderItem;

import java.util.List;

/** 订单详情视图：订单主体 + 明细列表 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "订单详情：订单主体 + 明细列表")
public class OrderDetailVO {

    @Schema(description = "订单主体")
    private Order order;

    @Schema(description = "订单明细列表")
    private List<OrderItem> items;
}
