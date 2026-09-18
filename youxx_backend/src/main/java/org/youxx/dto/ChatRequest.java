package org.youxx.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

/** AI 对话请求 */
@Data
@Schema(description = "AI 购物助手对话请求")
public class ChatRequest {

    @Schema(description = "用户发送的文本", example = "帮我加两瓶农夫山泉到购物车",
            requiredMode = Schema.RequiredMode.REQUIRED)
    private String message;

    @Schema(description = "会话 ID，由前端生成并在同一轮对话中保持不变；不传则后端随机生成"
            + "（注意：不传会导致多轮上下文丢失）", example = "7f3a9c2e-1b4d-4e6f-9a8b-0c1d2e3f4a5b")
    private String sessionId;
}
