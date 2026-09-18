package org.youxx.vo;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.time.LocalDateTime;

/** 会话列表项视图 */
@Data
@Schema(description = "会话列表项")
public class ConversationVO {

    @Schema(description = "会话 ID", example = "conv_zhangsan")
    private String id;

    @Schema(description = "对方身份: USER / ADMIN", example = "USER")
    private String from;

    @Schema(description = "对方显示名", example = "zhangsan")
    private String fromName;

    @Schema(description = "最后一条消息内容", example = "请问我的订单什么时候发货？")
    private String lastMessage;

    @Schema(description = "最后一条消息时间", example = "2026-09-18 10:00:00")
    private LocalDateTime lastTime;

    @Schema(description = "未读消息数", example = "3")
    private Integer unreadCount;
}
