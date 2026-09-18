package org.youxx.vo;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import org.youxx.common.llm.ComboItem;

import java.util.List;

/** Agent 对话结果 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "AI 助手对话结果")
public class AgentChatResultVO {

    @Schema(description = "结果类型，固定为 text", example = "text")
    private String type;

    @Schema(description = "模型最终回复文本", example = "已为你加入 2 瓶农夫山泉，可以在购物车中查看。")
    private String content;

    @Schema(description = "加购清单（仅当 Agent 调用了 addToCart 时非空），"
            + "前端据此写入购物车，不要自行解析 content 文本")
    private List<ComboItem> cartItems;
}
