package org.youxx.entity;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "商品分类")
public class ProductCategory {

    @Schema(description = "分类 ID", example = "drinks")
    private String id;

    @Schema(description = "分类名称", example = "饮料")
    private String name;

    @Schema(description = "分类图标标识，前端据此映射本地图标组件", example = "Coffee")
    private String icon;

    @Schema(description = "排序号，越小越靠前", example = "1")
    private Integer sortOrder;
}
