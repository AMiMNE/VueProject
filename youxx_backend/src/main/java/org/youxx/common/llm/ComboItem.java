package org.youxx.common.llm;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Agent 下单工具所需的最小商品条目：商品ID + 数量。
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "AI 助手加购条目")
public class ComboItem {

    /** 商品ID，如 P001 */
    @Schema(description = "商品 ID", example = "P001")
    private String productId;

    /** 购买数量 */
    @Schema(description = "购买数量", example = "2")
    private Integer quantity;
}
