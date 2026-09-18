package org.youxx.entity;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "聊天消息")
public class Message {

    @Schema(description = "消息 ID", example = "1")
    private String id;

    @Schema(description = "会话 ID", example = "conv_zhangsan")
    private String conversationId;

    @Schema(description = "发送方: USER / ADMIN", example = "USER")
    private String sender;

    @Schema(description = "发送方显示名", example = "zhangsan")
    private String senderName;

    @Schema(description = "消息内容", example = "请问我的订单什么时候发货？")
    private String content;

    @Schema(description = "是否已读（对应数据库 0/1）", example = "0")
    private Integer isRead;

    @Schema(description = "发送时间", example = "2026-09-18 10:00:00")
    private LocalDateTime createTime;
}
