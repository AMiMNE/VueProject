package org.youxx.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

/** 发送消息请求 */
@Data
@Schema(description = "发送消息请求：发送者身份取自 token，无需前端传递")
public class SendMessageRequest {

    @Schema(description = "会话 ID，不传时后端按 conversationId = conv_{用户名} 兜底生成",
            example = "conv_zhangsan")
    private String conversationId;

    @Schema(description = "消息内容", example = "请问我的订单什么时候发货？",
            requiredMode = Schema.RequiredMode.REQUIRED)
    private String content;
}
