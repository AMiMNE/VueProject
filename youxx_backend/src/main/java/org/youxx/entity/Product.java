package org.youxx.entity;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "商品实体")
public class Product {

    @Schema(description = "商品 ID，新增时不传，由后端生成", example = "P001")
    private String id;

    @Schema(description = "商品名称", example = "农夫山泉")
    private String name;

    @Schema(description = "所属分类 ID，取值来自 /api/product/category/list", example = "drinks")
    private String categoryId;

    @Schema(description = "单价（元）", example = "2.00")
    private BigDecimal price;

    @Schema(description = "计量单位", example = "瓶")
    private String unit;

    @Schema(description = "库存数量", example = "500")
    private Integer stock;

    @Schema(description = "商品图片路径，由 /api/product/upload 返回",
            example = "/upload_resources/products/drinks/water.png")
    private String imageUrl;

    @Schema(description = "商品描述", example = "550ml 饮用天然水")
    private String description;

    @Schema(description = "商品条码", example = "6920552655001")
    private String barCode;

    @Schema(description = "折扣系数，取值 0~1，1.00 表示无折扣", example = "1.00")
    private BigDecimal discount;

    @Schema(description = "是否热销（对应数据库 0/1）", example = "true")
    private Boolean isHot;

    @Schema(description = "标签，逗号分隔", example = "热销,解渴")
    private String tags;

    @Schema(description = "状态: ONSHELF 上架 / OFFSHELF 下架", example = "ONSHELF")
    private String status;

    @Schema(description = "创建时间，由数据库自动填充", example = "2026-09-18 10:00:00")
    private LocalDateTime createTime;

    @Schema(description = "更新时间，由数据库自动填充", example = "2026-09-18 10:00:00")
    private LocalDateTime updateTime;
}
