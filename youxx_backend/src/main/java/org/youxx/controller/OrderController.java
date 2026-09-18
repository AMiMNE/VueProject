package org.youxx.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;
import org.youxx.common.result.PageResult;
import org.youxx.common.result.Result;
import org.youxx.common.userInfoMaintainer.BaseContext;
import org.youxx.dto.OrderCreateRequest;
import org.youxx.dto.OrderItemRequest;
import org.youxx.dto.UpdateStatusRequest;
import org.youxx.entity.Order;
import org.youxx.entity.OrderItem;
import org.youxx.service.OrderService;
import org.youxx.vo.OrderDetailVO;

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/order")
@RequiredArgsConstructor
@Tag(name = "订单", description = "下单、订单查询与状态流转")
public class OrderController {

    private final OrderService orderService;

    @Operation(summary = "【管理员】分页查询订单列表", description = "支持关键字、状态与下单时间区间过滤")
    @GetMapping("/list")
    public Result<PageResult<Order>> list(
            @Parameter(description = "关键字，匹配订单号或用户名", example = "ORD2026") @RequestParam(required = false) String keyword,
            @Parameter(description = "状态过滤: PENDING / SHIPPED / COMPLETED / CANCELLED", example = "PENDING")
            @RequestParam(required = false) String status,
            @Parameter(description = "下单时间起（含），格式 yyyy-MM-dd HH:mm:ss", example = "2026-09-01 00:00:00")
            @RequestParam(required = false) @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss") LocalDateTime beginTime,
            @Parameter(description = "下单时间止（含），格式 yyyy-MM-dd HH:mm:ss", example = "2026-09-30 23:59:59")
            @RequestParam(required = false) @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss") LocalDateTime endTime,
            @Parameter(description = "页码，从 1 开始", example = "1") @RequestParam(defaultValue = "1") int page,
            @Parameter(description = "每页条数", example = "10") @RequestParam(defaultValue = "10") int size) {
        PageResult<Order> result = orderService.listOrders(keyword, status, beginTime, endTime, page, size);
        return Result.success(result);
    }

    @Operation(summary = "查询我的订单", description = "用户 ID 取自 token，前端只需按状态过滤")
    @GetMapping("/my")
    public Result<List<Order>> myOrders(
            @Parameter(description = "状态过滤: PENDING / SHIPPED / COMPLETED / CANCELLED，不传返回全部")
            @RequestParam(required = false) String status) {
        String userId = BaseContext.getCurrentId();
        List<Order> orders = orderService.listMyOrders(userId, status);
        return Result.success(orders);
    }

    @Operation(summary = "查询订单详情", description = "返回订单主体与明细列表")
    @GetMapping("/{id}")
    public Result<OrderDetailVO> detail(
            @Parameter(description = "订单号", example = "ORD20260918001", required = true) @PathVariable String id) {
        Order order = orderService.getOrder(id);
        List<OrderItem> items = orderService.getOrderItems(id);
        return Result.success(new OrderDetailVO(order, items));
    }

    //TODO：具体实现逻辑迁移到impl
    @Operation(summary = "创建订单",
            description = "前端只需传商品 ID 与数量；订单号、用户名、总金额与商品快照均由后端生成，"
                    + "下单成功后会返回完整订单对象")
    @PostMapping
    public Result<Order> create(@RequestBody OrderCreateRequest request) {
        Order order = new Order();
        order.setId(request.getId());
        order.setUserId(BaseContext.getCurrentId());
        order.setUsername(BaseContext.getCurrentUsername());

        List<OrderItem> items = request.getItems().stream().map(itemReq -> {
            OrderItem item = new OrderItem();
            item.setProductId(itemReq.getProductId());
            item.setQuantity(itemReq.getQuantity());
            return item;
        }).toList();

        Order created = orderService.createOrder(order, items);
        return Result.success(created);
    }

    @Operation(summary = "修改订单状态", description = "管理员发货/完成订单，或用户取消订单时调用")
    @PutMapping("/{id}/status")
    public Result<Void> updateStatus(
            @Parameter(description = "订单号", example = "ORD20260918001", required = true) @PathVariable String id,
            @RequestBody UpdateStatusRequest request) {
        orderService.updateStatus(id, request.getStatus());
        return Result.success();
    }

    @Operation(summary = "催单", description = "用户对未发货订单发起催单，累计 urgentCount 并记录最后催单时间")
    @PostMapping("/{id}/urgent")
    public Result<Void> urge(
            @Parameter(description = "订单号", example = "ORD20260918001", required = true) @PathVariable String id) {
        orderService.urgeOrder(id);
        return Result.success();
    }

    @Operation(summary = "删除订单")
    @DeleteMapping("/{id}")
    public Result<Void> delete(
            @Parameter(description = "订单号", example = "ORD20260918001", required = true) @PathVariable String id) {
        orderService.deleteOrder(id);
        return Result.success();
    }
}
