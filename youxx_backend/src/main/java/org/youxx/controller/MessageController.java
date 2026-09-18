package org.youxx.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;
import org.youxx.common.result.Result;
import org.youxx.common.userInfoMaintainer.BaseContext;
import org.youxx.dto.SendMessageRequest;
import org.youxx.entity.Message;
import org.youxx.service.MessageService;
import org.youxx.vo.ConversationVO;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/message")
@RequiredArgsConstructor
@Tag(name = "消息", description = "用户与管理员之间的在线客服会话。返回内容会随当前 token 的角色变化："
        + "用户看到自己的会话，管理员看到全部用户会话")
public class MessageController {

    private final MessageService messageService;

    @Operation(summary = "查询会话列表", description = "返回会话 ID、对方名称、最后一条消息与未读数，用于渲染消息中心左侧列表")
    @GetMapping("/conversations")
    public Result<List<ConversationVO>> getConversations() {
        String role = BaseContext.getCurrentRole();
        List<ConversationVO> conversations = messageService.getConversations(role);
        return Result.success(conversations);
    }

    @Operation(summary = "查询某会话的消息记录")
    @GetMapping("/conversation/{conversationId}")
    public Result<List<Message>> getConversationMessages(
            @Parameter(description = "会话 ID", example = "conv_zhangsan", required = true)
            @PathVariable String conversationId) {
        List<Message> messages = messageService.getConversationMessages(conversationId);
        return Result.success(messages);
    }

    @Operation(summary = "查询未读消息总数", description = "用于消息中心红点角标")
    @GetMapping("/unread-count")
    public Result<Integer> getUnreadCount() {
        String role = BaseContext.getCurrentRole();
        int count = messageService.getUnreadCount(role);
        return Result.success(count);
    }

    @Operation(summary = "发送消息",
            description = "发送方身份由 token 决定；未传 conversationId 时按 conv_{用户名} 兜底生成，"
                    + "用户首次发起会话无需先创建会话")
    @PostMapping("/send")
    public Result<Message> sendMessage(@RequestBody SendMessageRequest request) {
        String conversationId = request.getConversationId();
        String content = request.getContent();

        String userId = BaseContext.getCurrentId();
        String username = BaseContext.getCurrentUsername();
        String role = BaseContext.getCurrentRole();

        String sender = "ADMIN".equals(role) ? "ADMIN" : "USER";
        String senderName = "ADMIN".equals(role) ? "管理员" : username;

        // 如果没有指定 conversationId，根据用户名生成
        if (conversationId == null || conversationId.isEmpty()) {
            conversationId = "conv_" + username;
        }

        Message message = messageService.sendMessage(conversationId, sender, senderName, content);
        return Result.success(message);
    }

    @Operation(summary = "将会话标记为已读")
    @PutMapping("/conversation/{conversationId}/read")
    public Result<Void> markConversationAsRead(
            @Parameter(description = "会话 ID", example = "conv_zhangsan", required = true)
            @PathVariable String conversationId) {
        messageService.markConversationAsRead(conversationId);
        return Result.success();
    }

    @Operation(summary = "全部标记为已读", description = "按当前 token 的角色范围处理")
    @PutMapping("/read-all")
    public Result<Void> markAllAsRead() {
        String role = BaseContext.getCurrentRole();
        messageService.markAllAsRead(role);
        return Result.success();
    }
}
